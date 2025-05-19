import pandas as pd
import lightgbm as lgb
import mlflow
import mlflow.lightgbm
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import RandomizedSearchCV
from sklearn.metrics import root_mean_squared_error
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import mlflow.pyfunc
import joblib
import os

import mlflow
import argparse

# Argument parser
parser = argparse.ArgumentParser(description="Retail Forecast Trainer")
parser.add_argument('--data_path', type=str, required=True, help='Path to processed_inventory.csv')
# parser.add_argument('--encoder_dir', type=str, default="models/encoders", help='Folder to save encoders and model artifacts')
args = parser.parse_args()

# Set the tracking URI to a custom folder (e.g., './my_mlruns')

tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "http://host.docker.internal:5000")
print(f"Trying to connect to {tracking_uri}")
mlflow.set_tracking_uri(tracking_uri)



class RetailForecastModel(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        # Load trained model
        self.model = joblib.load(context.artifacts["model"])
        
        # Load scaler
        self.scaler = joblib.load(context.artifacts["scaler"])

        # Load label encoders (dict of column name -> encoder)
        self.encoders = {}
        for col in ['Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']:
            self.encoders[col] = joblib.load(context.artifacts[f"{col}_encoder"])

    def preprocess(self, df):
        # Apply label encoding
        for col, encoder in self.encoders.items():
            df[col] = encoder.transform(df[col].astype(str))
        
        # Apply scaling
        numeric_cols = ['Price','Discount', 'Competitor Pricing','UnitsSold_lag_1', 'UnitsSold_lag_7', 'UnitsSold_lag_14',
                        'UnitsSold_rollmean_7', 'UnitsSold_rollmean_14', 'UnitsSold_rollmean_28']
        df[numeric_cols] = self.scaler.transform(df[numeric_cols])

        return df

    def predict(self, context, model_input):
        df_processed = self.preprocess(model_input.copy())
        return self.model.predict(df_processed)



# mlflow.set_tracking_uri("file:./mlruns")  # Ensures local logging
mlflow.set_experiment("retail_forecasting_comparison")

best_rmse = np.inf
best_model_type = None
best_model_uri = None
best_model_local_path = None
best_model = None

with mlflow.start_run() as run:

    run_id = run.info.run_id  # Save run ID for later
    
    artifacts = {}


    # Load processed features
    df = pd.read_csv(args.data_path, parse_dates=["Date"])

    encoder_dir=f"/mlruns/{run.info.experiment_id}/{run_id}/"
    os.makedirs(encoder_dir, exist_ok=True)

    cat_cols = ['Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']
    ### Label Encoding with saving
    for col in cat_cols :
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        joblib.dump(le, os.path.join(encoder_dir, f"{col}_encoder.pkl"))
        artifacts[f"{col}_encoder"] = os.path.join(encoder_dir, f"{col}_encoder.pkl")

    ### Min-Max Scaling for numeric features
    numeric_cols = ['Price','Discount', 'Competitor Pricing','UnitsSold_lag_1', 'UnitsSold_lag_7', 'UnitsSold_lag_14',
                    'UnitsSold_rollmean_7', 'UnitsSold_rollmean_14', 'UnitsSold_rollmean_28']
    scaler = MinMaxScaler()
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

    # Save scaler
    joblib.dump(scaler, os.path.join(encoder_dir, "numeric_scaler.pkl"))
    artifacts["scaler"] = os.path.join(encoder_dir, "numeric_scaler.pkl")

    # Features and Target
    features = [col for col in df.columns if col not in ['Date', 'Units Sold']]
    target = 'Units Sold'

    # Get cutoff date (80% quantile date)
    cutoff_date = df['Date'].quantile(0.8)

    # Date-based split
    df_train = df[df['Date'] <= cutoff_date]
    df_test = df[df['Date'] > cutoff_date]

    print(f"Train till {cutoff_date.date()}, Test from {df_test['Date'].min().date()}")

    # LightGBM Split
    X_train = df_train[features]
    y_train = df_train[target]
    X_test = df_test[features]
    y_test = df_test[target]


    ####### LightGBM ##########
    param_dist = {
        'num_leaves': np.arange(20, 160, 20),
        'learning_rate': [0.01, 0.05, 0.1],
        'max_depth': [ 5, 7, 10],
        'n_estimators': [50, 100, 200],
        'min_data_in_leaf': [3, 10, 20],
        'feature_fraction': [0.6, 0.8],
        'bagging_fraction': [0.6, 0.8],
        'lambda_l1': [0, 0.1, 0.5],
        'lambda_l2': [0, 0.1, 0.5],
    }

    # Initialize the model
    lgbm_model = lgb.LGBMRegressor(verbosity=2)

    # Perform randomized search
    random_search = RandomizedSearchCV(estimator=lgbm_model, param_distributions=param_dist, n_iter=10, cv=3, scoring='neg_mean_squared_error', verbose=2, n_jobs=-1, random_state=42)
    random_search.fit(X_train, y_train)

    # Train with early stopping
    # Get the best parameters and model
    print("Best parameters found: ", random_search.best_params_)
    best_lgbm_model = random_search.best_estimator_

    # Evaluate the model on the test set
    y_pred_best = best_lgbm_model.predict(X_test)
    rmse_lgb = root_mean_squared_error(y_test, y_pred_best)
    print(f"Best model RMSE: {rmse_lgb}")
    mlflow.log_metric("rmse_lgb", rmse_lgb)
    
    # Log model and get local path
    lgbm_uri = mlflow.lightgbm.log_model(best_lgbm_model, "best_lgbm_model")
    lgbm_local_path = f"/mlruns/{run.info.experiment_id}/{run_id}/artifacts/lgbm_model"

    if rmse_lgb < best_rmse:
        best_rmse = rmse_lgb
        best_model_type = "lgbm"
        best_model_uri = lgbm_uri.model_uri
        best_model_local_path = lgbm_local_path
        best_model = best_lgbm_model

    ####### Linear Regression ##########
    linreg_model = LinearRegression()
    linreg_model.fit(X_train, y_train)
    
    y_pred_linreg = linreg_model.predict(X_test)
    rmse_linreg = root_mean_squared_error(y_test, y_pred_linreg)
    mlflow.log_metric("rmse_linreg", rmse_linreg)
    print(f"rmse_linreg = {rmse_linreg}")

    linreg_uri = mlflow.sklearn.log_model(linreg_model, "linreg_model")
    linreg_local_path = f"/mlruns/{run.info.experiment_id}/{run_id}/artifacts/linreg_model"

    if rmse_linreg < best_rmse:
        best_rmse = rmse_linreg
        best_model_type = "linear_regression"
        best_model_uri = linreg_uri.model_uri
        best_model_local_path = linreg_local_path
        best_model = best_lgbm_model


    #### Log best model info ####
    mlflow.log_param("best_model_type", best_model_type)
    mlflow.log_param("best_model_uri", best_model_uri)

    #### Register best model to Registry ####
    model_name = "retail_forecasting_champion"
    # result = mlflow.register_model(
    #     model_uri=best_model_uri,
    #     name=model_name
    # )
    # joblib.dump(le, os.path.join(encoder_dir, f"{col}_encoder.pkl"))
    joblib.dump(best_model, os.path.join(encoder_dir, f"{model_name}.pkl"))
    artifacts["model"] = os.path.join(encoder_dir, f"{model_name}.pkl")
    
    result = mlflow.pyfunc.log_model(
    artifact_path="retail_forecast_model",
    python_model=RetailForecastModel(),  # 👈 this is your RetailForecastModel class!
    artifacts=artifacts,  # 👈 the dict containing model.pkl, scaler, encoders
    registered_model_name=model_name 
        )
    #### Add metadata tags ####
    client = mlflow.tracking.MlflowClient()
    client.set_registered_model_tag(model_name, "stage", "champion")
    client.set_registered_model_tag(model_name, "model_type", best_model_type)
    client.set_registered_model_tag(model_name, "input_format", "pandas dataframe with numerical features")
    client.set_registered_model_tag(model_name, "author", "Your Name")
    client.set_registered_model_tag(model_name, "description", "Best model selected from LightGBM and Linear Regression for retail sales forecasting.")
# Set alias to "champion"
    # client.set_registered_model_alias(name=model_name, alias="champion", version=result.model_version)
    version = getattr(result, 'version', None) or getattr(result, 'registered_model_version', None)
    print(f"Registered model version: {version}")

    client.set_registered_model_alias(name=model_name, alias="champion", version=version)


print(f"Best model: {best_model_type} with RMSE: {best_rmse}")
print(f"Model registered as '{model_name}' in MLflow Model Registry.")




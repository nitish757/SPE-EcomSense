from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mlflow
import pandas as pd
import numpy as np
import joblib
import os
import tempfile
import traceback
# Initialize FastAPI
app = FastAPI(title="Retail Forecast API", debug=True)

# tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "http://192.168.116.216:5000")
# print(f"Trying to connect to {tracking_uri}")
# mlflow.set_tracking_uri(tracking_uri)


# Define input schema
class PredictRequest(BaseModel):
    store_id: str
    product_id: str
    category: str
    region: str
    weather_condition: str
    seasonality: str
    price: float
    discount: float
    competitor_pricing: float
    holiday: int
    # Lag features (assume known for 1 day ahead)
    units_sold_lag_1: float
    units_sold_lag_7: float
    units_sold_lag_14: float
    units_sold_rollmean_7: float
    units_sold_rollmean_14: float
    units_sold_rollmean_28: float

# Load model + artifacts globally
class RetailForecastService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.encoders = {}
        self.load_model_and_artifacts()

    def load_model_and_artifacts(self):
        print("🔄 Downloading champion model from MLflow...")

        # Get champion model from MLflow
        model_uri = "/app/mlflow_artifacts"
        self.model = mlflow.pyfunc.load_model(model_uri)

        # Download artifacts (scalers, encoders)
        
        # mlflow.artifacts.download_artifacts(artifact_uri=model_uri, dst_path=tmp_dir)
        artifact_dir = os.path.join(model_uri, "artifacts")

        # Load scaler
        self.scaler = joblib.load(os.path.join(artifact_dir, "numeric_scaler.pkl"))

        # Load encoders
        encoder_cols = ['Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']
        for col in encoder_cols:
            path = os.path.join(artifact_dir, f"{col}_encoder.pkl")
            if os.path.exists(path):
                self.encoders[col] = joblib.load(path)

        print("✅ Model & artifacts loaded.")

    # def preprocess(self, req: PredictRequest):
    #     input_df = pd.DataFrame([req.dict()])

    #     # Label encode categorical cols
    #     for col, encoder in self.encoders.items():
    #         input_df[col] = encoder.transform(input_df[col].astype(str))

    #     # Scale numeric features
    #     numeric_cols = ['Price', 'Discount', 'Competitor Pricing', 
    #                     'UnitsSold_lag_1', 'UnitsSold_lag_7', 'UnitsSold_lag_14', 
    #                     'UnitsSold_rollmean_7', 'UnitsSold_rollmean_14', 'UnitsSold_rollmean_28']

    #     input_df[numeric_cols] = self.scaler.transform(input_df[numeric_cols])

    #     return input_df

    def preprocess(self, req: PredictRequest):
        input_dict = req.dict()

        # Mapping: API field -> model training column
        column_mapping = {
            'store_id': 'Store ID',
            'product_id': 'Product ID',
            'category': 'Category',
            'region': 'Region',
            'weather_condition': 'Weather Condition',
            'seasonality': 'Seasonality',
            'price': 'Price',
            'discount': 'Discount',
            'competitor_pricing': 'Competitor Pricing',
            'units_sold_lag_1': 'UnitsSold_lag_1',
            'units_sold_lag_7': 'UnitsSold_lag_7',
            'units_sold_lag_14': 'UnitsSold_lag_14',
            'units_sold_rollmean_7': 'UnitsSold_rollmean_7',
            'units_sold_rollmean_14': 'UnitsSold_rollmean_14',
            'units_sold_rollmean_28': 'UnitsSold_rollmean_28',
        }

        # Apply the mapping
        model_input = {model_col: input_dict[api_field] for api_field, model_col in column_mapping.items()}
        input_df = pd.DataFrame([model_input])
        print(input_df)
        for col, encoder in self.encoders.items():
            try:
                input_df[col] = encoder.transform(input_df[col].astype(str))
            except Exception as e:
                print(f"❌ Error encoding column '{col}': {e}")
                print("🔎 Input values:", input_df[col].tolist())
                traceback.print_exc()
                raise e  # Re-raise after logging

        print("Cat Cols modified")
        # Scale numeric features
        numeric_cols = [
            'Price', 'Discount', 'Competitor Pricing', 
            'UnitsSold_lag_1', 'UnitsSold_lag_7', 'UnitsSold_lag_14', 
            'UnitsSold_rollmean_7', 'UnitsSold_rollmean_14', 'UnitsSold_rollmean_28'
        ]
        input_df[numeric_cols] = self.scaler.transform(input_df[numeric_cols])
        print("Num Cols modified")
        return input_df



    # def predict(self, df_input):
    #     # df_input = self.preprocess(req)

    #     # Predict using loaded MLflow model
    #     forecast = self.model.predict(df_input)

    #     # Since model predicts 1-day ahead, simulate forecasts
    #     return {
    #         "1_day_forecast": float(forecast),
    #         "7_day_forecast": float(forecast * 7),  # naive multiply
    #         "14_day_forecast": float(forecast * 14),
    #         "28_day_forecast": float(forecast * 28)
    #     }

    def predict(self, df_input):
        df_input = df_input.copy()
        forecasts = []

        for step in [1, 7, 14, 28]:
            # Predict next step
            forecast = self.model.predict(df_input)[0]  # single value
            
            forecasts.append(forecast)

            # Update lag features for next step (shift lags)
            df_input['UnitsSold_lag_14'] = df_input['UnitsSold_lag_7']
            df_input['UnitsSold_lag_7'] = df_input['UnitsSold_lag_1'] 
            df_input['UnitsSold_lag_1'] = forecast
             # Simplified shifting
            

            df_input['UnitsSold_rollmean_7'] = forecast  # you can update with smarter rolling logic if needed
            df_input['UnitsSold_rollmean_14'] = forecast
            df_input['UnitsSold_rollmean_28'] = forecast

            df_input['WeekOfYear'] += df_input['WeekOfYear'] + 1

        return {
            "1_day_forecast": float(forecasts[0]),
            "7_day_forecast": float(forecasts[1]),
            "14_day_forecast": float(forecasts[2]),
            "28_day_forecast": float(forecasts[3]),
        }


# Initialize service
forecast_service = RetailForecastService()

# Endpoint
@app.post("/predict")
def predict(req: PredictRequest):
    # try:
        # Convert request to DataFrame
    df = pd.DataFrame([{
        "Store ID": req.store_id,
        "Product ID": req.product_id,
        "Category": req.category,
        "Region": req.region,
        "Price": req.price,
        "Discount": req.discount,
        "Weather Condition": req.weather_condition,
        "Holiday/Promotion": req.holiday,
        "Competitor Pricing": req.competitor_pricing,
        "Seasonality": req.seasonality,
        "UnitsSold_lag_1": req.units_sold_lag_1,
        "UnitsSold_lag_7": req.units_sold_lag_7,
        "UnitsSold_lag_14": req.units_sold_lag_14,
        "UnitsSold_rollmean_7": req.units_sold_rollmean_7,
        "UnitsSold_rollmean_14": req.units_sold_rollmean_14,
        "UnitsSold_rollmean_28": req.units_sold_rollmean_28,
        # Extra date/time features (fill with dummy or latest values)
        "DayOfWeek": 1,   # Monday
        "Month": 1,
        "Year": 2024,
        "WeekOfYear": 1
    }])

    print("Before predict ")
    # Predict
    preds = forecast_service.predict(df)
    print(preds)
    return preds
    # return {
    #     "1_day_forecast": float(preds[0]),
    #     "7_day_forecast": float(preds[0] * 7),
    #     "14_day_forecast": float(preds[0] * 14),
    #     "28_day_forecast": float(preds[0] * 28)
    # }

    # except Exception as e:
    #     print(f"🔥 ERROR: {e}")
    #     raise HTTPException(status_code=500, detail=str(e))
    

# # Run using: uvicorn forecastService:app --reload
# if __name__ == "__main__":
#     uvicorn.run("forecastService:app", host="0.0.0.0", port=8000, reload=True)

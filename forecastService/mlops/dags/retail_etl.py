from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
# from utils.feature_engineering import clean_and_engineer_features
import pandas as pd




def clean_and_engineer_features(raw_csv_path, output_csv_path):
    

    df = pd.read_csv(raw_csv_path, parse_dates=["Date"])

    # Extract Date Features
    df['DayOfWeek'] = df['Date'].dt.dayofweek
    df['Month'] = df['Date'].dt.month
    df['Year'] = df['Date'].dt.year
    df['WeekOfYear'] = df['Date'].dt.isocalendar().week

    # Drop unwanted columns
    drop_cols = ['Inventory Level', 'Units Ordered', 'Demand Forecast']
    df = df.drop(drop_cols, axis=1)

    # Sort by Store/Product/Date
    df = df.sort_values(by=['Store ID', 'Product ID', 'Date'])

    # Lag Features (previous demand)
    for lag in [1, 7, 14]:
        df[f'UnitsSold_lag_{lag}'] = df.groupby(['Store ID', 'Product ID'])['Units Sold'].shift(lag)

    # Rolling Mean Features
    for window in [7, 14, 28]:
        df[f'UnitsSold_rollmean_{window}'] = df.groupby(['Store ID', 'Product ID'])['Units Sold'].shift(1).rolling(window).mean()

    # Drop rows with NA from lag/rolling features
    df = df.dropna()
    
    # Save processed features
    df.to_csv(output_csv_path, index=False)
    print(f"Processed features saved to {output_csv_path}")



default_args = {
    'owner': 'airflow',
    'start_date': datetime(2024, 1, 1),
}

with DAG('retail_etl',
         default_args=default_args,
         schedule=None,
         catchup=False) as dag:

    def run_feature_engineering():
        
        raw_path = '/shared/retail_store_inventory_wo_jan_24.csv'
        processed_path = '/shared/processed_inventory.csv'
        clean_and_engineer_features(raw_path, processed_path)

    etl_task = PythonOperator(
        task_id='feature_engineering_task',
        python_callable=run_feature_engineering
    )

etl_task

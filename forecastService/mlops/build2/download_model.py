import os
import mlflow

tracking_uri = os.getenv("MLFLOW_TRACKING_URI")
mlflow.set_tracking_uri(tracking_uri)

model_path = "/mlflow_artifacts"
os.makedirs(model_path, exist_ok=True)

mlflow.artifacts.download_artifacts(
    artifact_uri="models:/retail_forecasting_champion@champion",
    dst_path=model_path
)
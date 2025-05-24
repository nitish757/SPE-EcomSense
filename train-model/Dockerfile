# trainer/Dockerfile

FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends libgomp1 && \
    rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy trainer script
COPY train_model.py .

ARG MLFLOW_TRACKING_URI=http://192.168.116.216:5000
ENV MLFLOW_TRACKING_URI=${MLFLOW_TRACKING_URI}

# Run trainer: expects /data/etl_output.csv to exist (mounted at runtime)
CMD ["python", "train_model.py", "--data", "/shared/processed_inventory.csv"]

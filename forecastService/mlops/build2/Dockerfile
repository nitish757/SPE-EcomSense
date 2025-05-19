# Stage 1: Download model from MLflow
FROM python:3.10-slim AS downloader

WORKDIR /app

# Install minimal build-time deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ libgomp1 && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./build2/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# COPY /home/m_b_ashish/forecastService/mlruns /mlruns

# Copy download script
COPY ./build2/download_model.py .


ARG MLFLOW_TRACKING_URI=http://192.168.116.216:5000
ENV MLFLOW_TRACKING_URI=${MLFLOW_TRACKING_URI}

# RUN --mount=type=bind,target=/mlruns,readonly,source=./mlruns
# RUN ls -r /
# Inside Dockerfile
# RUN --mount=type=bind,target=/mlruns,readonly,source=./mlruns \
#     ls -R /mlruns

# Run the download step
RUN --mount=type=bind,target=/mlruns,readonly,source=./mlruns \
    python download_model.py

RUN ls -r /mlflow_artifacts


# Stage 2: Final runtime image
FROM python:3.10-slim AS final

WORKDIR /app

# Install minimal build-time deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ libgomp1 && \
    rm -rf /var/lib/apt/lists/*



# Minimal runtime dependencies
COPY --from=downloader /mlflow_artifacts /app/mlflow_artifacts
RUN ls -r /app/mlflow_artifacts

COPY ./build2/forecastService.py .

# Install Python dependencies
COPY ./build2/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (e.g., 8000 for FastAPI)
EXPOSE 8000

# Command to run the API server
CMD ["uvicorn", "forecastService:app", "--host", "0.0.0.0", "--port", "8000"]

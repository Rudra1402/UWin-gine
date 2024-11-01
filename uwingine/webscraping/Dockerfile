# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file into the container and install dependencies in one layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    apt-get update && \
    apt-get install -y --no-install-recommends chromium-driver chromium && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code into the container
COPY . .

# Set the environment variables
ENV AWS_REGION=us-east-1
ENV S3_BUCKET_NAME_DATA=uwingine-data
ENV DYNAMODB_TABLE_NAME=Uwingine-Metadata


# Run the Python script
CMD ["python", "scraper1.py"]

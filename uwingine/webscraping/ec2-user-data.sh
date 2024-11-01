#!/bin/bash
# Update package lists
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Set AWS Region and log in to ECR
AWS_REGION="us-east-1" # Set your AWS region here
DOCKER_REPOSITORY_URL="milanrpatel/uwingine-webscraper" # Set your Docker URL here
DOCKER_IMAGE_TAG="latest" # Set the tag for the image

# Pull the Docker image from ECR
sudo docker pull ${DOCKER_REPOSITORY_URL}:${DOCKER_IMAGE_TAG}

# Run the Docker container
sudo docker run -d ${DOCKER_REPOSITORY_URL}:${DOCKER_IMAGE_TAG}
#!/bin/bash

# Pull latest image
docker pull ghcr.io/variz-h264/next-report:latest

# Stop and remove existing container
docker stop next-report || true
docker rm next-report || true

# Run new container
docker run -d \
  --name next-report \
  --env-file .env \
  -p 3000:3000 \
  ghcr.io/variz-h264/next-report:latest

# Show status
docker ps | grep next-report
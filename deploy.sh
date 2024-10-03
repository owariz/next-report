#!/bin/bash

# GitHub Container Registry login
echo $CR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

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
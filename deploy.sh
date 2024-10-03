#!/bin/bash

# ดึง image ล่าสุดจาก GitHub Container Registry
docker pull ghcr.io/Variz-h264/next-report:latest

# หยุดและลบ container เดิม (ถ้ามี)
docker stop nextjs-app || true
docker rm nextjs-app || true

# รัน container ใหม่
docker run -d \
  --name nextjs-app \
  --env-file .env \
  -p 3000:3000 \
  ghcr.io/Variz-h264/next-report:latest

# แสดงสถานะ
docker ps | grep nextjs-app
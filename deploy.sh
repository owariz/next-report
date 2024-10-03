#!/bin/bash

# Pull latest changes from GitHub
git pull origin main

# Install dependencies
npm install

# Build the application (ถ้าจำเป็น)
npm run build

# Stop the current instance (ใช้ pm2 หรือ forever แทน)
pm2 stop next-report || true

# Start the new instance
pm2 start npm --name next-report -- start

# Show status
pm2 status next-report

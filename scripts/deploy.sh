#!/bin/bash

set -e

echo "===== DEPLOY START ====="

cd /home/ubuntu/ecommerce

echo "[1/5] Pull latest code..."
git pull origin main

echo "[2/5] Building containers..."
docker compose build

echo "[3/5] Restarting application..."
docker compose up -d

echo "[4/5] Cleaning old Docker images..."
docker image prune -f

echo "[5/5] Deploy completed."

echo "===== DEPLOY SUCCESS ====="

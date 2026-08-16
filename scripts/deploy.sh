#!/bin/bash

set -e

cd /home/ubuntu/ecommerce

echo "===== DEPLOY START ====="

git pull origin main

docker compose up -d --build

docker image prune -f

echo "===== DEPLOY SUCCESS ====="

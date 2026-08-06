#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "========================================"
echo "1. Validate Docker Compose"
echo "========================================"

docker compose config --quiet
docker compose config --services

echo
echo "========================================"
echo "2. Check backend"
echo "========================================"

(
  cd backend

  echo "Installing backend dependencies..."
  npm ci

  echo "Checking JavaScript syntax..."
  find . \
    -path './node_modules' -prune \
    -o -name '*.js' -print0 \
    | xargs -0 -n1 node --check

  echo "Auditing production dependencies..."
  npm audit --omit=dev --audit-level=critical
)

echo
echo "========================================"
echo "3. Test and build frontend"
echo "========================================"

(
  cd frontend

  echo "Installing frontend dependencies..."
  npm ci

  echo "Running frontend tests..."
  CI=true npm test -- --watchAll=false --passWithNoTests

  echo "Building frontend..."
  CI=false REACT_APP_API_URL=/api npm run build
)

echo
echo "========================================"
echo "4. Build Docker images"
echo "========================================"

docker build \
  --tag ecommerce-backend:local-ci \
  ./backend

docker build \
  --tag ecommerce-frontend:local-ci \
  ./frontend

echo
echo "========================================"
echo "CI checks completed successfully"
echo "========================================"

docker image ls \
  ecommerce-backend:local-ci \
  ecommerce-frontend:local-ci

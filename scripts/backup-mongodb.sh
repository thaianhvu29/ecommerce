#!/bin/bash

set -e

BACKUP_DIR="/tmp/ecommerce-backup"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
ARCHIVE="/tmp/ecommerce-mongodb-${TIMESTAMP}.tar.gz"

S3_BUCKET="${S3_BUCKET:-thaianhvu-ecommerce-2026-731246410488}"
S3_PREFIX="ecommerce-backups"

echo "===== MongoDB Backup ====="
echo "Time: $(date)"

rm -rf "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

echo "[1/4] Creating MongoDB dump..."

docker exec mongodb mongodump \
    --db ecommerce \
    --out /tmp/mongodump

docker cp mongodb:/tmp/mongodump "$BACKUP_DIR/"

echo "[2/4] Compressing backup..."

tar -czf "$ARCHIVE" -C "$BACKUP_DIR" mongodump

echo "[3/4] Uploading to S3..."

aws s3 cp "$ARCHIVE" \
    "s3://${S3_BUCKET}/${S3_PREFIX}/"

echo "[4/4] Cleaning temporary files..."

rm -rf "$BACKUP_DIR"
rm -f "$ARCHIVE"

echo "===== BACKUP SUCCESS ====="

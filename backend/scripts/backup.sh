#!/bin/bash

# ====================================================
# EduSphere MongoDB Automated Backup Strategy Script
# ====================================================

# Configuration Variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/edusphere/mongodb"
BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"
MONGO_URI="${MONGO_URI:-mongodb://localhost:27017/edusphere}"
RETENTION_DAYS=7

echo "[$(date)] Starting MongoDB automated database backup..."

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Execute Database Dump
mongodump --uri="${MONGO_URI}" --out="${BACKUP_PATH}" --gzip

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup completed successfully: ${BACKUP_PATH}"

  # Create tarball archive
  tar -czf "${BACKUP_PATH}.tar.gz" -C "${BACKUP_DIR}" "backup_${TIMESTAMP}"
  rm -rf "${BACKUP_PATH}"
  echo "[$(date)] Archive created: ${BACKUP_PATH}.tar.gz"

  # Prune backups older than RETENTION_DAYS
  echo "[$(date)] Pruning archives older than ${RETENTION_DAYS} days..."
  find "${BACKUP_DIR}" -type f -name "*.tar.gz" -mtime +${RETENTION_DAYS} -exec rm -f {} \;
  echo "[$(date)] Pruning finished."
else
  echo "[$(date)] ERROR: MongoDB backup failed!" >&2
  exit 1
fi

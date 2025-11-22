#!/bin/bash

# Database Backup Script
# Creates a MongoDB database backup using mongodump

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="${MONGO_INITDB_DATABASE:-hcl}"
MONGO_USER="${MONGO_INITDB_ROOT_USERNAME:-admin}"
MONGO_PASS="${MONGO_INITDB_ROOT_PASSWORD:-admin123}"
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup file name
BACKUP_FILE="$BACKUP_DIR/database-backup-$TIMESTAMP"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║           Starting MongoDB Database Backup               ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  Database: $DB_NAME"
echo "║  Host: $MONGO_HOST:$MONGO_PORT"
echo "║  Backup File: $BACKUP_FILE"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if mongodump is available
if ! command -v mongodump &> /dev/null; then
    echo "Error: mongodump is not installed or not in PATH"
    echo "Please install MongoDB Database Tools:"
    echo "  Ubuntu/Debian: sudo apt-get install mongodb-database-tools"
    echo "  macOS: brew install mongodb-database-tools"
    exit 1
fi

# Create backup
if [ -n "$MONGO_USER" ] && [ -n "$MONGO_PASS" ]; then
    # With authentication
    mongodump \
        --host "$MONGO_HOST:$MONGO_PORT" \
        --username "$MONGO_USER" \
        --password "$MONGO_PASS" \
        --authenticationDatabase admin \
        --db "$DB_NAME" \
        --out "$BACKUP_FILE"
else
    # Without authentication
    mongodump \
        --host "$MONGO_HOST:$MONGO_PORT" \
        --db "$DB_NAME" \
        --out "$BACKUP_FILE"
fi

# Compress backup
echo ""
echo "Compressing backup..."
tar -czf "$BACKUP_FILE.tar.gz" -C "$BACKUP_DIR" "database-backup-$TIMESTAMP"
rm -rf "$BACKUP_FILE"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE.tar.gz" | cut -f1)

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║           Database Backup Completed Successfully          ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  Backup File: $BACKUP_FILE.tar.gz"
echo "║  Size: $BACKUP_SIZE"
echo "║  Timestamp: $TIMESTAMP"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

#!/bin/bash

# Database Backup Script
# Creates a MongoDB database backup using mongodump

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="${MONGO_INITDB_DATABASE:-hcl}"
MONGO_USER="${MONGO_INITDB_ROOT_USERNAME:-admin}"
MONGO_PASS="${MONGO_INITDB_ROOT_PASSWORD:-admin123}"
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup file name
BACKUP_FILE="$BACKUP_DIR/database-backup-$TIMESTAMP"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║           Starting MongoDB Database Backup               ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  Database: $DB_NAME"
echo "║  Host: $MONGO_HOST:$MONGO_PORT"
echo "║  Backup File: $BACKUP_FILE"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if mongodump is available
if ! command -v mongodump &> /dev/null; then
    echo "Error: mongodump is not installed or not in PATH"
    echo "Please install MongoDB Database Tools:"
    echo "  Ubuntu/Debian: sudo apt-get install mongodb-database-tools"
    echo "  macOS: brew install mongodb-database-tools"
    exit 1
fi

# Create backup
if [ -n "$MONGO_USER" ] && [ -n "$MONGO_PASS" ]; then
    # With authentication
    mongodump \
        --host "$MONGO_HOST:$MONGO_PORT" \
        --username "$MONGO_USER" \
        --password "$MONGO_PASS" \
        --authenticationDatabase admin \
        --db "$DB_NAME" \
        --out "$BACKUP_FILE"
else
    # Without authentication
    mongodump \
        --host "$MONGO_HOST:$MONGO_PORT" \
        --db "$DB_NAME" \
        --out "$BACKUP_FILE"
fi

# Compress backup
echo ""
echo "Compressing backup..."
tar -czf "$BACKUP_FILE.tar.gz" -C "$BACKUP_DIR" "database-backup-$TIMESTAMP"
rm -rf "$BACKUP_FILE"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE.tar.gz" | cut -f1)

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║           Database Backup Completed Successfully          ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  Backup File: $BACKUP_FILE.tar.gz"
echo "║  Size: $BACKUP_SIZE"
echo "║  Timestamp: $TIMESTAMP"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""


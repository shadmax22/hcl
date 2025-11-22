# Database Schema Backup System

## Overview

A comprehensive backup system has been created for the HCL database schema. This system provides two types of backups:

1. **Schema Backups** - JSON files containing complete schema structure
2. **Database Backups** - Compressed MongoDB dumps with full data

## Files Created

### Scripts
- `scripts/backupSchema.ts` - TypeScript script to extract and backup schema structure
- `scripts/backupDatabase.sh` - Shell script to create MongoDB database dumps

### Documentation
- `backups/SCHEMA_DOCUMENTATION.md` - Complete schema documentation
- `backups/README.md` - Backup usage instructions
- `backups/BACKUP_SUMMARY.md` - This file

## Usage

### Quick Commands

```bash
# Backup schema only
npm run backup:schema

# Backup database only  
npm run backup:database

# Backup both
npm run backup:all
```

### Schema Backup

The schema backup creates a JSON file in `backups/` directory with:
- Complete field definitions
- Index information
- Timestamp configurations
- Metadata (database name, timestamp, Mongoose version)

**Output:** `backups/schema-backup-YYYY-MM-DDTHH-MM-SS-sssZ.json`

### Database Backup

The database backup uses `mongodump` to create a compressed archive with:
- All collections
- All documents
- Index definitions
- Database structure

**Output:** `backups/database-backup-YYYYMMDD_HHMMSS.tar.gz`

## Database Schema

The database consists of 13 collections:

1. **users** - User accounts (patients and healthcare providers)
2. **roles** - User roles and permissions
3. **healthcarecategories** - Healthcare provider categories
4. **healthcareproviders** - Healthcare provider profiles
5. **patientdoctormappings** - Patient-doctor relationships
6. **goals** - Wellness goals
7. **goallogs** - Daily goal tracking logs
8. **trackingrecords** - Health tracking records (weight, BMI)
9. **preventivecarereminders** - Preventive care reminders
10. **notifications** - User notifications
11. **healthtips** - Daily health tips
12. **categories** - General categories
13. **auditlogs** - Audit logs for security

## Backup Location

All backups are stored in: `backend/backups/`

## Restore Instructions

### Restore Schema Backup
Schema backups are for reference only. Use them to:
- Understand schema structure
- Plan migrations
- Document changes

### Restore Database Backup

```bash
# Extract backup
tar -xzf backups/database-backup-YYYYMMDD_HHMMSS.tar.gz

# Restore to MongoDB
mongorestore --host localhost:27017 \
  --username admin \
  --password admin123 \
  --authenticationDatabase admin \
  --db hcl \
  backups/database-backup-YYYYMMDD_HHMMSS/hcl
```

## Notes

- Schema backups are lightweight and suitable for version control
- Database backups include all data and should be stored securely
- Backups are timestamped for easy identification
- Always verify backups before deleting old data
- Consider setting up automated backups via cron jobs

## Prerequisites

- MongoDB Database Tools (`mongodump`, `mongorestore`) must be installed
- Node.js and npm must be installed
- Database connection must be configured in environment variables

## Environment Variables

The backup scripts use these environment variables (with defaults):
- `MONGODB_URI` (default: `mongodb://localhost:27017/hcl`)
- `MONGO_INITDB_DATABASE` (default: `hcl`)
- `MONGO_INITDB_ROOT_USERNAME` (default: `admin`)
- `MONGO_INITDB_ROOT_PASSWORD` (default: `admin123`)
- `MONGO_HOST` (default: `localhost`)
- `MONGO_PORT` (default: `27017`)


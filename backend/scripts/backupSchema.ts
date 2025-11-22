/**
 * @fileoverview Database Schema Backup Script
 * @description Creates a backup of the database schema structure
 */

import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import Database from '../config/database';

interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  enum?: string[];
  ref?: string;
  unique?: boolean;
  index?: boolean;
  min?: number;
  max?: number;
  match?: string;
  select?: boolean;
  trim?: boolean;
  lowercase?: boolean;
  description?: string;
}

interface SchemaDefinition {
  collectionName: string;
  modelName: string;
  fields: SchemaField[];
  indexes: Array<{
    fields: Record<string, number>;
    options?: {
      unique?: boolean;
      sparse?: boolean;
    };
  }>;
  timestamps: {
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Extract schema information from a Mongoose model
 */
function extractSchemaInfo(model: mongoose.Model<any>): SchemaDefinition {
  const schema = model.schema;
  const fields: SchemaField[] = [];
  const indexes: Array<{ fields: Record<string, number>; options?: any }> = [];

  // Extract fields
  schema.eachPath((pathName: string, pathType: any) => {
    const field: SchemaField = {
      name: pathName,
      type: pathType.instance || pathType.constructor.name,
    };

    // Extract field options
    if (pathType.options) {
      if (pathType.options.required) field.required = true;
      if (pathType.options.default !== undefined) field.default = pathType.options.default;
      if (pathType.options.enum) field.enum = pathType.options.enum;
      if (pathType.options.ref) field.ref = pathType.options.ref;
      if (pathType.options.unique) field.unique = true;
      if (pathType.options.index) field.index = true;
      if (pathType.options.min !== undefined) field.min = pathType.options.min;
      if (pathType.options.max !== undefined) field.max = pathType.options.max;
      if (pathType.options.match) field.match = pathType.options.match.toString();
      if (pathType.options.select === false) field.select = false;
      if (pathType.options.trim) field.trim = true;
      if (pathType.options.lowercase) field.lowercase = true;
    }

    fields.push(field);
  });

  // Extract indexes
  const schemaIndexes = schema.indexes();
  schemaIndexes.forEach((index: any) => {
    indexes.push({
      fields: index[0],
      options: index[1],
    });
  });

  // Extract timestamps configuration
  const timestamps: { createdAt?: string; updatedAt?: string } = {};
  const timestampOptions = schema.get('timestamps');
  if (timestampOptions) {
    if (typeof timestampOptions === 'object' && timestampOptions !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const opts: any = timestampOptions;
      // Handle Mongoose timestamp options which can be string | true
      const createdAtField = opts.createdAt;
      const updatedAtField = opts.updatedAt;
      timestamps.createdAt = typeof createdAtField === 'string' ? createdAtField : 'createdAt';
      timestamps.updatedAt = typeof updatedAtField === 'string' ? updatedAtField : 'updatedAt';
    } else if (timestampOptions === true) {
      timestamps.createdAt = 'createdAt';
      timestamps.updatedAt = 'updatedAt';
    }
  }

  return {
    collectionName: model.collection.name,
    modelName: model.modelName,
    fields,
    indexes,
    timestamps,
  };
}

/**
 * Main backup function
 */
async function backupSchema() {
  try {
    // Connect to database
    await Database.connect();

    // Import all models
    const {
      User,
      Role,
      HealthcareCategory,
      HealthcareProvider,
      PatientDoctorMapping,
      Goal,
      GoalLog,
      TrackingRecord,
      PreventiveCareReminder,
      Notification,
      HealthTip,
      Category,
      AuditLog,
    } = await import('../models');

    const models = [
      { name: 'User', model: User },
      { name: 'Role', model: Role },
      { name: 'HealthcareCategory', model: HealthcareCategory },
      { name: 'HealthcareProvider', model: HealthcareProvider },
      { name: 'PatientDoctorMapping', model: PatientDoctorMapping },
      { name: 'Goal', model: Goal },
      { name: 'GoalLog', model: GoalLog },
      { name: 'TrackingRecord', model: TrackingRecord },
      { name: 'PreventiveCareReminder', model: PreventiveCareReminder },
      { name: 'Notification', model: Notification },
      { name: 'HealthTip', model: HealthTip },
      { name: 'Category', model: Category },
      { name: 'AuditLog', model: AuditLog },
    ];

    const schemaBackup: Record<string, SchemaDefinition> = {};
    const backupMetadata = {
      timestamp: new Date().toISOString(),
      database: mongoose.connection.name,
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hcl',
      mongooseVersion: mongoose.version,
      totalModels: models.length,
    };

    // Extract schema info from each model
    for (const { name, model } of models) {
      schemaBackup[name] = extractSchemaInfo(model);
    }

    const backupData = {
      metadata: backupMetadata,
      schemas: schemaBackup,
    };

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Save backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `schema-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf-8');

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║           Database Schema Backup Completed                ║
╠═══════════════════════════════════════════════════════════╣
║  Backup File: ${backupFile.padEnd(47)} ║
║  Models Backed Up: ${models.length.toString().padEnd(42)} ║
║  Timestamp: ${backupMetadata.timestamp.padEnd(45)} ║
╚═══════════════════════════════════════════════════════════╝
    `);

    // Disconnect from database
    await Database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error backing up schema:', error);
    await Database.disconnect();
    process.exit(1);
  }
}

// Run backup
backupSchema();


/**
 * @fileoverview Role Model - Defines user roles
 * @description Simplified MVP schema for user roles (patient, healthcare_provider, admin)
 */

import mongoose, { Schema } from 'mongoose';

const RoleSchema: Schema = new Schema<any>(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      enum: ['patient', 'healthcare_provider', 'admin'],
    },
    stat: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Note: unique: true on role_name automatically creates a unique index

export default mongoose.model<any>('Role', RoleSchema);


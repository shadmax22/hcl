/**
 * @fileoverview HealthcareCategory Model - Categories for healthcare providers
 * @description Simplified MVP schema for healthcare provider categories
 */

import mongoose, { Schema } from 'mongoose';

const HealthcareCategorySchema: Schema = new Schema<any>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

// Essential index only
HealthcareCategorySchema.index({ name: 1 }, { unique: true });

export default mongoose.model<any>(
  'HealthcareCategory',
  HealthcareCategorySchema
);


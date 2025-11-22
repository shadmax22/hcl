/**
 * @fileoverview HealthcareProvider Model - Healthcare provider profiles
 * @description Simplified MVP schema for healthcare providers
 */

import mongoose, { Schema } from 'mongoose';

const HealthcareProviderSchema: Schema = new Schema<any>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    specialisation: {
      type: String,
      required: true,
      trim: true,
    },
    care_category: {
      type: Schema.Types.ObjectId,
      ref: 'HealthcareCategory',
      required: true,
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
HealthcareProviderSchema.index({ user: 1 }, { unique: true });

export default mongoose.model<any>(
  'HealthcareProvider',
  HealthcareProviderSchema
);


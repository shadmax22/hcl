/**
 * @fileoverview HealthTip Model - Daily health tips
 * @description Simplified MVP schema for health tips of the day
 */

import mongoose, { Schema } from 'mongoose';

const HealthTipSchema: Schema = new Schema<any>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    display_date: {
      type: Date,
      required: true,
      unique: true,
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
HealthTipSchema.index({ display_date: 1 }, { unique: true });

export default mongoose.model<any>('HealthTip', HealthTipSchema);


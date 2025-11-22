/**
 * @fileoverview TrackingRecord Model - Health tracking records
 * @description Simplified MVP schema for tracking health metrics
 */

import mongoose, { Schema } from 'mongoose';

const TrackingRecordSchema: Schema = new Schema<any>(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ['weight', 'bmi'],
    },
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  }
);

// Essential index only
TrackingRecordSchema.index({ patient_id: 1, type: 1, created_at: -1 });

export default mongoose.model<any>(
  'TrackingRecord',
  TrackingRecordSchema
);


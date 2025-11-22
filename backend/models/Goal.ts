/**
 * @fileoverview Goal Model - Wellness goals for patients
 * @description Simplified MVP schema for patient wellness goals
 */

import mongoose, { Schema } from 'mongoose';

const GoalSchema: Schema = new Schema<any>(
  {
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tracking_type: {
      type: String,
      required: true,
      enum: ['weight', 'bmi', 'steps'],
    },
    target_value: {
      type: Number,
      required: true,
      min: 0,
    },
    due_date: {
      type: Date,
      required: true,
    },
    stat: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Essential indexes only
GoalSchema.index({ patient_id: 1, stat: 1 });

export default mongoose.model<any>('Goal', GoalSchema);


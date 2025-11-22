/**
 * @fileoverview GoalLog Model - Daily goal tracking logs
 * @description Simplified MVP schema for daily goal progress logs
 */

import mongoose, { Schema } from 'mongoose';

const GoalLogSchema: Schema = new Schema<any>(
  {
    goal_id: {
      type: Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
      index: true,
    },
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    actual_value: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  }
);

// Essential index only - one log per goal per day
GoalLogSchema.index({ goal_id: 1, date: 1 }, { unique: true });

export default mongoose.model<any>('GoalLog', GoalLogSchema);


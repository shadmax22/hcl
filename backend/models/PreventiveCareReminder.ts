/**
 * @fileoverview PreventiveCareReminder Model - Preventive care reminders
 * @description Simplified MVP schema for preventive care reminders
 */

import mongoose, { Schema } from 'mongoose';

const PreventiveCareReminderSchema: Schema = new Schema<any>(
  {
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reminder_type: {
      type: String,
      required: true,
      trim: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
    stat: {
      type: String,
      enum: ['active', 'completed'],
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
PreventiveCareReminderSchema.index({ patient_id: 1, stat: 1 });

export default mongoose.model<any>(
  'PreventiveCareReminder',
  PreventiveCareReminderSchema
);


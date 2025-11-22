/**
 * @fileoverview Notification Model - User notifications
 * @description Simplified MVP schema for user notifications
 */

import mongoose, { Schema } from 'mongoose';

const NotificationSchema: Schema = new Schema<any>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['reminder', 'goal_update', 'system'],
      default: 'system',
    },
    is_read: {
      type: Boolean,
      default: false,
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
NotificationSchema.index({ user_id: 1, is_read: 1, created_at: -1 });

export default mongoose.model<any>('Notification', NotificationSchema);


/**
 * @fileoverview AuditLog Model - Audit logging for security and privacy
 * @description Simplified MVP schema for audit logs tracking user actions
 */

import mongoose, { Schema } from 'mongoose';

const AuditLogSchema: Schema = new Schema<any>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
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
AuditLogSchema.index({ user_id: 1, created_at: -1 });

export default mongoose.model<any>('AuditLog', AuditLogSchema);


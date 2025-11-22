/**
 * @fileoverview User Model - Core user accounts for patients and healthcare providers
 * @description Simplified MVP schema for users (2-year scope)
 */

import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema<any>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    phone_no: {
      type: String,
      trim: true,
    },
    DOB: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    stat: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
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
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, stat: 1 });

export default mongoose.model<any>('User', UserSchema);


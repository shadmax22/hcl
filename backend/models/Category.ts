/**
 * @fileoverview Category Model - General categories
 * @description Simplified MVP schema for general categories
 */

import mongoose, { Schema } from 'mongoose';

const CategorySchema: Schema = new Schema<any>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
CategorySchema.index({ name: 1 }, { unique: true });

export default mongoose.model<any>('Category', CategorySchema);


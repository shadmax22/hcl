/**
 * @fileoverview PatientDoctorMapping Model - Relationship between patients and doctors
 * @description Simplified MVP schema for mapping patients to their healthcare providers
 */

import mongoose, { Schema } from 'mongoose';

const PatientDoctorMappingSchema: Schema = new Schema<any>(
  {
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: 'HealthcareProvider',
      required: true,
      index: true,
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

// Essential index - unique mapping
PatientDoctorMappingSchema.index({ patient_id: 1, doctor_id: 1 }, { unique: true });

export default mongoose.model<any>(
  'PatientDoctorMapping',
  PatientDoctorMappingSchema
);


/**
 * @fileoverview Models Index - Central export for all Mongoose models
 * @description Exports all models for easy importing throughout the application
 */

export { default as User } from './User';
export { default as Role } from './Role';
export { default as HealthcareCategory } from './HealthcareCategory';
export { default as HealthcareProvider } from './HealthcareProvider';
export { default as PatientDoctorMapping } from './PatientDoctorMapping';
export { default as Goal } from './Goal';
export { default as GoalLog } from './GoalLog';
export { default as TrackingRecord } from './TrackingRecord';
export { default as PreventiveCareReminder } from './PreventiveCareReminder';
export { default as Notification } from './Notification';
export { default as HealthTip } from './HealthTip';
export { default as Category } from './Category';
export { default as AuditLog } from './AuditLog';


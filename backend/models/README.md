# Mongoose Schema Plan - Healthcare Wellness Platform

## Overview
This document outlines all Mongoose models (schemas) for the Healthcare Wellness Platform database.

## Models Summary

### Core Models (14 Total)

1. **User** - User accounts (patients and healthcare providers)
2. **Role** - User roles and permissions
3. **HealthcareCategory** - Categories for healthcare providers
4. **HealthcareProvider** - Healthcare provider profiles
5. **PatientDoctorMapping** - Relationship between patients and doctors
6. **Goal** - Wellness goals for patients
7. **GoalLog** - Daily goal tracking logs
8. **TrackingRecord** - Health tracking records (weight, BMI)
9. **PreventiveCareReminder** - Preventive care reminders
10. **Notification** - User notifications
11. **HealthTip** - Daily health tips
12. **Category** - General categories
13. **AuditLog** - Audit logging for security
14. **PatientProfile** (Optional) - Extended patient profile information

## Schema Relationships

```
User (1) ──→ (N) Role
User (1) ──→ (1) HealthcareProvider
User (1) ──→ (N) Goal
User (1) ──→ (N) GoalLog
User (1) ──→ (N) TrackingRecord
User (1) ──→ (N) PreventiveCareReminder
User (1) ──→ (N) Notification
User (1) ──→ (N) AuditLog

HealthcareProvider (1) ──→ (N) PatientDoctorMapping
User (Patient) (1) ──→ (N) PatientDoctorMapping

HealthcareCategory (1) ──→ (N) HealthcareProvider

Goal (1) ──→ (N) GoalLog
```

## Index Strategy

All models include appropriate indexes for:
- Unique constraints (email, role_name, etc.)
- Foreign key lookups (patient_id, doctor_id, etc.)
- Status filtering (stat field)
- Date-based queries (created_at, due_date, etc.)
- Compound indexes for common query patterns

## Status Field Convention

Most models use a `stat` field with values:
- `'active'` - Active/current records
- `'inactive'` - Inactive records
- Model-specific statuses (e.g., 'pending_verification', 'completed', 'expired')

## Timestamps

All models include:
- `created_at` - Automatic timestamp on creation
- `updated_at` - Automatic timestamp on update (via pre-save hook)


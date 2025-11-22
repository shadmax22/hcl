# Database Schema Documentation

This document provides a comprehensive overview of the database schema structure.

**Last Updated:** Generated automatically by backup script

## Database Information

- **Database Type:** MongoDB
- **Database Name:** hcl
- **ORM/ODM:** Mongoose

---

## Collections Overview

### 1. User
**Collection Name:** `users`

Core user accounts for patients and healthcare providers.

#### Fields
- `name` (String, required) - User's full name
- `email` (String, required, unique, indexed) - User's email address
- `password` (String, required, minlength: 8, select: false) - Hashed password
- `previousPasswords` (Array[String], maxlength: 5, select: false) - Last 5 hashed passwords
- `phone_no` (String, optional) - Phone number
- `DOB` (Date, optional) - Date of birth
- `gender` (Enum: 'male' | 'female' | 'other' | 'prefer_not_to_say', optional)
- `stat` (Enum: 'active' | 'inactive' | 'suspended', default: 'active', indexed)
- `role` (ObjectId, required, ref: 'Role', indexed) - User role reference
- `consentGiven` (Boolean, default: false) - Privacy consent flag
- `consentDate` (Date, optional) - Date consent was given
- `allergies` (Array[String], default: []) - List of allergies
- `current_medications` (Array[String], default: []) - Current medications
- `medical_conditions` (Array[String], default: []) - Medical conditions
- `emergency_contact` (Object, optional)
  - `name` (String)
  - `relationship` (String)
  - `phone` (String)
- `address` (Object, optional)
  - `street` (String)
  - `city` (String)
  - `state` (String)
  - `zip_code` (String)
- `created_at` (Date, auto) - Creation timestamp
- `updated_at` (Date, auto) - Update timestamp

#### Indexes
- `email` (unique)
- `role`
- `stat`
- Compound: `role + stat`

---

### 2. Role
**Collection Name:** `roles`

User roles and permissions.

#### Fields
- `role_name` (String, required, unique, enum: 'patient' | 'healthcare_provider' | 'admin')
- `role_descriptions` (String, optional)
- `permissions` (String, default: '{}') - JSON string containing permissions
- `stat` (Enum: 'active' | 'inactive', default: 'active', indexed)
- `created_by` (ObjectId, optional, ref: 'User')
- `created_at` (Date, auto)
- `updated_at` (Date, auto)

#### Indexes
- `role_name` (unique)

---

### 3. HealthcareCategory
**Collection Name:** `healthcarecategories`

Categories for healthcare providers.

#### Fields
- `name` (String, required, unique, indexed)
- `description` (String, optional)
- `feature_idea` (String, optional)
- `stat` (Enum: 'active' | 'inactive', default: 'active')
- `created_by` (ObjectId, optional, ref: 'User')
- `created_at` (Date, auto)
- `updated_at` (Date, auto)

#### Indexes
- `name` (unique)

---

### 4. HealthcareProvider
**Collection Name:** `healthcareproviders`

Healthcare provider profiles.

#### Fields
- `user` (ObjectId, required, unique, ref: 'User', indexed)
- `full_name` (String, required)
- `medical_certificate` (String, required)
- `specialisation` (String, required)
- `care_category` (ObjectId, required, ref: 'HealthcareCategory', indexed)
- `year_of_experience` (Number, optional, min: 0)
- `portfolio_url` (String, optional) - Valid URL format
- `stat` (Enum: 'active' | 'inactive' | 'pending_verification', default: 'pending_verification', indexed)
- `created_by` (ObjectId, optional, ref: 'User')
- `updated_by` (ObjectId, optional, ref: 'User')
- `created_at` (Date, auto)
- `updated_at` (Date, auto)

#### Indexes
- `user` (unique)
- `care_category`
- `stat`
- Compound: `care_category + stat`

---

### 5. PatientDoctorMapping
**Collection Name:** `patientdoctormappings`

Relationship between patients and doctors.

#### Fields
- `patient_id` (ObjectId, required, ref: 'User', indexed)
- `doctor_id` (ObjectId, required, ref: 'HealthcareProvider', indexed)
- `stat` (Enum: 'active' | 'inactive' | 'ended', default: 'active', indexed)
- `created_at` (Date, auto)
- `updated_at` (Date, auto)

#### Indexes
- `patient_id`
- `doctor_id`
- `stat`
- Compound: `patient_id + doctor_id`
- Compound: `doctor_id + stat`
- Compound: `patient_id + stat`

---

### 6. Goal
**Collection Name:** `goals`

Wellness goals for patients.

#### Fields
- `patient_id` (ObjectId, required, ref: 'User', indexed)
- `doctor_id` (ObjectId, optional, ref: 'HealthcareProvider', indexed)
- `tracking_type` (String, required, enum: 'weight' | 'bmi' | 'steps' | 'sleep' | 'water' | 'exercise' | 'blood_pressure' | 'heart_rate', indexed)
- `value` (Number, required, min: 0) - Target value
- `condition` (String, required, enum: '>' | '<' | '=') - Operator for goal condition
- `duration` (Date, required, indexed) - Completion deadline
- `stat` (Enum: 'active' | 'completed' | 'cancelled' | 'expired', default: 'active', indexed)
- `created_at` (Date, auto)
- `updated_at` (Date, auto)

#### Indexes
- `patient_id`
- `doctor_id`
- `tracking_type`
- `stat`
- `duration`
- Compound: `patient_id + stat`
- Compound: `patient_id + tracking_type`
- Compound: `doctor_id + stat`

---

### 7. GoalLog
**Collection Name:** `goallogs`

Daily goal tracking logs.

#### Fields
- `goal_id` (ObjectId, required, ref: 'Goal', indexed)
- `patient_id` (ObjectId, required, ref: 'User', indexed)
- `date` (Date, required, indexed)
- `actual_value` (Number, required, min: 0)
- `is_completed` (Boolean, default: false)
- `notes` (String, optional)
- `created_at` (Date, auto)

#### Indexes
- `goal_id`
- `patient_id`
- `date`
- Compound: `goal_id + date` (unique) - One log per goal per day
- Compound: `patient_id + date` (descending)
- Compound: `goal_id + date` (descending)

---

### 8. TrackingRecord
**Collection Name:** `trackingrecords`

Health tracking records (weight, BMI).

#### Fields
- `value` (Number, required, min: 0)
- `type` (String, required, enum: 'weight' | 'bmi', indexed)
- `patient_id` (ObjectId, required, ref: 'User', indexed)
- `stat` (Enum: 'active' | 'deleted', default: 'active')
- `created_at` (Date, auto, indexed)
- `updated_at` (Date, auto)

#### Indexes
- `patient_id`
- `type`
- `created_at`
- Compound: `patient_id + type + created_at` (descending)
- Compound: `patient_id + stat`

---

### 9. PreventiveCareReminder
**Collection Name:** `preventivecarereminders`

Preventive care reminders.

#### Fields
- `patient_id` (ObjectId, required, ref: 'User', indexed)
- `reminder_type` (String, required) - e.g., 'Annual blood test', 'Dental checkup', 'Vaccination'
- `due_date` (Date, required, indexed)
- `is_completed` (Boolean, default: false, indexed)
- `completed_date` (Date, optional)
- `notes` (String, optional)
- `stat` (Enum: 'active' | 'completed' | 'cancelled', default: 'active', indexed)
- `created_at` (Date, auto)
- `updated_at` (Date, auto)

#### Indexes
- `patient_id`
- `due_date`
- `is_completed`
- `stat`
- Compound: `patient_id + stat + due_date`
- Compound: `patient_id + is_completed`
- Compound: `due_date + stat`

---

### 10. Notification
**Collection Name:** `notifications`

User notifications.

#### Fields
- `user_id` (ObjectId, required, ref: 'User', indexed)
- `message` (String, required)
- `type` (String, enum: 'reminder' | 'goal_update' | 'system' | 'alert', default: 'system')
- `is_read` (Boolean, default: false, indexed)
- `read_at` (Date, optional)
- `stat` (Enum: 'active' | 'deleted' | 'archived', default: 'active', indexed)
- `created_at` (Date, auto, indexed)
- `updated_at` (Date, auto)

#### Indexes
- `user_id`
- `stat`
- `is_read`
- `created_at`
- Compound: `user_id + stat + is_read`
- Compound: `user_id + created_at` (descending)

---

### 11. HealthTip
**Collection Name:** `healthtips`

Daily health tips.

#### Fields
- `title` (String, required)
- `content` (String, required)
- `display_date` (Date, required, unique, indexed)
- `category` (ObjectId, optional, ref: 'Category')
- `stat` (Enum: 'active' | 'inactive', default: 'active', indexed)
- `created_at` (Date, auto)
- `updated_at` (Date, auto)

#### Indexes
- `display_date` (unique)
- `stat`

---

### 12. Category
**Collection Name:** `categories`

General categories (used by HealthTips, etc.).

#### Fields
- `name` (String, required, unique, indexed)
- `description` (String, optional)
- `created_by` (ObjectId, optional, ref: 'User')
- `created_at` (Date, auto)
- `updated_at` (Date, auto)

#### Indexes
- `name` (unique)

---

### 13. AuditLog
**Collection Name:** `auditlogs`

Audit logging for security and privacy.

#### Fields
- `user_id` (ObjectId, required, ref: 'User', indexed)
- `action` (String, required, indexed) - e.g., 'login', 'view_patient', 'update_profile', 'access_data', 'password_change'
- `resource_type` (String, optional, indexed) - e.g., 'patient', 'goal', 'reminder', 'tracking_record'
- `resource_id` (ObjectId, optional)
- `ip_address` (String, optional)
- `user_agent` (String, optional)
- `details` (Mixed, default: {}) - Additional context as JSON object
- `created_at` (Date, auto, indexed)

#### Indexes
- `user_id`
- `action`
- `created_at`
- `resource_type`
- Compound: `user_id + created_at` (descending)
- Compound: `resource_type + resource_id`
- Compound: `action + created_at` (descending)

---

## Relationships

1. **User → Role**: Many-to-One (User.role → Role._id)
2. **User → HealthcareProvider**: One-to-One (HealthcareProvider.user → User._id)
3. **HealthcareProvider → HealthcareCategory**: Many-to-One (HealthcareProvider.care_category → HealthcareCategory._id)
4. **PatientDoctorMapping → User**: Many-to-One (patient_id → User._id)
5. **PatientDoctorMapping → HealthcareProvider**: Many-to-One (doctor_id → HealthcareProvider._id)
6. **Goal → User**: Many-to-One (patient_id → User._id)
7. **Goal → HealthcareProvider**: Many-to-One (doctor_id → HealthcareProvider._id)
8. **GoalLog → Goal**: Many-to-One (goal_id → Goal._id)
9. **GoalLog → User**: Many-to-One (patient_id → User._id)
10. **TrackingRecord → User**: Many-to-One (patient_id → User._id)
11. **PreventiveCareReminder → User**: Many-to-One (patient_id → User._id)
12. **Notification → User**: Many-to-One (user_id → User._id)
13. **HealthTip → Category**: Many-to-One (category → Category._id)

---

## Backup Instructions

### Schema Backup (TypeScript)
```bash
npm run backup:schema
```
Creates a JSON file with complete schema structure in `backups/` directory.

### Database Backup (MongoDB)
```bash
npm run backup:database
```
Creates a compressed MongoDB dump using `mongodump` in `backups/` directory.

### Full Backup
```bash
npm run backup:all
```
Runs both schema and database backups.

---

## Notes

- All timestamps are automatically managed by Mongoose
- Password fields are excluded from queries by default (`select: false`)
- Audit logs are immutable (no `updated_at` field)
- Goal logs have unique constraint: one log per goal per day
- Most collections use soft delete pattern with `stat` field


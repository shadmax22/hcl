# MVP Product Plan - Healthcare Wellness Platform

## Technology Stack
- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Architecture**: MVC (Model-View-Controller)

---

## Project Overview
A healthcare wellness platform that connects patients with healthcare providers, allowing patients to track their wellness goals and receive preventive care reminders, while providers can monitor patient compliance and health status.

**User Types:**
- Patients
- Healthcare Providers

---

## Core Features

### 1. Secure Authentication System
- **Login and Registration**
  - Separate registration flows for patients and healthcare providers
  - Login functionality for both user types
  - Role-based access control

- **JWT-based Session Management**
  - JWT token generation and validation
  - Token expiration handling
  - Refresh token mechanism (if needed)

- **Password Security**
  - Password hashing using bcrypt
  - Password strength requirements
  - **Password History Prevention**: Store last 5 previous passwords to prevent reuse
  - Secure password reset functionality (future consideration)

### 2. Healthcare Provider View
- **Patient List**
  - View all assigned patients
  - Clickable list to navigate to individual patient details

- **Compliance Status Tracking**
  - Display patient compliance status (e.g., "Goal Met", "Missed Preventive Checkup")
  - Visual indicators for compliance status
  - Filter/search patients by compliance status

- **Patient Details View**
  - View individual patient goals
  - View patient compliance history
  - Access to patient profile information (with proper permissions)

### 3. Patient Dashboard
- **Wellness Goals Progress**
  - Display progress for various wellness goals:
    - Steps taken
    - Hours of sleep
    - Water intake
    - Other customizable goals
  - Visual progress indicators (charts, progress bars)
  - Historical data tracking

- **Preventive Care Reminders**
  - Display upcoming preventive care appointments
  - Format: "Upcoming: Annual blood test on [date]"
  - Notification system for reminders
  - Ability to mark reminders as completed

### 4. Public Health Information Page
- **Static Content**
  - General health information
  - Privacy policy
  - Terms of service
  - About page

- **Health Tip of the Day**
  - Daily rotating health tips
  - Simple display mechanism
  - Can be updated by administrators (future consideration)

### 5. Goal Tracker for Patients
- **Daily Goal Logging**
  - Allow patients to log daily goals:
    - Steps
    - Water intake
    - Sleep hours
    - Exercise minutes
    - Other customizable goals
  - Date-based tracking
  - Historical data view
  - Goal completion status

### 6. Profile Management
- **Patient Profile**
  - View profile information
  - Edit profile information
  - Basic health information fields:
    - Allergies
    - Current medications
    - Medical conditions
    - Emergency contact information
    - Personal demographics

- **Healthcare Provider Profile**
  - View provider profile
  - Edit provider information
  - Specialization details
  - Contact information

### 7. Privacy & Security Measures
- **Audit Logging**
  - Log all user actions related to data access
  - Track who accessed what data and when
  - Log authentication events
  - Log data modifications

- **Data Consent Management**
  - Consent checkbox during registration
  - Track consent status
  - Allow users to view/update consent preferences
  - *[Additional consent features to be specified]*

---

## Database Schema (Mongoose Models)

### 1. Users Table (User Model)
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (unique, required, indexed)
- `password`: String (hashed, required)
- `previousPasswords`: [String] (array of last 5 hashed passwords for prevention)
- `phone_no`: String
- `DOB`: Date (Date of Birth)
- `gender`: String (enum: ['male', 'female', 'other', 'prefer_not_to_say'])
- `stat`: String (status: 'active', 'inactive', 'suspended', default: 'active')
- `role`: ObjectId (reference to Roles Table, required, indexed)
- `consentGiven`: Boolean (default: false) - *Added for MVP consent feature*
- `consentDate`: Date - *Added for MVP consent feature*
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now, updated on save)

**Indexes:**
- `email` - Unique index
- `role` - Index for role-based queries
- `stat` - Index for status filtering

### 2. Roles Table (Role Model)
- `_id`: ObjectId (role_id)
- `role_name`: String (unique, required, e.g., 'patient', 'healthcare_provider', 'admin')
- `role_descriptions`: String
- `permissions`: String (JSON string containing permission object)
  - Example: `{"can_view_patients": true, "can_edit_goals": true, ...}`
- `stat`: String (status: 'active', 'inactive', default: 'active')
- `created_by`: ObjectId (reference to User)
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `role_name` - Unique index

### 3. Health Care Categories (HealthcareCategory Model)
- `_id`: ObjectId
- `name`: String (required, unique)
- `description`: String
- `feature_idea`: String (optional feature description)
- `stat`: String (status: 'active', 'inactive', default: 'active')
- `created_by`: ObjectId (reference to User)
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `name` - Unique index

### 4. Health Care Providers (HealthcareProvider Model)
- `_id`: ObjectId
- `user`: ObjectId (reference to Users Table, required, unique, indexed)
- `full_name`: String (required)
- `medical_certificate`: String (certificate number/document, required)
- `specialisation`: String (required)
- `care_category`: ObjectId (reference to Health Care Categories, indexed)
- `year_of_experience`: Number
- `portfolio_url`: String (URL to portfolio/website)
- `stat`: String (status: 'active', 'inactive', 'pending_verification', default: 'pending_verification')
- `created_by`: ObjectId (reference to User)
- `updated_by`: ObjectId (reference to User)
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `user` - Unique index
- `care_category` - Index for category filtering
- `stat` - Index for status filtering

### 5. Patients Doctor Mapping (PatientDoctorMapping Model)
- `_id`: ObjectId
- `patient_id`: ObjectId (reference to Users Table where role is patient, required, indexed)
- `doctor_id`: ObjectId (reference to Health Care Providers, required, indexed)
- `stat`: String (status: 'active', 'inactive', 'ended', default: 'active')
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `patient_id` - Index for patient queries
- `doctor_id` - Index for doctor queries
- Compound index: `{patient_id: 1, doctor_id: 1}` - For unique mapping queries
- `stat` - Index for status filtering

### 6. Tracking Records (TrackingRecord Model)
- `_id`: ObjectId
- `value`: Number (required, the tracked value)
- `type`: String (enum: ['weight', 'bmi'], required, indexed)
- `patient_id`: ObjectId (reference to Users Table, required, indexed)
- `created_at`: Date (default: Date.now, indexed)
- `updated_at`: Date (default: Date.now)
- `stat`: String (status: 'active', 'deleted', default: 'active')

**Indexes:**
- `patient_id` - Index for patient queries
- `type` - Index for type filtering
- `created_at` - Index for date-based queries
- Compound index: `{patient_id: 1, type: 1, created_at: -1}` - For efficient patient tracking queries

### 7. Goals (Goal Model)
- `_id`: ObjectId
- `patient_id`: ObjectId (reference to Users Table, required, indexed)
- `doctor_id`: ObjectId (reference to Health Care Providers, indexed)
- `tracking_type`: String (required, e.g., 'weight', 'bmi', 'steps', 'sleep', 'water', 'exercise')
- `value`: Number (target value, required)
- `condition`: String (enum: ['>', '<', '='], required) - Operator for goal condition
- `duration`: Date (till when it should be completed, required)
- `stat`: String (status: 'active', 'completed', 'cancelled', 'expired', default: 'active')
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `patient_id` - Index for patient queries
- `doctor_id` - Index for doctor queries
- `tracking_type` - Index for type filtering
- `stat` - Index for status filtering
- `duration` - Index for expiration queries
- Compound index: `{patient_id: 1, stat: 1}` - For active patient goals

### 8. Goal Logs (GoalLog Model) - *Added for MVP daily goal tracking*
- `_id`: ObjectId
- `goal_id`: ObjectId (reference to Goals, required, indexed)
- `patient_id`: ObjectId (reference to Users Table, required, indexed)
- `date`: Date (required, indexed)
- `actual_value`: Number (required)
- `is_completed`: Boolean (default: false)
- `notes`: String
- `created_at`: Date (default: Date.now)

**Indexes:**
- `goal_id` - Index for goal queries
- `patient_id` - Index for patient queries
- `date` - Index for date-based queries
- Compound index: `{goal_id: 1, date: 1}` - Unique constraint for one log per goal per day

### 9. Categories (Category Model)
- `_id`: ObjectId
- `name`: String (required, unique)
- `description`: String
- `created_by`: ObjectId (reference to User)
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `name` - Unique index

### 10. Notifications (Notification Model)
- `_id`: ObjectId
- `user_id`: ObjectId (reference to Users Table, required, indexed)
- `message`: String (required)
- `type`: String (enum: ['reminder', 'goal_update', 'system', 'alert'], default: 'system') - *Added for MVP*
- `is_read`: Boolean (default: false) - *Added for MVP*
- `read_at`: Date - *Added for MVP*
- `stat`: String (status: 'active', 'deleted', 'archived', default: 'active')
- `created_at`: Date (default: Date.now, indexed)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `user_id` - Index for user queries
- `stat` - Index for status filtering
- `is_read` - Index for unread notifications
- `created_at` - Index for date-based queries
- Compound index: `{user_id: 1, stat: 1, is_read: 1}` - For efficient notification queries

### 11. Preventive Care Reminders (PreventiveCareReminder Model) - *Added for MVP*
- `_id`: ObjectId
- `patient_id`: ObjectId (reference to Users Table, required, indexed)
- `reminder_type`: String (required, e.g., 'Annual blood test', 'Dental checkup', 'Vaccination')
- `due_date`: Date (required, indexed)
- `is_completed`: Boolean (default: false)
- `completed_date`: Date
- `notes`: String
- `stat`: String (status: 'active', 'completed', 'cancelled', default: 'active')
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `patient_id` - Index for patient queries
- `due_date` - Index for date queries
- `is_completed` - Index for completion status
- Compound index: `{patient_id: 1, stat: 1, due_date: 1}` - For upcoming reminders

### 12. Health Tips (HealthTip Model) - *Added for MVP*
- `_id`: ObjectId
- `title`: String (required)
- `content`: String (required)
- `display_date`: Date (required, unique, indexed)
- `category`: ObjectId (reference to Categories) - *Added for organization*
- `stat`: String (status: 'active', 'inactive', default: 'active')
- `created_at`: Date (default: Date.now)
- `updated_at`: Date (default: Date.now)

**Indexes:**
- `display_date` - Unique index
- `stat` - Index for active tips

### 13. Audit Logs (AuditLog Model) - *Added for MVP privacy & security*
- `_id`: ObjectId
- `user_id`: ObjectId (reference to Users Table, required, indexed)
- `action`: String (required, e.g., 'login', 'view_patient', 'update_profile', 'access_data', 'password_change')
- `resource_type`: String (e.g., 'patient', 'goal', 'reminder', 'tracking_record')
- `resource_id`: ObjectId
- `ip_address`: String
- `user_agent`: String
- `details`: Object (additional context as JSON)
- `created_at`: Date (default: Date.now, indexed)

**Indexes:**
- `user_id` - Index for user audit logs
- `action` - Index for action filtering
- `created_at` - Index for time-based queries
- `resource_type` - Index for resource filtering
- Compound index: `{user_id: 1, created_at: -1}` - For user activity timeline

### 14. Patient Profile Extensions - *Additional fields for MVP*
Since Users table contains basic info, we can extend with:
- `allergies`: [String] - *Added for MVP*
- `current_medications`: [String] - *Added for MVP*
- `medical_conditions`: [String] - *Added for MVP*
- `emergency_contact`: Object - *Added for MVP*
  - `name`: String
  - `relationship`: String
  - `phone`: String
- `address`: Object - *Added for MVP*
  - `street`: String
  - `city`: String
  - `state`: String
  - `zip_code`: String

**Note:** These can be stored as:
- Option 1: Additional fields in Users table (if role is 'patient')
- Option 2: Separate PatientProfile collection with reference to Users
- Option 3: Embedded document in Users table (MongoDB allows flexible schema)

---

## API Endpoints

### Authentication Routes
- `POST /api/auth/register/patient` - Patient registration
- `POST /api/auth/register/provider` - Healthcare provider registration
- `POST /api/auth/login` - Login for both user types
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh JWT token (if implemented)
- `GET /api/auth/me` - Get current user info

### Patient Routes
- `GET /api/patients/dashboard` - Get patient dashboard data
- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update patient profile
- `GET /api/patients/goals` - Get all patient goals
- `POST /api/patients/goals` - Create new goal
- `GET /api/patients/goals/:goalId` - Get specific goal
- `PUT /api/patients/goals/:goalId` - Update goal
- `DELETE /api/patients/goals/:goalId` - Delete goal
- `POST /api/patients/goals/:goalId/log` - Log daily goal progress
- `GET /api/patients/goals/:goalId/logs` - Get goal logs
- `GET /api/patients/reminders` - Get preventive care reminders
- `PUT /api/patients/reminders/:reminderId/complete` - Mark reminder as completed

### Healthcare Provider Routes
- `GET /api/providers/dashboard` - Get provider dashboard
- `GET /api/providers/patients` - Get list of assigned patients
- `GET /api/providers/patients/:patientId` - Get patient details
- `GET /api/providers/patients/:patientId/goals` - Get patient goals
- `GET /api/providers/patients/:patientId/compliance` - Get patient compliance status
- `GET /api/providers/profile` - Get provider profile
- `PUT /api/providers/profile` - Update provider profile

### Public Routes
- `GET /api/public/health-tip` - Get today's health tip
- `GET /api/public/health-info` - Get general health information
- `GET /api/public/privacy-policy` - Get privacy policy

### Audit Log Routes (Admin/Internal)
- `GET /api/audit-logs` - Get audit logs (with filters)
- `GET /api/audit-logs/:logId` - Get specific audit log

---

## User Stories

### As a Patient:
1. I want to register and login securely so that my health data is protected
2. I want to view my wellness goals progress so that I can track my health improvements
3. I want to log my daily goals (steps, sleep, water) so that I can maintain my wellness routine
4. I want to see preventive care reminders so that I don't miss important health checkups
5. I want to view and edit my profile so that my healthcare provider has accurate information
6. I want to see health tips so that I can learn about maintaining good health

### As a Healthcare Provider:
1. I want to login securely so that I can access patient information safely
2. I want to view my assigned patients so that I can monitor their health
3. I want to see patient compliance status so that I can identify who needs attention
4. I want to view patient goals and progress so that I can provide better care
5. I want to see patient profile information so that I have context for their health status

---

## Technical Requirements

### Security Requirements
- JWT tokens with appropriate expiration (e.g., 24 hours for access token)
- Password hashing with bcrypt (minimum 10 rounds)
- HTTPS in production
- Input validation and sanitization
- CORS configuration
- Rate limiting on authentication endpoints
- SQL injection prevention (MongoDB injection prevention)
- XSS protection

### Data Privacy Requirements
- Audit logging for all data access
- Consent management system
- Secure storage of sensitive health information
- Role-based access control (RBAC)
- Data encryption at rest (MongoDB encryption)
- Secure API endpoints with authentication middleware

### Performance Requirements
- API response time < 500ms for most endpoints
- Efficient database queries with proper indexing
- Pagination for list endpoints
- Caching for static content (health tips, public info)

### Validation Requirements
- Email format validation
- Password strength validation (min 8 chars, uppercase, lowercase, number)
- Date validation for goals and reminders
- Required field validation
- Data type validation

---

## Database Indexes Summary

### Users Table
- `email` - Unique index
- `role` - Index for role-based queries
- `stat` - Index for status filtering

### Roles Table
- `role_name` - Unique index

### Health Care Categories
- `name` - Unique index

### Health Care Providers
- `user` - Unique index
- `care_category` - Index for category filtering
- `stat` - Index for status filtering

### Patients Doctor Mapping
- `patient_id` - Index for patient queries
- `doctor_id` - Index for doctor queries
- Compound: `{patient_id: 1, doctor_id: 1}` - For unique mapping
- `stat` - Index for status filtering

### Tracking Records
- `patient_id` - Index for patient queries
- `type` - Index for type filtering
- `created_at` - Index for date-based queries
- Compound: `{patient_id: 1, type: 1, created_at: -1}` - For efficient queries

### Goals
- `patient_id` - Index for patient queries
- `doctor_id` - Index for doctor queries
- `tracking_type` - Index for type filtering
- `stat` - Index for status filtering
- `duration` - Index for expiration queries
- Compound: `{patient_id: 1, stat: 1}` - For active patient goals

### Goal Logs
- `goal_id` - Index for goal queries
- `patient_id` - Index for patient queries
- `date` - Index for date-based queries
- Compound: `{goal_id: 1, date: 1}` - Unique constraint

### Categories
- `name` - Unique index

### Notifications
- `user_id` - Index for user queries
- `stat` - Index for status filtering
- `is_read` - Index for unread notifications
- `created_at` - Index for date-based queries
- Compound: `{user_id: 1, stat: 1, is_read: 1}` - For efficient queries

### Preventive Care Reminders
- `patient_id` - Index for patient queries
- `due_date` - Index for date queries
- `is_completed` - Index for completion status
- Compound: `{patient_id: 1, stat: 1, due_date: 1}` - For upcoming reminders

### Health Tips
- `display_date` - Unique index
- `stat` - Index for active tips

### Audit Logs
- `user_id` - Index for user audit logs
- `action` - Index for action filtering
- `created_at` - Index for time-based queries
- `resource_type` - Index for resource filtering
- Compound: `{user_id: 1, created_at: -1}` - For user activity timeline

---

## Middleware Requirements
- Authentication middleware (JWT verification)
- Authorization middleware (role-based access)
- Error handling middleware
- Request logging middleware
- Input validation middleware
- Rate limiting middleware
- Audit logging middleware (for data access tracking)

---

## Environment Variables Needed
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - JWT expiration time
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `BCRYPT_ROUNDS` - Number of bcrypt rounds
- `CORS_ORIGIN` - Allowed CORS origins

---

## Timeline & Milestones

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup and configuration
- [ ] Database schema design and implementation
- [ ] Authentication system (registration, login, JWT)
- [ ] Basic user models (Patient, HealthcareProvider)

### Phase 2: Core Features (Week 3-4)
- [ ] Patient dashboard
- [ ] Goal tracking system
- [ ] Goal logging functionality
- [ ] Profile management

### Phase 3: Provider Features (Week 5)
- [ ] Healthcare provider dashboard
- [ ] Patient list and details view
- [ ] Compliance status tracking

### Phase 4: Additional Features (Week 6)
- [ ] Preventive care reminders
- [ ] Public health information page
- [ ] Health tip of the day

### Phase 5: Security & Privacy (Week 7)
- [ ] Audit logging system
- [ ] Consent management
- [ ] Security hardening
- [ ] Testing and bug fixes

---

## Notes

### Consent Management Feature
- *[Additional details about consent checkbox and data usage to be provided]*
- Need to clarify:
  - What specific data usage requires consent?
  - Can users revoke consent?
  - How does consent affect data access?
  - What happens if consent is not given?

### Future Considerations
- Email notifications for reminders
- SMS notifications
- Mobile app integration
- Advanced analytics and reporting
- Multi-language support
- Integration with health devices (Fitbit, Apple Health, etc.)
- Telemedicine features
- Appointment scheduling
- Prescription management


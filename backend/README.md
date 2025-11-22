# Healthcare Wellness Platform - Backend API

Backend API server built with Express.js, TypeScript, and MongoDB using MVC architecture.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Technology Stack](#-technology-stack)
- [Authentication](#-authentication)
- [User Roles](#-user-roles)
- [Backup & Maintenance](#-backup--maintenance)
- [Docker Setup](#-docker-setup)
- [Testing](#-testing)
- [Contributing](#-contributing)

## ✨ Features

### Core Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Healthcare Provider, Patient)
  - Secure password hashing with bcrypt
  - Password strength validation
  - Password history tracking

- **User Management**
  - Patient registration and profile management
  - Healthcare provider registration with verification
  - Admin user management
  - User statistics and analytics

- **Patient Features**
  - Health tracking records (blood pressure, weight, glucose, etc.)
  - Health goals management
  - Preventive care reminders
  - Notifications system
  - Profile management

- **Healthcare Provider Features**
  - Patient management
  - Create and manage patient goals
  - View patient health records
  - Patient assignment system
  - Notifications

- **Admin Features**
  - User management (create, view, update users)
  - Doctor/Healthcare provider management
  - Care categories management
  - System statistics
  - Database backup utilities

- **System Features**
  - Scheduled jobs (goal notifications)
  - Audit logging
  - Health tips management
  - Healthcare categories
  - Database backup scripts

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (running locally or accessible via connection string)
- **TypeScript** (installed as dev dependency)

### Optional
- **Docker** and **Docker Compose** (for containerized MongoDB setup)

## 📦 Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env  # If .env.example exists
   # Or create .env file manually
   ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables) section)

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://admin:admin123@localhost:27017/hcl?authSource=admin

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Security Configuration
BCRYPT_ROUNDS=10
CORS_ORIGIN=*

# Optional: MongoDB Express (if using docker-compose)
# ME_CONFIG_MONGODB_ADMINUSERNAME=admin
# ME_CONFIG_MONGODB_ADMINPASSWORD=admin123
```

### Environment Variable Descriptions

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing (change in production!)
- `JWT_EXPIRES_IN`: JWT token expiration time (e.g., "24h", "7d")
- `BCRYPT_ROUNDS`: Number of bcrypt rounds for password hashing (default: 10)
- `CORS_ORIGIN`: Allowed CORS origins (use `*` for all or specific domain)

## 🗄️ Database Setup

### Option 1: Using Docker Compose (Recommended)

1. **Start MongoDB using Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MongoDB on port `27017`
   - Mongo Express (web UI) on port `8081` (optional)

2. **Access Mongo Express** (optional)
   - URL: http://localhost:8081
   - Username: `admin`
   - Password: `admin123`

### Option 2: Local MongoDB Installation

1. **Install MongoDB** locally
2. **Start MongoDB service**
   ```bash
   # On Linux
   sudo systemctl start mongod
   
   # On macOS
   brew services start mongodb-community
   ```

3. **Update MONGODB_URI** in `.env` if needed

### Initialize Database

After MongoDB is running, initialize the database with required data:

```bash
# Initialize all required data (roles, admin user, care categories)
npm run init:all

# Or initialize individually:
npm run init:roles          # Create default roles
npm run init:admin          # Create admin user
npm run init:care-categories # Create care categories
```

### Seed Sample Data (Optional)

To populate the database with sample data for testing:

```bash
npm run seed:data
```

## 🏃 Running the Application

### Development Mode

```bash
# Start development server with auto-reload
npm run dev

# Or with watch mode
npm run dev:watch
```

The server will start on `http://localhost:3000` (or your configured PORT).

### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Health Check

Once the server is running, you can check if it's healthy:

```bash
curl http://localhost:3000/health
```

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/v1
```

### Main Endpoint Groups

#### Authentication (`/v1/auth`)
- `POST /v1/auth/signup` - General user signup
- `POST /v1/auth/register-patient` - Patient registration
- `POST /v1/auth/login` - User login
- `GET /v1/auth/me` - Get current authenticated user

#### Admin (`/v1/admin`) - Admin only
- `GET /v1/admin/users` - Get all users
- `GET /v1/admin/doctors` - Get all doctors
- `GET /v1/admin/care-categories` - Get care categories
- `GET /v1/admin/statistics` - Get system statistics
- `POST /v1/admin/users` - Create new user
- `POST /v1/admin/doctors` - Create new doctor
- `POST /v1/admin/care-categories` - Create care category

#### Patient (`/v1/patient`) - Patient only
- `GET /v1/patient/profile` - Get patient profile
- `GET /v1/patient/goals` - Get patient goals
- `GET /v1/patient/tracking-records` - Get tracking records
- `GET /v1/patient/tracking-records/categories` - Get tracking categories
- `POST /v1/patient/tracking-records` - Add tracking record
- `PUT /v1/patient/tracking-records/:id` - Update tracking record
- `DELETE /v1/patient/tracking-records/:id` - Delete tracking record
- `GET /v1/patient/reminders` - Get preventive care reminders
- `GET /v1/patient/notifications` - Get notifications

#### Doctor/Healthcare Provider (`/v1/doctor`) - Healthcare Provider only
- `GET /v1/doctor/profile` - Get doctor profile
- `GET /v1/doctor/patients` - Get assigned patients
- `GET /v1/doctor/patients/:patientId` - Get patient details
- `GET /v1/doctor/patients/:patientId/goals` - Get patient goals
- `POST /v1/doctor/patients/:patientId/goals` - Create goal for patient
- `GET /v1/doctor/notifications` - Get notifications

#### Jobs (`/v1/jobs`) - Admin only
- `POST /v1/jobs/goal-notifications/run` - Manually trigger goal notification job

### API Documentation

For detailed API documentation, see:
- [AUTH_SETUP.md](./AUTH_SETUP.md) - Authentication setup and endpoints
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference (if exists)

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   └── database.ts      # MongoDB connection configuration
├── controllers/         # Request handlers (MVC Controllers)
│   ├── adminController.ts
│   ├── authController.ts
│   ├── doctorController.ts
│   └── patientController.ts
├── middleware/          # Express middleware
│   └── authMiddleware.ts # JWT authentication & authorization
├── models/              # Mongoose schemas and models
│   ├── User.ts
│   ├── Role.ts
│   ├── Goal.ts
│   ├── TrackingRecord.ts
│   ├── HealthcareProvider.ts
│   └── ... (other models)
├── routes/              # API route definitions
│   ├── adminRoutes.ts
│   ├── authRoutes.ts
│   ├── doctorRoutes.ts
│   ├── patientRoutes.ts
│   └── jobRoutes.ts
├── services/            # Business logic services
│   └── authService.ts   # Authentication service
├── jobs/                # Scheduled jobs
│   └── goalNotificationJob.ts
├── scripts/             # Utility scripts
│   ├── initRoles.ts
│   ├── initAdmin.ts
│   ├── initCareCategories.ts
│   ├── seedSampleData.ts
│   ├── backupSchema.ts
│   └── backupDatabase.sh
├── backups/             # Database backups
├── index.ts             # Application entry point
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── docker-compose.yml   # Docker Compose configuration
```

## 📜 Available Scripts

### Development Scripts
```bash
npm run dev          # Start development server (ts-node)
npm run dev:watch    # Start with auto-reload (ts-node-dev)
npm run build        # Build TypeScript to JavaScript
npm run build:watch  # Build with watch mode
npm start            # Run production build
npm run typecheck    # Type check without building
npm run clean        # Remove dist directory
```

### Linting Scripts
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
```

### Database Initialization Scripts
```bash
npm run init:roles          # Initialize default roles
npm run init:admin          # Initialize admin user
npm run init:care-categories # Initialize care categories
npm run init:all            # Initialize all (roles + admin + categories)
npm run seed:data           # Seed sample data
```

### Backup Scripts
```bash
npm run backup:schema       # Backup database schema
npm run backup:database    # Backup database (using shell script)
npm run backup:all         # Backup both schema and database
```

### Job Scripts
```bash
npm run job:goal-notifications # Run goal notification job manually
```

## 🛠️ Technology Stack

### Runtime & Framework
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM (Object Document Mapper)

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ts-node** - TypeScript execution
- **ts-node-dev** - Development server with auto-reload
- **ESLint** - Code linting
- **Morgan** - HTTP request logger

### Scheduled Jobs
- **node-cron** - Cron job scheduler

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to Use

1. **Register or Login** to get a token
   ```bash
   POST /v1/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Include token in requests**
   ```
   Authorization: Bearer <your-token>
   ```

3. **Get current user**
   ```bash
   GET /v1/auth/me
   Authorization: Bearer <your-token>
   ```

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Password history tracking (prevents reuse of last 5 passwords)

## 👥 User Roles

The system supports three main roles:

1. **Admin** (`admin`)
   - Full system access
   - User and doctor management
   - System statistics
   - Care category management

2. **Healthcare Provider** (`healthcare_provider`)
   - View assigned patients
   - Create and manage patient goals
   - View patient health records
   - Receive notifications

3. **Patient** (`patient`)
   - View own profile and data
   - Manage health tracking records
   - View goals and reminders
   - Receive notifications

### Role-Based Access Control

All endpoints (except signup/login) require authentication. Role-specific endpoints require the appropriate role:

- Admin endpoints: `authorize(['admin'])`
- Patient endpoints: `authorize(['patient'])`
- Doctor endpoints: `authorize(['healthcare_provider'])`

## 💾 Backup & Maintenance

### Database Backup

The project includes backup scripts for database maintenance:

```bash
# Backup database schema (JSON format)
npm run backup:schema

# Backup full database (using mongodump)
npm run backup:database

# Backup both
npm run backup:all
```

Backups are stored in the `backups/` directory.

### Scheduled Jobs

The system includes scheduled jobs for automated tasks:

- **Goal Notifications**: Sends notifications to patients about their health goals
  - Runs automatically on schedule
  - Can be manually triggered: `POST /v1/jobs/goal-notifications/run` (admin only)

## 🐳 Docker Setup

### Using Docker Compose

The project includes a `docker-compose.yml` file for easy MongoDB setup:

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Stop and remove volumes
docker-compose down -v
```

### Services

- **MongoDB**: Port `27017`
- **Mongo Express**: Port `8081` (web UI for MongoDB)

## 🧪 Testing

Currently, no automated tests are configured. Consider adding:

- Unit tests (Jest/Mocha)
- Integration tests
- API endpoint tests
- Authentication tests

### Manual Testing

You can test the API using:

- **cURL** commands
- **Postman** or **Insomnia**
- **Frontend application**

Example test:
```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Code Style

- Follow TypeScript best practices
- Use async/await for asynchronous operations
- Follow MVC architecture pattern
- Use meaningful variable and function names
- Add comments for complex logic

## 🤝 Contributing

1. Follow the existing code style
2. Ensure TypeScript compiles without errors (`npm run typecheck`)
3. Run linting (`npm run lint`)
4. Update documentation for new endpoints
5. Test your changes thoroughly
6. Create meaningful commit messages

## 📄 License

ISC

## 📞 Support

For issues or questions:
- Check existing documentation
- Review [AUTH_SETUP.md](./AUTH_SETUP.md) for authentication details
- Contact the development team

---

**Last Updated**: 2024-01-15

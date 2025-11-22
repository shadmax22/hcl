# Healthcare Wellness Platform - Backend API

Backend API server built with Express.js, TypeScript, and MongoDB using MVC architecture.

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with all endpoints, request/response examples, and data models
- **[API Quick Reference](./API_QUICK_REFERENCE.md)** - Quick reference guide with common endpoints and curl examples

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (running on localhost:27017 or configure in `.env`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables (if .env.example exists)
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/hcl?authSource=admin
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=10
CORS_ORIGIN=*
```

### Running the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Development mode (watch)
npm run dev:watch

# Build TypeScript
npm run build

# Run production build
npm start

# Type checking
npm run typecheck
```

### Database Setup

```bash
# Initialize roles
npm run init:roles

# Initialize admin user
npm run init:admin

# Initialize both
npm run init:all
```

## 📁 Project Structure

```
backend/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Request handlers
├── middleware/      # Express middleware (auth, etc.)
├── models/         # Mongoose schemas and models
├── routes/         # API route definitions
├── services/       # Business logic services
├── scripts/        # Utility scripts
└── index.ts        # Application entry point
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. 

1. Register or login to get a token
2. Include the token in requests:
   ```
   Authorization: Bearer <your-token>
   ```

## 🎯 API Endpoints

### Base URL
```
http://localhost:3000/v1
```

### Main Endpoint Groups

- **Authentication**: `/v1/auth` - Signup, login, get current user
- **Admin**: `/v1/admin` - User and doctor management (admin only)
- **Patient**: `/v1/patient` - Patient-specific endpoints (patient only)
- **Doctor**: `/v1/doctor` - Healthcare provider endpoints (doctor only)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint documentation.

## 👥 User Roles

1. **Admin** - Full system access
2. **Healthcare Provider** - Can view assigned patients and create goals
3. **Patient** - Can view own data

## 🔒 Role-Based Access Control

All endpoints (except signup/login) require authentication. Role-specific endpoints require the appropriate role:

- Admin endpoints: `authorize(['admin'])`
- Patient endpoints: `authorize(['patient'])`
- Doctor endpoints: `authorize(['healthcare_provider'])`

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run dev:watch    # Start with auto-reload
npm run build        # Build TypeScript to JavaScript
npm start            # Run production build
npm run typecheck    # Type check without building
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run init:roles   # Initialize default roles
npm run init:admin   # Initialize admin user
npm run init:all     # Initialize roles and admin
```

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Security**: Helmet, CORS

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `morgan` - HTTP request logger

### Development
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution
- `ts-node-dev` - Development server with auto-reload
- `@types/*` - TypeScript type definitions

## 🧪 Testing

Currently, no tests are configured. Consider adding:
- Unit tests (Jest/Mocha)
- Integration tests
- API endpoint tests

## 📄 License

ISC

## 🤝 Contributing

1. Follow the existing code style
2. Ensure TypeScript compiles without errors
3. Update documentation for new endpoints
4. Test your changes thoroughly

## 📞 Support

For issues or questions, please contact the development team.

---

**Last Updated**: 2024-01-15


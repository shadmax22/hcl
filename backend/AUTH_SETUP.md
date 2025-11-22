# Authentication System Setup

## ✅ Complete Authentication System

### Installed Packages
- ✅ `bcrypt` - Password hashing
- ✅ `jsonwebtoken` - JWT token generation and verification
- ✅ `@types/bcrypt` - TypeScript types for bcrypt
- ✅ `@types/jsonwebtoken` - TypeScript types for jsonwebtoken

---

## 📁 File Structure

```
backend/
├── services/
│   └── authService.ts          # Password hashing, JWT token management
├── middleware/
│   └── authMiddleware.ts       # JWT authentication middleware
├── controllers/
│   └── authController.ts       # Authentication controllers
├── routes/
│   └── authRoutes.ts           # Authentication routes
└── index.ts                    # Main server (updated with auth routes)
```

---

## 🔐 Authentication Features

### 1. Password Security
- ✅ Bcrypt hashing with configurable rounds (default: 10)
- ✅ Password strength validation:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- ✅ Password history tracking (last 5 passwords)
- ✅ Password reuse prevention

### 2. JWT Token Management
- ✅ Token generation with user info (userId, email, role)
- ✅ Token verification middleware
- ✅ Configurable expiration (default: 24h)
- ✅ Secure token storage in environment variables

### 3. User Registration
- ✅ **Patient Registration** (`POST /api/auth/register/patient`)
  - Validates email format
  - Validates password strength
  - Checks for existing users
  - Creates user with patient role
  - Tracks consent
  - Generates JWT token
  - Logs audit trail

- ✅ **Healthcare Provider Registration** (`POST /api/auth/register/provider`)
  - All patient registration features
  - Additional provider-specific fields:
    - Full name
    - Medical certificate
    - Specialisation
    - Care category
    - Years of experience
    - Portfolio URL
  - Creates HealthcareProvider profile
  - Sets status to 'pending_verification'

### 4. User Login
- ✅ **Login** (`POST /api/auth/login`)
  - Email and password validation
  - Password verification
  - Account status check
  - JWT token generation
  - Failed login attempt logging
  - Successful login audit trail

### 5. Current User
- ✅ **Get Current User** (`GET /api/auth/me`)
  - Protected route (requires authentication)
  - Returns user information
  - Excludes sensitive data (password, password history)

---

## 🛣️ API Endpoints

### Public Endpoints

#### 1. Register Patient
```http
POST /api/auth/register/patient
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone_no": "+1234567890",
  "DOB": "1990-01-01",
  "gender": "male",
  "consentGiven": true
}
```

**Response:**
```json
{
  "message": "Patient registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

#### 2. Register Healthcare Provider
```http
POST /api/auth/register/provider
Content-Type: application/json

{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "phone_no": "+1234567890",
  "full_name": "Dr. Jane Smith",
  "medical_certificate": "MD12345",
  "specialisation": "Cardiology",
  "care_category": "care_category_id",
  "year_of_experience": 10,
  "portfolio_url": "https://example.com/portfolio",
  "consentGiven": true
}
```

**Response:**
```json
{
  "message": "Healthcare provider registered successfully. Pending verification.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "Dr. Jane Smith",
    "email": "jane@example.com",
    "role": "healthcare_provider"
  }
}
```

#### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### Protected Endpoints

#### 4. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "stat": "active",
    "consentGiven": true,
    "consentDate": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🔒 Middleware

### `authenticate`
Protects routes by verifying JWT token from Authorization header.

**Usage:**
```typescript
import { authenticate } from './middleware/authMiddleware';

router.get('/protected', authenticate, controller.method);
```

### `authorize`
Checks if user has required role(s) (for future implementation).

**Usage:**
```typescript
import { authorize } from './middleware/authMiddleware';

router.get('/admin', authenticate, authorize(['admin']), controller.method);
```

### `optionalAuth`
Optional authentication - attaches user if token is present.

**Usage:**
```typescript
import { optionalAuth } from './middleware/authMiddleware';

router.get('/public', optionalAuth, controller.method);
```

---

## 🔧 Environment Variables

Make sure these are set in your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

---

## 📝 Usage Examples

### Using Authentication in Controllers

```typescript
import { AuthRequest } from '../middleware/authMiddleware';

async function protectedRoute(req: AuthRequest, res: Response) {
  // Access authenticated user
  const userId = req.user?.userId;
  const userEmail = req.user?.email;
  const userRole = req.user?.role;
  
  // Your logic here
}
```

### Using Auth Service

```typescript
import authService from '../services/authService';

// Hash password
const hashedPassword = await authService.hashPassword('password123');

// Compare password
const isValid = await authService.comparePassword('password123', hashedPassword);

// Generate token
const token = authService.generateToken(user);

// Verify token
const payload = authService.verifyToken(token);
```

---

## ✅ Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **Password History**: Last 5 passwords are tracked to prevent reuse
3. **Password Strength**: Enforced minimum requirements
4. **JWT Tokens**: Secure token-based authentication
5. **Audit Logging**: All authentication events are logged
6. **Account Status**: Active account check on login
7. **Input Validation**: Email format and required fields validation

---

## 🚀 Next Steps

1. **Initialize Roles**: Create default roles (patient, healthcare_provider, admin) in database
2. **Rate Limiting**: Add rate limiting to authentication endpoints
3. **Password Reset**: Implement password reset functionality
4. **Refresh Tokens**: Add refresh token mechanism if needed
5. **Email Verification**: Add email verification for new registrations

---

## 📋 Testing

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register/patient \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "consentGiven": true
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

---

## ⚠️ Important Notes

1. **Roles Setup**: Before using authentication, ensure roles are created in the database:
   - `patient`
   - `healthcare_provider`
   - `admin` (optional)

2. **JWT Secret**: Change `JWT_SECRET` in production to a strong, random string

3. **Password Field**: User model has `select: false` on password field, so use `.select('+password')` when querying for authentication

4. **Audit Logging**: All authentication events are automatically logged to AuditLog collection

---

## ✅ Status: Authentication System Complete

All authentication features are implemented and ready to use!


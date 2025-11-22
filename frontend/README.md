# Healthcare Wellness Platform - Frontend

Modern React-based frontend application for the Healthcare Wellness Platform, built with Material Tailwind, Vite, and React Router.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Pages & Components](#-pages--components)
- [Authentication](#-authentication)
- [User Roles & Dashboards](#-user-roles--dashboards)
- [Available Scripts](#-available-scripts)
- [Technology Stack](#-technology-stack)
- [Building for Production](#-building-for-production)
- [Configuration](#-configuration)
- [Contributing](#-contributing)

## ✨ Features

### Core Features
- **User Authentication**
  - Patient sign-up
  - User login
  - JWT token management
  - Protected routes
  - Role-based navigation

- **Role-Based Dashboards**
  - **Admin Dashboard**: User management, doctor management, system statistics
  - **Doctor Dashboard**: Patient management, goal creation, patient health records
  - **Patient Dashboard**: Health tracking, goals, reminders, notifications

- **Patient Features**
  - Health tracking records (blood pressure, weight, glucose, etc.)
  - Add, edit, and delete tracking records
  - View health goals
  - View preventive care reminders
  - Notifications management
  - Profile management

- **Doctor Features**
  - View assigned patients
  - Patient profile management
  - Create and manage patient goals
  - View patient health records
  - Notifications

- **Admin Features**
  - User management
  - Doctor/Healthcare provider management
  - Add new doctors
  - System statistics
  - Notifications

- **UI/UX Features**
  - Modern Material Design interface
  - Responsive design (mobile, tablet, desktop)
  - Dark/Light theme support
  - Interactive charts and statistics
  - Real-time notifications
  - Form validation
  - Error handling

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 (LTS version recommended)
- **npm** >= 9.0.0 (or yarn/pnpm)
- **Backend API** running (see backend README for setup)

## 📦 Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in the frontend directory
   touch .env
   ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables) section)

## 🔧 Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_ENDPOINT=http://localhost:3000
```

### Environment Variable Descriptions

- `VITE_API_ENDPOINT`: Backend API base URL (default: `http://localhost:3000`)

**Note**: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the application.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start on `http://localhost:5173` (or the next available port).

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
│   ├── css/
│   │   └── tailwind.css
│   └── img/            # Images and icons
├── src/
│   ├── components/     # Reusable components
│   │   ├── admin/
│   │   │   └── AddDoctorModal.jsx
│   │   ├── Doctors/
│   │   │   └── AddDoctors.jsx
│   │   └── Patients/
│   │       └── PatientsProfiles.jsx
│   ├── configs/        # Configuration files
│   │   ├── charts-config.js
│   │   └── index.js
│   ├── context/        # React context providers
│   │   └── index.jsx
│   ├── data/           # Static data and mock data
│   │   ├── statistics-cards-data.js
│   │   ├── statistics-charts-data.js
│   │   └── ...
│   ├── layouts/        # Layout components
│   │   ├── auth.jsx    # Authentication layout
│   │   ├── dashboard.jsx # Dashboard layout
│   │   └── index.js
│   ├── pages/          # Page components
│   │   ├── auth/       # Authentication pages
│   │   │   ├── sign-in.jsx
│   │   │   ├── sign-up.jsx
│   │   │   └── patient/
│   │   │       └── sign-up.jsx
│   │   └── dashboard/  # Dashboard pages
│   │       ├── admin/
│   │       │   └── AdminDashboard.jsx
│   │       ├── doctors/
│   │       │   └── DoctorDashboard.jsx
│   │       ├── patientDashboard.jsx
│   │       ├── notifications.jsx
│   │       ├── profile.jsx
│   │       └── ...
│   ├── routes.jsx      # Route configuration
│   ├── utils/          # Utility functions
│   │   ├── Auth-Header.js
│   │   ├── Axios.js
│   │   └── Error-Message.js
│   ├── widgets/        # Widget components
│   │   ├── cards/      # Card components
│   │   ├── charts/     # Chart components
│   │   └── layout/     # Layout widgets
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Application entry point
├── axios.js            # Axios configuration
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.cjs # Tailwind CSS configuration
└── postcss.config.cjs  # PostCSS configuration
```

## 📄 Pages & Components

### Authentication Pages

- **Sign In** (`/sign-in`)
  - User login form
  - Email and password authentication
  - Redirects to appropriate dashboard based on role

- **Sign Up** (`/patients/signup`)
  - Patient registration form
  - Form validation
  - Consent management

### Dashboard Pages

#### Admin Dashboard (`/dashboard/admin`)
- System statistics
- User management
- Doctor management
- Add new doctors
- System overview

#### Doctor Dashboard (`/dashboard/admin` - for healthcare providers)
- Assigned patients list
- Patient management
- Create patient goals
- View patient health records
- Notifications

#### Patient Dashboard (`/dashboard/admin` - for patients)
- Health tracking records
- Add/edit/delete tracking records
- View health goals
- View reminders
- Notifications

#### Notifications (`/dashboard/notifications`)
- View all notifications
- Mark as read
- Filter notifications

#### Profile (`/dashboard/profile`)
- User profile information
- Edit profile
- View account details

### Components

- **AddDoctorModal**: Modal for adding new doctors (Admin)
- **AddDoctors**: Doctor management component
- **PatientsProfiles**: Patient profile management (Doctor view)

## 🔐 Authentication

### How Authentication Works

1. **Login Process**
   - User enters email and password
   - Frontend sends credentials to `/v1/auth/login`
   - Backend returns JWT token and user info
   - Token stored in `localStorage` as `accessToken`
   - User info stored in `localStorage` as `user`

2. **Token Management**
   - Axios interceptor automatically adds token to requests
   - Token included in `Authorization: Bearer <token>` header
   - Token validated on protected routes

3. **Protected Routes**
   - Routes are protected based on user role
   - Unauthenticated users redirected to login
   - Role-based navigation in sidebar

### Authentication Flow

```
Login → Get Token → Store in localStorage → Redirect to Dashboard
```

### Logout

Currently, logout can be implemented by:
- Clearing `localStorage`
- Removing `accessToken` and `user`
- Redirecting to login page

## 👥 User Roles & Dashboards

### Admin Role
- **Dashboard**: Admin dashboard with system statistics
- **Navigation**: Dashboard, Doctors List, Notifications
- **Features**: User management, doctor management, system overview

### Healthcare Provider Role
- **Dashboard**: Doctor dashboard with patient management
- **Navigation**: Dashboard, Patients Management, Notifications
- **Features**: View patients, create goals, manage patient records

### Patient Role
- **Dashboard**: Patient dashboard with health tracking
- **Navigation**: Dashboard, Notifications
- **Features**: Track health metrics, view goals, manage reminders

## 📜 Available Scripts

### Development Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Script Descriptions

- `npm run dev`: Starts Vite development server with hot module replacement
- `npm run build`: Creates optimized production build in `dist/` directory
- `npm run preview`: Serves the production build locally for testing

## 🛠️ Technology Stack

### Core Framework
- **React** 18.2.0 - UI library
- **React Router DOM** 6.17.0 - Client-side routing
- **Vite** 4.5.0 - Build tool and dev server

### UI Framework
- **Material Tailwind** 2.1.4 - React components based on Material Design
- **Tailwind CSS** 3.3.4 - Utility-first CSS framework
- **Heroicons** 2.0.18 - Icon library

### Data Visualization
- **ApexCharts** 3.44.0 - Chart library
- **React ApexCharts** 1.4.1 - React wrapper for ApexCharts

### HTTP Client
- **Axios** 1.13.2 - HTTP client for API requests

### Form Management
- **React Hook Form** 7.66.1 - Form state management and validation

### Development Tools
- **TypeScript Types** - Type definitions for React and React DOM
- **Prettier** 3.0.3 - Code formatter
- **PostCSS** 8.4.31 - CSS processing
- **Autoprefixer** 10.4.16 - CSS vendor prefixing

## 🏗️ Building for Production

### Build Process

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   - The `dist/` directory contains the production-ready files
   - Deploy to your preferred hosting service:
     - Vercel
     - Netlify
     - AWS S3 + CloudFront
     - GitHub Pages
     - Any static hosting service

### Build Output

The build process creates:
- Optimized JavaScript bundles
- Minified CSS
- Optimized assets
- Production-ready HTML

## ⚙️ Configuration

### Vite Configuration

The `vite.config.js` file configures:
- React plugin
- Path aliases (`@` points to `src/`)
- Build options

### Tailwind Configuration

The `tailwind.config.cjs` file configures:
- Content paths for purging unused CSS
- Theme customization
- Material Tailwind integration

### Axios Configuration

The `axios.js` file configures:
- Base URL from environment variables
- Request interceptors (adds auth token)
- Response interceptors (error handling)

## 🔌 API Integration

### API Base URL

The frontend connects to the backend API. Configure the base URL in `.env`:

```env
VITE_API_ENDPOINT=http://localhost:3000
```

### API Endpoints Used

- **Authentication**
  - `POST /v1/auth/login` - User login
  - `POST /v1/auth/register-patient` - Patient registration
  - `GET /v1/auth/me` - Get current user

- **Patient**
  - `GET /v1/patient/profile` - Get patient profile
  - `GET /v1/patient/tracking-records` - Get tracking records
  - `POST /v1/patient/tracking-records` - Add tracking record
  - `PUT /v1/patient/tracking-records/:id` - Update tracking record
  - `DELETE /v1/patient/tracking-records/:id` - Delete tracking record
  - `GET /v1/patient/goals` - Get patient goals
  - `GET /v1/patient/notifications` - Get notifications

- **Doctor**
  - `GET /v1/doctor/patients` - Get assigned patients
  - `GET /v1/doctor/patients/:patientId` - Get patient details
  - `POST /v1/doctor/patients/:patientId/goals` - Create goal for patient

- **Admin**
  - `GET /v1/admin/users` - Get all users
  - `GET /v1/admin/doctors` - Get all doctors
  - `POST /v1/admin/doctors` - Create new doctor

## 🎨 Styling

### Material Tailwind

The application uses Material Tailwind components:
- Cards, Buttons, Inputs, Selects
- Navigation components
- Typography
- Icons from Heroicons

### Tailwind CSS

Utility classes for:
- Layout (flexbox, grid)
- Spacing (margin, padding)
- Colors
- Typography
- Responsive design

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend is running
   - Check `VITE_API_ENDPOINT` in `.env`
   - Verify CORS settings in backend

2. **Authentication Issues**
   - Check token in localStorage
   - Verify token hasn't expired
   - Clear localStorage and login again

3. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check Node.js version (>= 18.0.0)
   - Verify all dependencies are installed

4. **Routing Issues**
   - Check route configuration in `routes.jsx`
   - Verify user role in localStorage
   - Check protected route logic

## 📝 Code Style

- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Add comments for complex logic
- Follow Material Tailwind component patterns

## 🤝 Contributing

1. Follow existing code style
2. Use functional components and hooks
3. Test your changes in development mode
4. Ensure responsive design works on all screen sizes
5. Update documentation for new features
6. Test authentication and role-based access

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 📞 Support

For issues or questions:
- Check backend API is running
- Review browser console for errors
- Check network tab for API requests
- Verify environment variables are set correctly

---

**Last Updated**: 2024-01-15

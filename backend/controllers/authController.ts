import { Request, Response } from 'express';
import User from '../models/User';
import Role from '../models/Role';
import HealthcareProvider from '../models/HealthcareProvider';
import authService from '../services/authService';
import AuditLog from '../models/AuditLog';

class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        phone_no,
        DOB,
        gender,
        role: userRole,
        specialisation,
        care_category,
      }: any = req.body;

      // Validation
      if (!name || !email || !password) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Name, email, and password are required',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid email format',
        });
        return;
      }

      // Validate password strength
      const passwordValidation = authService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          error: 'Validation Error',
          message: passwordValidation.message,
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists',
        });
        return;
      }

      // Determine role (default to patient)
      const roleName = userRole || 'patient';
      const role = await Role.findOne({ role_name: roleName });
      if (!role) {
        res.status(400).json({
          error: 'Validation Error',
          message: `Invalid role. Must be 'patient' or 'healthcare_provider'`,
        });
        return;
      }

      // For healthcare providers, validate required fields
      if (roleName === 'healthcare_provider') {
        if (!specialisation || !care_category) {
          res.status(400).json({
            error: 'Validation Error',
            message: 'Specialisation and care_category are required for healthcare providers',
          });
          return;
        }
      }

      // Hash password
      const hashedPassword = await authService.hashPassword(password);

      // Create user
      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone_no,
        DOB: DOB ? new Date(DOB) : undefined,
        gender,
        role: role._id,
        stat: 'active',
      });

      await user.save();

      // Create healthcare provider profile if needed
      if (roleName === 'healthcare_provider') {
        const healthcareProvider = new HealthcareProvider({
          user: user._id,
          specialisation,
          care_category,
          stat: 'active',
        });
        await healthcareProvider.save();
}

      // Generate token with role name
      const token = authService.generateToken(user, roleName);

      // Log audit
      await AuditLog.create({
        user_id: user._id,
        action: 'register',
      });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: roleName,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to register user',
      });
    }
  }
  async registerPatient(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        phone_no,
        DOB,
        gender,
      }: any = req.body;

      // Validation
      if (!name || !email || !password) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Name, email, and password are required',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid email format',
        });
        return;
      }

      // Validate password strength
      const passwordValidation = authService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          error: 'Validation Error',
          message: passwordValidation.message,
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists',
        });
        return;
      }

      // Get patient role
      const patientRole = await Role.findOne({ role_name: 'patient' });
      if (!patientRole) {
        res.status(500).json({
          error: 'Server Error',
          message: 'Patient role not found. Please contact administrator.',
        });
        return;
      }

      // Hash password
      const hashedPassword = await authService.hashPassword(password);

      // Create user
      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone_no,
        DOB: DOB ? new Date(DOB) : undefined,
        gender,
        role: patientRole._id,
        stat: 'active',
      });

      await user.save();

      // Generate token with role name
      const token = authService.generateToken(user, 'patient');

      // Log audit
      await AuditLog.create({
        user_id: user._id,
        action: 'register',
      });

      res.status(201).json({
        message: 'Patient registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'patient',
        },
      });
    } catch (error) {
      console.error('Register patient error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to register patient',
      });
    }
  }

  async registerProvider(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        phone_no,
        DOB,
        gender,
        full_name,
        medical_certificate,
        specialisation,
        care_category,
      }: any = req.body;

      // Validation
      if (!name || !email || !password) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Name, email, and password are required',
        });
        return;
      }

      if (!full_name || !medical_certificate || !specialisation || !care_category) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Full name, medical certificate, specialisation, and care category are required for providers',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid email format',
        });
        return;
      }

      // Validate password strength
      const passwordValidation = authService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          error: 'Validation Error',
          message: passwordValidation.message,
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists',
        });
        return;
      }

      // Get healthcare provider role
      const providerRole = await Role.findOne({ role_name: 'healthcare_provider' });
      if (!providerRole) {
        res.status(500).json({
          error: 'Server Error',
          message: 'Healthcare provider role not found. Please contact administrator.',
        });
        return;
      }

      // Hash password
      const hashedPassword = await authService.hashPassword(password);

      // Create user
      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone_no,
        DOB: DOB ? new Date(DOB) : undefined,
        gender,
        role: providerRole._id,
        stat: 'active',
      });

      await user.save();

      // Create healthcare provider profile
      const healthcareProvider = new HealthcareProvider({
        user: user._id,
        specialisation,
        care_category,
        stat: 'active',
      });

      await healthcareProvider.save();

      // Generate token with role name
      const token = authService.generateToken(user, 'healthcare_provider');

      // Log audit
      await AuditLog.create({
        user_id: user._id,
        action: 'register',
      });

      res.status(201).json({
        message: 'Healthcare provider registered successfully. Pending verification.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'healthcare_provider',
        },
      });
    } catch (error) {
      console.error('Register provider error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to register healthcare provider',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: any = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Email and password are required',
        });
        return;
      }

      // Find user with password (using select to include password)
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        '+password'
      );

      if (!user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
        return;
      }

      // Check if user is active
      if (user.stat !== 'active') {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Account is not active',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await authService.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        // Log failed login attempt
        await AuditLog.create({
          user_id: user._id,
          action: 'login_failed',
        });

        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
        return;
      }

      // Get role name
      const role = await Role.findById(user.role);
      const roleName = role?.role_name || 'unknown';

      // Generate token with role name
      const token = authService.generateToken(user, roleName);

      // Log successful login
      await AuditLog.create({
        user_id: user._id,
        action: 'login',
      });

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: roleName,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to login',
      });
    }
  }

  async getCurrentUser(req: any, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
        return;
      }

      const user = await User.findById(req.user.userId)
        .populate('role', 'role_name')
        .select('-password');

      if (!user) {
        res.status(404).json({
          error: 'Not Found',
          message: 'User not found',
        });
        return;
      }

      const role = await Role.findById(user.role);
      const roleName = role?.role_name || 'unknown';

      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: roleName,
          stat: user.stat,
        },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to get user information',
      });
    }
  }
}

export default new AuthController();


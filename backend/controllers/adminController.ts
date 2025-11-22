import { Response } from 'express';
import User from '../models/User';
import HealthcareProvider from '../models/HealthcareProvider';
import Role from '../models/Role';
import authService from '../services/authService';
import AuditLog from '../models/AuditLog';

class AdminController {
  async getAllUsers(_req: any, res: Response): Promise<void> {
    try {
      const users = await User.find()
        .populate('role', 'role_name')
        .select('-password')
        .sort({ created_at: -1 });

      const usersWithRoleNames = await Promise.all(
        users.map(async (user: any) => {
          const role = await Role.findById(user.role);
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            phone_no: user.phone_no,
            DOB: user.DOB,
            gender: user.gender,
            stat: user.stat,
            role: role?.role_name || 'unknown',
            created_at: user.created_at,
          };
        })
      );

      res.status(200).json({
        message: 'Users retrieved successfully',
        count: usersWithRoleNames.length,
        users: usersWithRoleNames,
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve users',
      });
    }
  }

  async getAllDoctors(_req: any, res: Response): Promise<void> {
    try {
      const providers = await HealthcareProvider.find()
        .populate('user', 'name email phone_no')
        .populate('care_category', 'name')
        .sort({ created_at: -1 });

      const providersWithDetails = providers.map((provider: any) => ({
        id: provider._id,
        user: provider.user,
        specialisation: provider.specialisation,
        care_category: provider.care_category,
        stat: provider.stat,
        created_at: provider.created_at,
      }));

      res.status(200).json({
        message: 'Doctors retrieved successfully',
        count: providersWithDetails.length,
        doctors: providersWithDetails,
      });
    } catch (error) {
      console.error('Get all doctors error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve doctors',
      });
    }
  }

  async createUser(req: any, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        phone_no,
        DOB,
        gender,
        role: userRole,
      }: any = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Name, email, and password are required',
        });
        return;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid email format',
        });
        return;
      }

      const passwordValidation = authService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          error: 'Validation Error',
          message: passwordValidation.message,
        });
        return;
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists',
        });
        return;
      }

      const roleName = userRole || 'patient';
      const role = await Role.findOne({ role_name: roleName });
      if (!role) {
        res.status(400).json({
          error: 'Validation Error',
          message: `Invalid role. Must be 'patient', 'healthcare_provider', or 'admin'`,
        });
        return;
      }

      const hashedPassword = await authService.hashPassword(password);

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

      await AuditLog.create({
        user_id: req.user.userId,
        action: 'admin_create_user',
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: roleName,
        },
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to create user',
      });
    }
  }

  async createDoctor(req: any, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        phone_no,
        DOB,
        gender,
        specialisation,
        care_category,
      }: any = req.body;

      if (!name || !email || !password || !specialisation || !care_category) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Name, email, password, specialisation, and care_category are required',
        });
        return;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid email format',
        });
        return;
      }

      const passwordValidation = authService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          error: 'Validation Error',
          message: passwordValidation.message,
        });
        return;
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists',
        });
        return;
      }

      const providerRole = await Role.findOne({ role_name: 'healthcare_provider' });
      if (!providerRole) {
        res.status(500).json({
          error: 'Server Error',
          message: 'Healthcare provider role not found',
        });
        return;
      }

      const hashedPassword = await authService.hashPassword(password);

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

      const healthcareProvider = new HealthcareProvider({
        user: user._id,
        specialisation,
        care_category,
        stat: 'active',
      });

      await healthcareProvider.save();

      await AuditLog.create({
        user_id: req.user.userId,
        action: 'admin_create_doctor',
      });

      res.status(201).json({
        message: 'Doctor created successfully',
        doctor: {
          id: healthcareProvider._id,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          specialisation,
          care_category,
        },
      });
    } catch (error) {
      console.error('Create doctor error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to create doctor',
      });
    }
  }
}

export default new AdminController();


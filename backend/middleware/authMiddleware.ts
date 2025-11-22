import { Response, NextFunction } from 'express';
import authService from '../services/authService';
import Role from '../models/Role';

export const authenticate = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token format',
      });
      return;
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: error instanceof Error ? error.message : 'Invalid token',
    });
  }
};

export const authorize = (allowedRoles: string[]) => {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

      // Get user role from token (role name is stored in JWT payload)
      const userRole = req.user.role;

      // If role is an ObjectId, fetch the role name from database
      let roleName: string;
      if (userRole && !allowedRoles.includes(userRole)) {
        // Check if it's an ObjectId format
        const roleIdPattern = /^[0-9a-fA-F]{24}$/;
        if (roleIdPattern.test(userRole)) {
          const role = await Role.findById(userRole);
          if (!role) {
            res.status(403).json({
              error: 'Forbidden',
              message: 'Invalid user role',
            });
            return;
          }
          roleName = role.role_name;
        } else {
          roleName = userRole;
        }
      } else {
        roleName = userRole;
      }

      // Check if user's role is in the allowed roles list
      if (!allowedRoles.includes(roleName)) {
        res.status(403).json({
          error: 'Forbidden',
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      // Attach role name to request for use in controllers
      req.user.roleName = roleName;
    next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to verify authorization',
      });
    }
  };
};

export const optionalAuth = (
  req: any,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
      }
    }
    next();
  } catch (error) {
    // If token is invalid, continue without user (optional auth)
    next();
  }
};


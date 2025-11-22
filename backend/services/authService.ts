import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

const BCRYPT_ROUNDS: number = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
const JWT_SECRET = (process.env.JWT_SECRET || 'your-secret-key-change-in-production') as string;
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || '24h';

class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(user: any, roleName?: string): string {
    const payload: any = {
      userId: user._id.toString(),
      email: user.email,
      role: roleName || user.role.toString(),
      roleId: user.role.toString(),
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as SignOptions);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  validatePasswordStrength(password: string): {
    isValid: boolean;
    message?: string;
  } {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return {
        isValid: false,
        message: `Password must be at least ${minLength} characters long`,
      };
    }

    if (!hasUpperCase) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter',
      };
    }

    if (!hasLowerCase) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter',
      };
    }

    if (!hasNumber) {
      return {
        isValid: false,
        message: 'Password must contain at least one number',
      };
    }

    return { isValid: true };
  }

  updatePasswordHistory(
    previousPasswords: string[],
    newHashedPassword: string
  ): string[] {
    const updated = [newHashedPassword, ...previousPasswords];
    return updated.slice(0, 5); // Keep only last 5
  }

  async isPasswordInHistory(
    password: string,
    passwordHistory: string[]
  ): Promise<boolean> {
    for (const hashedPassword of passwordHistory) {
      const matches = await this.comparePassword(password, hashedPassword);
      if (matches) {
        return true;
      }
    }
    return false;
  }
}

export default new AuthService();


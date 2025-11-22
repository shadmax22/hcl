/**
 * @fileoverview Initialize Admin User Script
 * @description Script to create default admin user in the database
 * @usage npm run init:admin or ts-node scripts/initAdmin.ts
 */

import dotenv from 'dotenv';
import database from '../config/database';
import User from '../models/User';
import Role from '../models/Role';
import authService from '../services/authService';

// Load environment variables
dotenv.config();

/**
 * @constant {string} ADMIN_EMAIL - Admin user email
 */
const ADMIN_EMAIL = 'aravindkmr007@gmail.com';

/**
 * @constant {string} ADMIN_PASSWORD - Admin user password
 * Note: Using exact password as requested. For admin initialization,
 * password validation is bypassed to allow custom passwords.
 */
const ADMIN_PASSWORD = 'admin@123';

/**
 * @constant {string} ADMIN_NAME - Admin user name
 */
const ADMIN_NAME = 'Admin User';

/**
 * @function initAdmin
 * @description Initialize default admin user in the database
 */
async function initAdmin(): Promise<void> {
  try {
    // Connect to database
    await database.connect();

    console.log('Initializing admin user...');

    // Check if admin role exists, create if not
    let adminRole = await Role.findOne({ role_name: 'admin' });
    
    if (!adminRole) {
      console.log('Admin role not found. Creating admin role...');
      adminRole = new Role({
        role_name: 'admin',
        role_descriptions: 'Administrator user role',
        permissions: JSON.stringify({
          can_view_all_users: true,
          can_edit_all_users: true,
          can_view_audit_logs: true,
          can_manage_roles: true,
          can_manage_categories: true,
          can_manage_health_tips: true,
        }),
        stat: 'active',
      });
      await adminRole.save();
      console.log('✓ Created admin role');
    } else {
      console.log('✓ Admin role already exists');
    }

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existingAdmin) {
      console.log(`\n⚠️  Admin user with email "${ADMIN_EMAIL}" already exists.`);
      console.log('   Skipping admin user creation.');
      console.log('   If you want to reset the password, delete the user first.');
      process.exit(0);
      return;
    }

    // Validate password strength (warning only for admin setup)
    const passwordValidation = authService.validatePasswordStrength(ADMIN_PASSWORD);
    if (!passwordValidation.isValid) {
      console.warn(`\n⚠️  Password validation warning: ${passwordValidation.message}`);
      console.log('   Continuing with admin user creation anyway...');
      console.log('   Note: Regular users must meet password strength requirements.');
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await authService.hashPassword(ADMIN_PASSWORD);

    // Create admin user
    const adminUser = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      previousPasswords: [],
      role: adminRole._id,
      stat: 'active',
      consentGiven: true,
      consentDate: new Date(),
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role: admin`);
    console.log(`   Status: active`);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    console.log('   Store these credentials securely.');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error initializing admin user:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
    }
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  initAdmin();
}

export default initAdmin;


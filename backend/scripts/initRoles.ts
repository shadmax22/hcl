/**
 * @fileoverview Initialize Roles Script
 * @description Script to create default roles in the database
 * @usage npm run init:roles or ts-node scripts/initRoles.ts
 */

import dotenv from 'dotenv';
import database from '../config/database';
import Role from '../models/Role';

// Load environment variables
dotenv.config();

/**
 * @function initRoles
 * @description Initialize default roles in the database
 */
async function initRoles(): Promise<void> {
  try {
    // Connect to database
    await database.connect();

    console.log('Initializing roles...');

    // Default roles (simplified MVP)
    const defaultRoles = [
      {
        role_name: 'patient',
        stat: 'active',
      },
      {
        role_name: 'healthcare_provider',
        stat: 'active',
      },
      {
        role_name: 'admin',
        stat: 'active',
      },
    ];

    // Create or update roles
    for (const roleData of defaultRoles) {
      const existingRole = await Role.findOne({ role_name: roleData.role_name });

      if (existingRole) {
        console.log(`Role "${roleData.role_name}" already exists. Skipping...`);
      } else {
        const role = new Role(roleData);
        await role.save();
        console.log(`✓ Created role: ${roleData.role_name}`);
      }
    }

    console.log('\n✅ Roles initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing roles:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  initRoles();
}

export default initRoles;


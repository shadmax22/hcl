/**
 * @fileoverview Initialize Care Categories Script
 * @description Script to create default healthcare care categories in the database
 * @usage npm run init:care-categories or ts-node scripts/initCareCategories.ts
 */

import dotenv from 'dotenv';
import database from '../config/database';
import HealthcareCategory from '../models/HealthcareCategory';

// Load environment variables
dotenv.config();

/**
 * @function initCareCategories
 * @description Initialize default healthcare care categories in the database
 */
async function initCareCategories(): Promise<void> {
  try {
    // Connect to database
    await database.connect();

    console.log('Initializing healthcare care categories...');

    // Default care categories
    const defaultCategories = [
      {
        name: 'Cardiology',
        stat: 'active',
      },
      {
        name: 'Neurology',
        stat: 'active',
      },
      {
        name: 'General Medicine',
        stat: 'active',
      },
      {
        name: 'Pediatrics',
        stat: 'active',
      },
      {
        name: 'Orthopedics',
        stat: 'active',
      },
      {
        name: 'Dermatology',
        stat: 'active',
      },
      {
        name: 'Psychiatry',
        stat: 'active',
      },
      {
        name: 'Oncology',
        stat: 'active',
      },
      {
        name: 'Gynecology',
        stat: 'active',
      },
      {
        name: 'Urology',
        stat: 'active',
      },
      {
        name: 'Ophthalmology',
        stat: 'active',
      },
      {
        name: 'ENT (Ear, Nose, Throat)',
        stat: 'active',
      },
      {
        name: 'Pulmonology',
        stat: 'active',
      },
      {
        name: 'Gastroenterology',
        stat: 'active',
      },
      {
        name: 'Endocrinology',
        stat: 'active',
      },
    ];

    // Create or update categories
    let createdCount = 0;
    let skippedCount = 0;

    for (const categoryData of defaultCategories) {
      const existingCategory = await HealthcareCategory.findOne({
        name: categoryData.name,
      });

      if (existingCategory) {
        // Update status to active if it was inactive
        if (existingCategory.stat !== 'active') {
          existingCategory.stat = 'active';
          await existingCategory.save();
          console.log(`✓ Updated category: ${categoryData.name} (set to active)`);
          createdCount++;
        } else {
          console.log(`Category "${categoryData.name}" already exists and is active. Skipping...`);
          skippedCount++;
        }
      } else {
        const category = new HealthcareCategory(categoryData);
        await category.save();
        console.log(`✓ Created category: ${categoryData.name}`);
        createdCount++;
      }
    }

    console.log('\n✅ Care categories initialization completed!');
    console.log(`   Created/Updated: ${createdCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total: ${defaultCategories.length}`);
    
    await database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing care categories:', error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  initCareCategories();
}

export default initCareCategories;


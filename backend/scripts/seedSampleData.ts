/**
 * @fileoverview Seed Sample Data Script
 * @description Script to populate database with sample patients, doctors, and related data
 * @usage npm run seed:data or ts-node scripts/seedSampleData.ts
 */

import dotenv from 'dotenv';
import database from '../config/database';
import User from '../models/User';
import Role from '../models/Role';
import HealthcareProvider from '../models/HealthcareProvider';
import HealthcareCategory from '../models/HealthcareCategory';
import PatientDoctorMapping from '../models/PatientDoctorMapping';
import Goal from '../models/Goal';
import TrackingRecord from '../models/TrackingRecord';
import GoalLog from '../models/GoalLog';
import Notification from '../models/Notification';
import HealthTip from '../models/HealthTip';
import PreventiveCareReminder from '../models/PreventiveCareReminder';
import authService from '../services/authService';

// Load environment variables
dotenv.config();

/**
 * Generate a random date within a range
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random number within a range
 */
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random item from array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Seed sample data
 */
async function seedSampleData(): Promise<void> {
  try {
    // Connect to database
    await database.connect();

    console.log('🌱 Starting to seed sample data...\n');

    // Ensure roles exist
    const patientRole = await Role.findOne({ role_name: 'patient' });
    const doctorRole = await Role.findOne({ role_name: 'healthcare_provider' });

    if (!patientRole || !doctorRole) {
      console.error('❌ Roles not found. Please run: npm run init:roles');
      process.exit(1);
    }

    // Get healthcare categories
    const categories = await HealthcareCategory.find({ stat: 'active' });
    if (categories.length === 0) {
      console.error('❌ Healthcare categories not found. Please run: npm run init:care-categories');
      process.exit(1);
    }

    // Sample patient data
    const samplePatients = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: 'Patient123',
        phone_no: '+1-555-0101',
        DOB: new Date('1985-03-15'),
        gender: 'male',
        role: patientRole._id,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        password: 'Patient123',
        phone_no: '+1-555-0102',
        DOB: new Date('1990-07-22'),
        gender: 'female',
        role: patientRole._id,
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        password: 'Patient123',
        phone_no: '+1-555-0103',
        DOB: new Date('1978-11-08'),
        gender: 'male',
        role: patientRole._id,
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        password: 'Patient123',
        phone_no: '+1-555-0104',
        DOB: new Date('1992-05-30'),
        gender: 'female',
        role: patientRole._id,
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        password: 'Patient123',
        phone_no: '+1-555-0105',
        DOB: new Date('1988-09-12'),
        gender: 'male',
        role: patientRole._id,
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@example.com',
        password: 'Patient123',
        phone_no: '+1-555-0106',
        DOB: new Date('1983-12-25'),
        gender: 'female',
        role: patientRole._id,
      },
      {
        name: 'Robert Taylor',
        email: 'robert.taylor@example.com',
        password: 'Patient123',
        phone_no: '+1-555-0107',
        DOB: new Date('1975-04-18'),
        gender: 'male',
        role: patientRole._id,
      },
      {
        name: 'Jennifer Martinez',
        email: 'jennifer.martinez@example.com',
        password: 'Patient123',
        phone_no: '+1-555-0108',
        DOB: new Date('1995-08-03'),
        gender: 'female',
        role: patientRole._id,
      },
    ];

    // Sample doctor data
    const sampleDoctors = [
      {
        name: 'Dr. James Anderson',
        email: 'dr.james.anderson@example.com',
        password: 'Doctor123',
        phone_no: '+1-555-0201',
        DOB: new Date('1970-01-15'),
        gender: 'male',
        role: doctorRole._id,
        specialisation: 'Cardiologist',
        care_category: categories.find(c => c.name === 'Cardiology')?._id || categories[0]._id,
      },
      {
        name: 'Dr. Maria Garcia',
        email: 'dr.maria.garcia@example.com',
        password: 'Doctor123',
        phone_no: '+1-555-0202',
        DOB: new Date('1975-06-20'),
        gender: 'female',
        role: doctorRole._id,
        specialisation: 'Neurologist',
        care_category: categories.find(c => c.name === 'Neurology')?._id || categories[0]._id,
      },
      {
        name: 'Dr. Robert Chen',
        email: 'dr.robert.chen@example.com',
        password: 'Doctor123',
        phone_no: '+1-555-0203',
        DOB: new Date('1968-03-10'),
        gender: 'male',
        role: doctorRole._id,
        specialisation: 'General Practitioner',
        care_category: categories.find(c => c.name === 'General Medicine')?._id || categories[0]._id,
      },
      {
        name: 'Dr. Susan Lee',
        email: 'dr.susan.lee@example.com',
        password: 'Doctor123',
        phone_no: '+1-555-0204',
        DOB: new Date('1980-09-05'),
        gender: 'female',
        role: doctorRole._id,
        specialisation: 'Pediatrician',
        care_category: categories.find(c => c.name === 'Pediatrics')?._id || categories[0]._id,
      },
      {
        name: 'Dr. William Thompson',
        email: 'dr.william.thompson@example.com',
        password: 'Doctor123',
        phone_no: '+1-555-0205',
        DOB: new Date('1972-12-18'),
        gender: 'male',
        role: doctorRole._id,
        specialisation: 'Orthopedic Surgeon',
        care_category: categories.find(c => c.name === 'Orthopedics')?._id || categories[0]._id,
      },
    ];

    // Create patients
    console.log('👥 Creating sample patients...');
    const createdPatients = [];
    for (const patientData of samplePatients) {
      const existingPatient = await User.findOne({ email: patientData.email });
      if (existingPatient) {
        console.log(`   ⏭️  Patient "${patientData.name}" already exists. Skipping...`);
        createdPatients.push(existingPatient);
      } else {
        const hashedPassword = await authService.hashPassword(patientData.password);
        const patient = new User({
          ...patientData,
          password: hashedPassword,
        });
        await patient.save();
        createdPatients.push(patient);
        console.log(`   ✓ Created patient: ${patientData.name}`);
      }
    }

    // Create doctors
    console.log('\n👨‍⚕️ Creating sample doctors...');
    const createdDoctors = [];
    for (const doctorData of sampleDoctors) {
      const existingUser = await User.findOne({ email: doctorData.email });
      let doctorUser;
      
      if (existingUser) {
        console.log(`   ⏭️  Doctor user "${doctorData.name}" already exists. Skipping user creation...`);
        doctorUser = existingUser;
      } else {
        const hashedPassword = await authService.hashPassword(doctorData.password);
        doctorUser = new User({
          name: doctorData.name,
          email: doctorData.email,
          password: hashedPassword,
          phone_no: doctorData.phone_no,
          DOB: doctorData.DOB,
          gender: doctorData.gender,
          role: doctorData.role,
        });
        await doctorUser.save();
        console.log(`   ✓ Created doctor user: ${doctorData.name}`);
      }

      // Create healthcare provider record
      const existingProvider = await HealthcareProvider.findOne({ user: doctorUser._id });
      if (existingProvider) {
        console.log(`   ⏭️  Healthcare provider for "${doctorData.name}" already exists. Skipping...`);
        createdDoctors.push(existingProvider);
      } else {
        const provider = new HealthcareProvider({
          user: doctorUser._id,
          specialisation: doctorData.specialisation,
          care_category: doctorData.care_category,
        });
        await provider.save();
        createdDoctors.push(provider);
        console.log(`   ✓ Created healthcare provider: ${doctorData.name} (${doctorData.specialisation})`);
      }
    }

    // Create patient-doctor mappings
    console.log('\n🔗 Creating patient-doctor mappings...');
    let mappingCount = 0;
    for (let i = 0; i < createdPatients.length; i++) {
      const patient = createdPatients[i];
      // Each patient gets 1-2 doctors
      const numDoctors = randomNumber(1, 2);
      const assignedDoctors = createdDoctors
        .sort(() => Math.random() - 0.5)
        .slice(0, numDoctors);

      for (const doctor of assignedDoctors) {
        const existingMapping = await PatientDoctorMapping.findOne({
          patient_id: patient._id,
          doctor_id: doctor._id,
        });

        if (!existingMapping) {
          const mapping = new PatientDoctorMapping({
            patient_id: patient._id,
            doctor_id: doctor._id,
            stat: 'active',
          });
          await mapping.save();
          mappingCount++;
          console.log(`   ✓ Mapped ${patient.name} to ${doctor.specialisation}`);
        }
      }
    }
    console.log(`   ✓ Created ${mappingCount} patient-doctor mappings`);

    // Create goals for patients
    console.log('\n🎯 Creating goals for patients...');
    const goalTypes = ['weight', 'bmi', 'steps'];
    let goalCount = 0;
    for (const patient of createdPatients) {
      // Each patient gets 1-3 goals
      const numGoals = randomNumber(1, 3);
      const selectedTypes = goalTypes.sort(() => Math.random() - 0.5).slice(0, numGoals);

      for (const goalType of selectedTypes) {
        let targetValue: number;
        let dueDate: Date;

        if (goalType === 'weight') {
          targetValue = randomNumber(60, 90); // kg
          dueDate = randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now
        } else if (goalType === 'bmi') {
          targetValue = randomNumber(20, 25); // BMI
          dueDate = randomDate(new Date(), new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)); // 120 days
        } else {
          // steps
          targetValue = randomNumber(5000, 15000); // steps per day
          dueDate = randomDate(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)); // 60 days
        }

        const goal = new Goal({
          patient_id: patient._id,
          tracking_type: goalType,
          target_value: targetValue,
          due_date: dueDate,
          stat: Math.random() > 0.7 ? 'completed' : 'active', // 30% completed
        });
        await goal.save();
        goalCount++;
        console.log(`   ✓ Created ${goalType} goal for ${patient.name} (target: ${targetValue})`);
      }
    }
    console.log(`   ✓ Created ${goalCount} goals`);

    // Create tracking records
    console.log('\n📊 Creating tracking records...');
    const allGoals = await Goal.find({ stat: 'active' });
    let recordCount = 0;
    for (const goal of allGoals) {
      const patient = createdPatients.find(p => p._id.toString() === goal.patient_id.toString());
      if (!patient) continue;

      // Create 5-15 historical tracking records
      const numRecords = randomNumber(5, 15);
      for (let i = 0; i < numRecords; i++) {
        const recordDate = randomDate(
          new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          new Date()
        );

        let value: number;
        if (goal.tracking_type === 'weight') {
          value = randomNumber(55, 95);
        } else if (goal.tracking_type === 'bmi') {
          value = randomNumber(18, 28);
        } else {
          // steps - skip for tracking records (only weight and bmi)
          continue;
        }

        const record = new TrackingRecord({
          patient_id: patient._id,
          type: goal.tracking_type as 'weight' | 'bmi',
          value: value,
          date: recordDate,
        });
        await record.save();
        recordCount++;
      }
    }
    console.log(`   ✓ Created ${recordCount} tracking records`);

    // Create goal logs (for steps goals)
    console.log('\n📝 Creating goal logs...');
    const stepsGoals = await Goal.find({ tracking_type: 'steps' });
    let logCount = 0;
    for (const goal of stepsGoals) {
      // Create logs for last 7-30 days
      const numLogs = randomNumber(7, 30);
      for (let i = 0; i < numLogs; i++) {
        const logDate = randomDate(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          new Date()
        );

        const actualValue = randomNumber(3000, goal.target_value);

        try {
          const log = new GoalLog({
            goal_id: goal._id,
            patient_id: goal.patient_id,
            date: logDate,
            actual_value: actualValue,
          });
          await log.save();
          logCount++;
        } catch (error: any) {
          // Skip if duplicate (same goal and date)
          if (error.code !== 11000) {
            throw error;
          }
        }
      }
    }
    console.log(`   ✓ Created ${logCount} goal logs`);

    // Create notifications
    console.log('\n🔔 Creating notifications...');
    const notificationTypes = ['reminder', 'goal_update', 'system'];
    let notificationCount = 0;
    for (const patient of createdPatients) {
      // Each patient gets 2-5 notifications
      const numNotifications = randomNumber(2, 5);
      for (let i = 0; i < numNotifications; i++) {
        const notificationType = randomItem(notificationTypes);
        let message: string;
        
        if (notificationType === 'reminder') {
          message = 'Reminder: Don\'t forget to log your daily health metrics today!';
        } else if (notificationType === 'goal_update') {
          message = 'Great progress! You\'re 75% towards your goal. Keep it up!';
        } else {
          message = 'Welcome to the Health Care Platform! Start tracking your health today.';
        }

        const notification = new Notification({
          user_id: patient._id,
          message: message,
          type: notificationType as 'reminder' | 'goal_update' | 'system',
          is_read: Math.random() > 0.5, // 50% read
        });
        await notification.save();
        notificationCount++;
      }
    }
    console.log(`   ✓ Created ${notificationCount} notifications`);

    // Create health tips
    console.log('\n💡 Creating health tips...');
    const healthTips = [
      {
        title: 'Stay Hydrated',
        content: 'Drink at least 8 glasses of water daily to maintain optimal health and energy levels.',
        display_date: new Date(),
      },
      {
        title: 'Regular Exercise',
        content: 'Aim for at least 30 minutes of moderate exercise most days of the week for better cardiovascular health.',
        display_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
      {
        title: 'Balanced Diet',
        content: 'Include a variety of fruits, vegetables, whole grains, and lean proteins in your daily meals.',
        display_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      },
      {
        title: 'Quality Sleep',
        content: 'Get 7-9 hours of quality sleep each night to support your body\'s recovery and mental health.',
        display_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Stress Management',
        content: 'Practice mindfulness, meditation, or deep breathing exercises to manage daily stress effectively.',
        display_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Regular Check-ups',
        content: 'Schedule regular health check-ups with your healthcare provider to catch issues early.',
        display_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Limit Processed Foods',
        content: 'Reduce intake of processed and sugary foods to maintain a healthy weight and reduce disease risk.',
        display_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
    ];

    let tipCount = 0;
    for (const tipData of healthTips) {
      const existingTip = await HealthTip.findOne({ display_date: tipData.display_date });
      if (existingTip) {
        console.log(`   ⏭️  Health tip for ${tipData.display_date.toDateString()} already exists. Skipping...`);
      } else {
        const tip = new HealthTip(tipData);
        await tip.save();
        tipCount++;
        console.log(`   ✓ Created health tip: ${tipData.title}`);
      }
    }
    console.log(`   ✓ Created ${tipCount} health tips`);

    // Create preventive care reminders
    console.log('\n🏥 Creating preventive care reminders...');
    const reminderTypes = [
      'Annual Physical Exam',
      'Blood Pressure Check',
      'Cholesterol Screening',
      'Diabetes Screening',
      'Mammogram',
      'Colonoscopy',
      'Dental Cleaning',
      'Eye Exam',
      'Vaccination',
      'Bone Density Test',
    ];
    let reminderCount = 0;
    for (const patient of createdPatients) {
      // Each patient gets 2-4 reminders
      const numReminders = randomNumber(2, 4);
      const selectedTypes = reminderTypes
        .sort(() => Math.random() - 0.5)
        .slice(0, numReminders);

      for (const reminderType of selectedTypes) {
        const dueDate = randomDate(
          new Date(),
          new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days from now
        );

        const reminder = new PreventiveCareReminder({
          patient_id: patient._id,
          reminder_type: reminderType,
          due_date: dueDate,
          is_completed: Math.random() > 0.7, // 30% completed
          stat: Math.random() > 0.7 ? 'completed' : 'active',
        });
        await reminder.save();
        reminderCount++;
        console.log(`   ✓ Created reminder: ${reminderType} for ${patient.name}`);
      }
    }
    console.log(`   ✓ Created ${reminderCount} preventive care reminders`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ Sample data seeding completed successfully!');
    console.log('='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   • Patients: ${createdPatients.length}`);
    console.log(`   • Doctors: ${createdDoctors.length}`);
    console.log(`   • Patient-Doctor Mappings: ${mappingCount}`);
    console.log(`   • Goals: ${goalCount}`);
    console.log(`   • Tracking Records: ${recordCount}`);
    console.log(`   • Goal Logs: ${logCount}`);
    console.log(`   • Notifications: ${notificationCount}`);
    console.log(`   • Health Tips: ${tipCount}`);
    console.log(`   • Preventive Care Reminders: ${reminderCount}`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Patients: Use any patient email with password "Patient123"');
    console.log('   Doctors: Use any doctor email with password "Doctor123"');
    console.log('='.repeat(60) + '\n');

    await database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  seedSampleData();
}

export default seedSampleData;


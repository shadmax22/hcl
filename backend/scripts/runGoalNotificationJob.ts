import dotenv from 'dotenv';
import database from '../config/database';
import goalNotificationJob from '../jobs/goalNotificationJob';

dotenv.config();

async function runJob(): Promise<void> {
  try {
    console.log('Connecting to database...');
    await database.connect();
    console.log('Database connected successfully');

    console.log('Running goal notification job...');
    await goalNotificationJob.runNow();
    console.log('Goal notification job completed');

    await database.disconnect();
    console.log('Database disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error running job:', error);
    await database.disconnect();
    process.exit(1);
  }
}

runJob();


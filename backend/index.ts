import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import database from './config/database';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import patientRoutes from './routes/patientRoutes';
import doctorRoutes from './routes/doctorRoutes';
import jobRoutes from './routes/jobRoutes';
import goalNotificationJob from './jobs/goalNotificationJob';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV: string = process.env.NODE_ENV || 'development';

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Healthcare Wellness Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/v1/auth',
      admin: '/v1/admin',
      patient: '/v1/patient',
      doctor: '/v1/doctor',
      health: '/health',
    },
  });
});

app.use('/v1/auth', authRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/patient', patientRoutes);
app.use('/v1/doctor', doctorRoutes);
app.use('/v1/jobs', jobRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(
  (err: Error, _req: Request, res: Response, _next: any): void => {
    console.error('Error:', err);

    const statusCode = (err as any).statusCode || 500;
    const message =
      NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;

    res.status(statusCode).json({
      error: 'Internal Server Error',
      message,
      ...(NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
);

async function main(): Promise<void> {
  try {
    await database.connect();

    // Start scheduled jobs
    goalNotificationJob.start();

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    Server Started                         ║
╠═══════════════════════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(47)} ║
║  Port:        ${PORT.toString().padEnd(47)} ║
║  URL:         http://localhost:${PORT.toString().padEnd(35)} ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Gracefully shutting down...');
  try {
    await database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Gracefully shutting down...');
  try {
    await database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

if (require.main === module) {
  main();
}

export default app;


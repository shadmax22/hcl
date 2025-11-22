import mongoose from 'mongoose';

const MONGODB_URI: string =
  process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/hcl?authSource=admin';

class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('MongoDB is already connected');
      return;
    }

    try {
      // Mongoose v8+ handles connection options automatically
      // No need for useNewUrlParser or useUnifiedTopology (deprecated)
      await mongoose.connect(MONGODB_URI);

      this.isConnected = true;

      console.log(`
╔═══════════════════════════════════════════════════════════╗
║              MongoDB Connected Successfully               ║
╠═══════════════════════════════════════════════════════════╣
║  URI:         ${MONGODB_URI.padEnd(47)} ║
║  Database:    ${mongoose.connection.name.padEnd(47)} ║
╚═══════════════════════════════════════════════════════════╝
      `);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
        this.isConnected = true;
      });
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('MongoDB is not connected');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnection(): typeof mongoose.connection {
    return mongoose.connection;
  }
}

// Export singleton instance
export default Database.getInstance();


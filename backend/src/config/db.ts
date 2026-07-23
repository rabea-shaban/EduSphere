import mongoose from 'mongoose';

/**
 * Establish connection to MongoDB Atlas or local MongoDB instance.
 */
export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('CRITICAL: MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Database] Connection failed:', error);
    console.warn('[Database] WARNING: Server will continue running without database connection.');
  }
};

/**
 * Handle graceful shutdown of database connection.
 */
const handleGracefulShutdown = async (signal: string) => {
  console.log(`[Database] Closing connection due to signal: ${signal}`);
  try {
    await mongoose.connection.close();
    console.log('[Database] Mongoose connection closed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[Database] Error closing connection:', err);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

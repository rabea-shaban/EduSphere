import mongoose from 'mongoose';

/**
 * Establish connection to MongoDB Atlas or local MongoDB instance with optimized connection pooling.
 */
export const connectDB = async (): Promise<void> => {
  // Disable command buffering in serverless environment to fail fast if DB is disconnected
  mongoose.set('bufferCommands', false);

  // Reuse active connection in serverless environment
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('[Database] CRITICAL: MONGO_URI / MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`[Database] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Database] Connection failed on startup:', error);
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

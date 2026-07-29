import mongoose from 'mongoose';

/**
 * Establish connection to MongoDB Atlas or local MongoDB instance with optimized connection pooling.
 */
export const connectDB = async (): Promise<void> => {
  // Reuse active connection in serverless or persistent environment
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('[Database] CRITICAL: MONGO_URI is not defined in environment variables.');
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 50, // Keep up to 50 active socket connections
      minPoolSize: 10, // Maintain 10 pre-warmed sockets to avoid cold starts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`[Database] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Database] Connection failed on startup:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
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

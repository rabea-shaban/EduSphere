import mongoose from 'mongoose';

/**
 * Global cache object for Mongoose connection in Vercel serverless environment.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Globally disable query buffering in serverless environment so operations fail fast if DB is disconnected
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 3000);

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Establish connection to MongoDB Atlas with optimized singleton connection pooling for Vercel serverless functions.
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  if (cached && cached.conn && cached.conn.connection.readyState >= 1) {
    return cached.conn;
  }

  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('[Database] CRITICAL: MONGO_URI / MONGODB_URI is not defined in environment variables.');
    throw new Error('Database connection error: MONGO_URI / MONGODB_URI environment variable is missing.');
  }

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast if DB connection drops instead of buffering for 10s
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(mongoURI, opts)
      .then((m) => {
        console.log(`[Database] Connected successfully to host: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        console.error('[Database] Connection attempt failed:', err);
        if (cached) cached.promise = null;
        throw err;
      });
  }

  try {
    if (cached && cached.promise) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    if (cached) cached.promise = null;
    throw e;
  }

  return cached!.conn!;
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

// Listen for termination signals in non-serverless mode
if (!process.env.VERCEL) {
  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
}

import app from '../src/app';
import { connectDB } from '../src/config/db';

// Pre-connect to MongoDBAtlas in serverless environment
connectDB().catch((err) => console.error('[Vercel DB Connection Error]:', err));

export default app;

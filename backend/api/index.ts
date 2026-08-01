import app from '../src/app';
import { connectDB } from '../src/config/db';

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error: any) {
    console.error('[Vercel Handler Crash Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error in Vercel function handler',
      error: error?.message || String(error),
    });
  }
}

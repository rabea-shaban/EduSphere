import dotenv from 'dotenv';
import path from 'path';

// Handle uncaught exceptions before loading other modules
process.on('uncaughtException', (err: Error) => {
  console.error('[Server] CRITICAL: Uncaught Exception! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Configure dotenv to load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  // Initialize Database Connection
  await connectDB();

  // Bind server to port
  const server = app.listen(PORT, () => {
    console.log(`
============================================================
🎓 EDUSPHERE BACKEND INITIALIZED SUCCESSFULLY
============================================================
🚀 Server Running on : http://localhost:${PORT}
⚙️  Environment Mode   : ${NODE_ENV}
🛠️  Process ID         : ${process.pid}
============================================================
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: any) => {
    console.error('[Server] CRITICAL: Unhandled Rejection! Shutting down gracefully...');
    console.error(err.name, err.message, err.stack);
    
    server.close(() => {
      console.log('[Server] Server closed. Exiting process.');
      process.exit(1);
    });
  });
};

startServer();

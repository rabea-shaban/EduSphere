"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Establish connection to MongoDB Atlas or local MongoDB instance.
 */
const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.error('CRITICAL: MONGO_URI is not defined in environment variables.');
        process.exit(1);
    }
    try {
        const conn = await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log(`[Database] Connected successfully to host: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('[Database] Connection failed on startup:', error);
        process.exit(1); // Exit process so PM2/Docker/Kubernetes can restart the service
    }
};
exports.connectDB = connectDB;
/**
 * Handle graceful shutdown of database connection.
 */
const handleGracefulShutdown = async (signal) => {
    console.log(`[Database] Closing connection due to signal: ${signal}`);
    try {
        await mongoose_1.default.connection.close();
        console.log('[Database] Mongoose connection closed successfully.');
        process.exit(0);
    }
    catch (err) {
        console.error('[Database] Error closing connection:', err);
        process.exit(1);
    }
};
// Listen for termination signals
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

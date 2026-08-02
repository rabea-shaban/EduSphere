"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Handle uncaught exceptions before loading other modules
process.on('uncaughtException', (err) => {
    console.error('[Server] CRITICAL: Uncaught Exception! Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});
// Configure dotenv to load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const seeder_1 = require("./config/seeder");
const socket_1 = require("./config/socket");
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const startServer = async () => {
    // Initialize Database Connection
    await (0, db_1.connectDB)();
    // Auto-seed default Grades and Terms
    await (0, seeder_1.seedDefaultData)();
    // Bind server to port
    const server = app_1.default.listen(PORT, () => {
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
    // Initialize Socket.io Server
    (0, socket_1.initSocket)(server);
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.error('[Server] CRITICAL: Unhandled Rejection! Shutting down gracefully...');
        console.error(err.name, err.message, err.stack);
        server.close(() => {
            console.log('[Server] Server closed. Exiting process.');
            process.exit(1);
        });
    });
};
startServer();

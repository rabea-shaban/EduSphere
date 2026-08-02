"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("../src/app"));
const db_1 = require("../src/config/db");
async function handler(req, res) {
    try {
        await (0, db_1.connectDB)();
    }
    catch (err) {
        console.error('[Vercel DB Connection Error]:', err);
    }
    return (0, app_1.default)(req, res);
}

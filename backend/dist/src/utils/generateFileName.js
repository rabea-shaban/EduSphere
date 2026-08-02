"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileName = generateFileName;
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
/**
 * Generate Secure Unique Object Key for Cloudflare R2
 * Format: {folder}/{uuid}_{timestamp}.{ext}
 * Example: courses/550e8400-e29b-41d4-a716-446655440000_1725123123.jpg
 *
 * Sanitizes input extension and prevents path traversal attacks.
 */
function generateFileName(originalName, folderName = 'general') {
    // Extract extension safely
    const rawExt = path_1.default.extname(originalName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const ext = rawExt ? `.${rawExt}` : '';
    // Sanitize folder name to prevent path traversal
    const sanitizedFolder = folderName.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'general';
    const uuid = (0, crypto_1.randomUUID)();
    const timestamp = Date.now();
    return `${sanitizedFolder}/${uuid}_${timestamp}${ext}`;
}
exports.default = generateFileName;

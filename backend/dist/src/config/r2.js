"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.r2Client = exports.R2_PUBLIC_DOMAIN = exports.R2_PUBLIC_URL = exports.R2_BUCKET = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Cloudflare R2 Client Configuration
 * Uses AWS SDK v3 S3 client with region: "auto" for Cloudflare R2 compatibility.
 */
const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY;
const secretAccessKey = process.env.R2_SECRET_KEY;
exports.R2_BUCKET = process.env.R2_BUCKET || '';
exports.R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_DOMAIN || 'https://pub-9d9ed5fae6184a39883cfb2dd345892f.r2.dev';
exports.R2_PUBLIC_DOMAIN = exports.R2_PUBLIC_URL;
if (!endpoint || !accessKeyId || !secretAccessKey || !exports.R2_BUCKET) {
    console.warn('⚠️ Warning: Cloudflare R2 environment variables (R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET) are missing.');
}
exports.r2Client = new client_s3_1.S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
    },
});
exports.default = exports.r2Client;

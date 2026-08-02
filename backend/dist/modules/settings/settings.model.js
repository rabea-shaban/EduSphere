"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = require("mongoose");
const settingsSchema = new mongoose_1.Schema({
    organizationName: { type: String, required: [true, 'Organization name is required'], trim: true },
    logo: { type: String },
    favicon: { type: String },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    defaultLanguage: { type: String, default: 'en', trim: true },
    timezone: { type: String, default: 'UTC', trim: true },
    currency: { type: String, default: 'USD', trim: true },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', unique: true },
}, { timestamps: true });
exports.Settings = (0, mongoose_1.model)('Settings', settingsSchema);
exports.default = exports.Settings;

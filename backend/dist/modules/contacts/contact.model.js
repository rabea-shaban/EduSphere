"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    message: { type: String, required: [true, 'Message content is required'] },
    status: { type: String, enum: ['New', 'In Progress', 'Closed'], default: 'New' },
}, { timestamps: true });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
exports.Contact = (0, mongoose_1.model)('Contact', contactSchema);
exports.default = exports.Contact;

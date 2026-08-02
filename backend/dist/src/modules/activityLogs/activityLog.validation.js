"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivityLogSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a Log entry.
 */
exports.createActivityLogSchema = joi_1.default.object({
    userId: joi_1.default.string().pattern(mongoIdPattern).required(),
    action: joi_1.default.string().trim().required(),
    category: joi_1.default.string().valid('Login', 'Course', 'Payment', 'Security', 'Admin').required(),
    details: joi_1.default.any().optional(),
    ipAddress: joi_1.default.string().trim().optional(),
    userAgent: joi_1.default.string().trim().optional(),
});
exports.default = exports.createActivityLogSchema;

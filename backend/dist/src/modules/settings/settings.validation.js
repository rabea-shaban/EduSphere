"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = exports.createSettingsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.createSettingsSchema = joi_1.default.object({
    organizationName: joi_1.default.string().trim().required(),
    logo: joi_1.default.string().trim().optional(),
    favicon: joi_1.default.string().trim().optional(),
    email: joi_1.default.string().trim().email().optional(),
    phone: joi_1.default.string().trim().optional(),
    address: joi_1.default.string().trim().optional(),
    defaultLanguage: joi_1.default.string().trim().optional().default('en'),
    timezone: joi_1.default.string().trim().optional().default('UTC'),
    currency: joi_1.default.string().trim().optional().default('USD'),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.updateSettingsSchema = joi_1.default.object({
    organizationName: joi_1.default.string().trim().optional(),
    logo: joi_1.default.string().trim().optional(),
    favicon: joi_1.default.string().trim().optional(),
    email: joi_1.default.string().trim().email().optional(),
    phone: joi_1.default.string().trim().optional(),
    address: joi_1.default.string().trim().optional(),
    defaultLanguage: joi_1.default.string().trim().optional(),
    timezone: joi_1.default.string().trim().optional(),
    currency: joi_1.default.string().trim().optional(),
}).min(1);

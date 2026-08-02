"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactSchema = exports.createContactSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createContactSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    email: joi_1.default.string().trim().email().required(),
    phone: joi_1.default.string().trim().optional(),
    subject: joi_1.default.string().trim().required(),
    message: joi_1.default.string().trim().required(),
    status: joi_1.default.string().valid('New', 'In Progress', 'Closed').optional(),
});
exports.updateContactSchema = joi_1.default.object({
    status: joi_1.default.string().valid('New', 'In Progress', 'Closed').required(),
});

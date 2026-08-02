"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFaqSchema = exports.createFaqSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.createFaqSchema = joi_1.default.object({
    question: joi_1.default.string().trim().required(),
    answer: joi_1.default.string().trim().required(),
    displayOrder: joi_1.default.number().integer().optional(),
    isActive: joi_1.default.boolean().optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.updateFaqSchema = joi_1.default.object({
    question: joi_1.default.string().trim().optional(),
    answer: joi_1.default.string().trim().optional(),
    displayOrder: joi_1.default.number().integer().optional(),
    isActive: joi_1.default.boolean().optional(),
}).min(1);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeoSchema = exports.createSeoSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.createSeoSchema = joi_1.default.object({
    page: joi_1.default.string().trim().required(),
    metaTitle: joi_1.default.string().trim().required(),
    metaDescription: joi_1.default.string().trim().required(),
    keywords: joi_1.default.array().items(joi_1.default.string().trim()).optional().default([]),
    canonicalUrl: joi_1.default.string().trim().uri().optional(),
    ogImage: joi_1.default.string().trim().optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.updateSeoSchema = joi_1.default.object({
    page: joi_1.default.string().trim().optional(),
    metaTitle: joi_1.default.string().trim().optional(),
    metaDescription: joi_1.default.string().trim().optional(),
    keywords: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    canonicalUrl: joi_1.default.string().trim().uri().optional(),
    ogImage: joi_1.default.string().trim().optional(),
}).min(1);

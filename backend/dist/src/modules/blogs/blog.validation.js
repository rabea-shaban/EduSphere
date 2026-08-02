"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.createBlogSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    slug: joi_1.default.string().trim().lowercase().optional(),
    excerpt: joi_1.default.string().trim().optional(),
    content: joi_1.default.string().trim().required(),
    thumbnail: joi_1.default.string().trim().optional(),
    authorId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    categoryId: joi_1.default.string().pattern(mongoIdPattern).required(),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional().default([]),
    status: joi_1.default.string().valid('Draft', 'Published').optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.updateBlogSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    slug: joi_1.default.string().trim().lowercase().optional(),
    excerpt: joi_1.default.string().trim().optional(),
    content: joi_1.default.string().trim().optional(),
    thumbnail: joi_1.default.string().trim().optional(),
    categoryId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    status: joi_1.default.string().valid('Draft', 'Published').optional(),
}).min(1);

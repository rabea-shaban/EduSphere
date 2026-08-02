"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFileMetadataSchema = exports.fileQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.fileQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(20),
    search: joi_1.default.string().allow('').optional(),
    category: joi_1.default.string().valid('all', 'image', 'video', 'document', 'archive', 'audio', 'code', 'other').optional(),
    folder: joi_1.default.string().allow('').optional(),
    sort: joi_1.default.string().valid('newest', 'oldest', 'largest', 'smallest', 'name').default('newest'),
    deleted: joi_1.default.any().optional(),
});
exports.updateFileMetadataSchema = joi_1.default.object({
    originalName: joi_1.default.string().trim().min(1).max(255).optional(),
    folder: joi_1.default.string().trim().min(1).max(100).optional(),
    entityType: joi_1.default.string().valid('course', 'lesson', 'assignment', 'profile', 'general').optional(),
    entityId: joi_1.default.string().optional(),
});

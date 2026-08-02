"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuSchema = exports.createMenuSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.createMenuSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    url: joi_1.default.string().trim().required(),
    parentId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    displayOrder: joi_1.default.number().integer().optional(),
    target: joi_1.default.string().valid('_self', '_blank').optional(),
    isActive: joi_1.default.boolean().optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.updateMenuSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    url: joi_1.default.string().trim().optional(),
    parentId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    displayOrder: joi_1.default.number().integer().optional(),
    target: joi_1.default.string().valid('_self', '_blank').optional(),
    isActive: joi_1.default.boolean().optional(),
}).min(1);

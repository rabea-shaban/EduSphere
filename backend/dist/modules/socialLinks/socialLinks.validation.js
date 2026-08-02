"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSocialLinksSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.updateSocialLinksSchema = joi_1.default.object({
    facebook: joi_1.default.string().trim().uri().allow('').optional(),
    instagram: joi_1.default.string().trim().uri().allow('').optional(),
    linkedin: joi_1.default.string().trim().uri().allow('').optional(),
    youtube: joi_1.default.string().trim().uri().allow('').optional(),
    x: joi_1.default.string().trim().uri().allow('').optional(),
    tiktok: joi_1.default.string().trim().uri().allow('').optional(),
    website: joi_1.default.string().trim().uri().allow('').optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
}).min(1);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBannerSchema = exports.createBannerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.createBannerSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    subtitle: joi_1.default.string().trim().optional(),
    image: joi_1.default.string().trim().required(),
    buttonText: joi_1.default.string().trim().optional(),
    buttonLink: joi_1.default.string().trim().optional(),
    displayOrder: joi_1.default.number().integer().optional(),
    isActive: joi_1.default.boolean().optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.updateBannerSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    subtitle: joi_1.default.string().trim().optional(),
    image: joi_1.default.string().trim().optional(),
    buttonText: joi_1.default.string().trim().optional(),
    buttonLink: joi_1.default.string().trim().optional(),
    displayOrder: joi_1.default.number().integer().optional(),
    isActive: joi_1.default.boolean().optional(),
}).min(1);

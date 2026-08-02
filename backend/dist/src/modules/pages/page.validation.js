"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageSchema = exports.createPageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.createPageSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    slug: joi_1.default.string().trim().lowercase().optional(),
    content: joi_1.default.string().trim().required(),
    pageType: joi_1.default.string().valid('Home', 'About', 'Contact', 'Privacy Policy', 'Terms', 'Custom').optional(),
    status: joi_1.default.string().valid('Draft', 'Published').optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.updatePageSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    slug: joi_1.default.string().trim().lowercase().optional(),
    content: joi_1.default.string().trim().optional(),
    pageType: joi_1.default.string().valid('Home', 'About', 'Contact', 'Privacy Policy', 'Terms', 'Custom').optional(),
    status: joi_1.default.string().valid('Draft', 'Published').optional(),
}).min(1);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestimonialSchema = exports.createTestimonialSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.createTestimonialSchema = joi_1.default.object({
    studentName: joi_1.default.string().trim().required(),
    studentImage: joi_1.default.string().trim().optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    rating: joi_1.default.number().min(1).max(5).required(),
    comment: joi_1.default.string().trim().required(),
    isApproved: joi_1.default.boolean().optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.updateTestimonialSchema = joi_1.default.object({
    studentName: joi_1.default.string().trim().optional(),
    studentImage: joi_1.default.string().trim().optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    rating: joi_1.default.number().min(1).max(5).optional(),
    comment: joi_1.default.string().trim().optional(),
    isApproved: joi_1.default.boolean().optional(),
}).min(1);

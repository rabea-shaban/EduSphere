"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceSchema = exports.createInvoiceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const invoiceItemSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    quantity: joi_1.default.number().integer().min(1).required(),
    price: joi_1.default.number().min(0).required(),
});
/**
 * Joi validation schema for creating a new Invoice.
 */
exports.createInvoiceSchema = joi_1.default.object({
    invoiceNumber: joi_1.default.string().trim().required().messages({
        'string.empty': 'Invoice number is required',
    }),
    studentId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    paymentId: joi_1.default.string().pattern(mongoIdPattern).required(),
    items: joi_1.default.array().items(invoiceItemSchema).min(1).required(),
    subtotal: joi_1.default.number().min(0).required(),
    discount: joi_1.default.number().min(0).optional().default(0),
    tax: joi_1.default.number().min(0).optional().default(0),
    total: joi_1.default.number().min(0).required(),
    currency: joi_1.default.string().trim().optional().default('USD'),
    status: joi_1.default.string().valid('Issued', 'Paid', 'Cancelled').optional(),
    issuedAt: joi_1.default.date().iso().optional(),
});
/**
 * Joi validation schema for updating an Invoice.
 */
exports.updateInvoiceSchema = joi_1.default.object({
    status: joi_1.default.string().valid('Issued', 'Paid', 'Cancelled').optional(),
});
exports.default = exports.createInvoiceSchema;

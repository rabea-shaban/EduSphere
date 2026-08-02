"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a Transaction log.
 */
exports.createTransactionSchema = joi_1.default.object({
    paymentId: joi_1.default.string().pattern(mongoIdPattern).required(),
    gateway: joi_1.default.string().trim().required(),
    transactionId: joi_1.default.string().trim().required(),
    requestPayload: joi_1.default.any().optional(),
    responsePayload: joi_1.default.any().optional(),
    status: joi_1.default.string().valid('Pending', 'Success', 'Failed').required(),
});
exports.default = exports.createTransactionSchema;

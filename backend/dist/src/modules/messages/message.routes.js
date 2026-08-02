"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const message_validation_1 = require("./message.validation");
const message_controller_1 = require("./message.controller");
const router = (0, express_1.Router)();
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const conversationIdParamsSchema = joi_1.default.object({
    conversationId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid conversation ID format',
    }),
});
router.use(authMiddleware_1.protect);
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: message_validation_1.sendMessageSchema }), message_controller_1.sendMessage);
router.patch('/read/:conversationId', (0, validationMiddleware_1.validationMiddleware)({ params: conversationIdParamsSchema }), message_controller_1.markAsRead);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: message_validation_1.editMessageSchema }), message_controller_1.editMessage);
router.delete('/:id/me', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), message_controller_1.deleteMessageForMe);
router.delete('/:id/everyone', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), message_controller_1.deleteMessageForEveryone);
router.get('/conversation/:conversationId', (0, validationMiddleware_1.validationMiddleware)({ params: conversationIdParamsSchema }), message_controller_1.getConversationMessages);
router.get('/:conversationId', (0, validationMiddleware_1.validationMiddleware)({ params: conversationIdParamsSchema }), message_controller_1.getConversationMessages);
exports.default = router;

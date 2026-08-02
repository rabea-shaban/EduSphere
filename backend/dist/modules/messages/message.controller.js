"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationMessages = exports.markConversationSeen = exports.deleteMessage = exports.editMessage = exports.sendMessage = void 0;
const message_model_1 = require("./message.model");
const conversation_model_1 = require("../conversations/conversation.model");
const socket_1 = require("../../config/socket");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Send a message in a conversation (real-time).
 */
exports.sendMessage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { conversationId, message, messageType, attachments, replyTo } = req.body;
    const senderId = req.user?._id;
    if (!senderId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // 1. Verify conversation exists and sender is participant
    const conversation = await conversation_model_1.Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError_1.ApiError(404, 'Conversation not found');
    }
    const isParticipant = conversation.participants.some((p) => p.toString() === senderId.toString());
    if (!isParticipant) {
        throw new ApiError_1.ApiError(403, 'You are not a participant in this conversation');
    }
    // 2. Create Message
    const msg = await message_model_1.Message.create({
        conversationId,
        senderId,
        message,
        messageType: messageType || 'Text',
        attachments: attachments || [],
        replyTo,
        seenBy: [{ userId: senderId, seenAt: new Date() }], // Sender automatically saw it
    });
    // 3. Update last message details in Conversation
    conversation.lastMessage = msg._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();
    // 4. Emit to Conversation room
    const populatedMsg = await msg.populate('senderId', 'firstName lastName avatar role');
    (0, socket_1.emitToConversation)(conversationId, 'message', populatedMsg);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, populatedMsg, 'Message sent successfully'));
});
/**
 * Edit a specific message.
 */
exports.editMessage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // message ID
    const { message } = req.body;
    const currentUserId = req.user?._id;
    const msg = await message_model_1.Message.findById(id);
    if (!msg) {
        throw new ApiError_1.ApiError(404, 'Message not found');
    }
    // Ensure current user is the sender
    if (msg.senderId.toString() !== currentUserId?.toString()) {
        throw new ApiError_1.ApiError(403, 'You cannot edit this message');
    }
    msg.message = message;
    msg.edited = true;
    msg.editedAt = new Date();
    await msg.save();
    const populated = await msg.populate('senderId', 'firstName lastName avatar role');
    // Broadcast the edited message state to the room
    (0, socket_1.emitToConversation)(msg.conversationId.toString(), 'message-edited', populated);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, populated, 'Message edited successfully'));
});
/**
 * Soft delete a message (hides it for specific user, or deletes for all if sender chooses).
 */
exports.deleteMessage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // message ID
    const currentUserId = req.user?._id;
    if (!currentUserId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const msg = await message_model_1.Message.findById(id);
    if (!msg) {
        throw new ApiError_1.ApiError(404, 'Message not found');
    }
    // Add to deletedFor list (soft hide for current user)
    if (!msg.deletedFor.some((id) => id.toString() === currentUserId.toString())) {
        msg.deletedFor.push(currentUserId);
        await msg.save();
    }
    // Broadcast deletion update
    (0, socket_1.emitToConversation)(msg.conversationId.toString(), 'message-deleted', {
        messageId: id,
        userId: currentUserId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Message deleted successfully'));
});
/**
 * Mark all messages in a conversation as read.
 */
exports.markConversationSeen = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { conversationId } = req.params;
    const currentUserId = req.user?._id;
    if (!currentUserId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const now = new Date();
    // Find all messages in the conversation where the current user hasn't read it yet
    await message_model_1.Message.updateMany({
        conversationId,
        'seenBy.userId': { $ne: currentUserId },
    }, {
        $push: { seenBy: { userId: currentUserId, seenAt: now } },
    });
    // Broadcast seen event
    (0, socket_1.emitToConversation)(conversationId.toString(), 'seen-receipt', {
        conversationId,
        userId: currentUserId,
        seenAt: now,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Conversation marked as read'));
});
/**
 * Retrieve messages of a specific conversation (ignores messages hidden via deletedFor).
 */
exports.getConversationMessages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { conversationId } = req.params;
    const currentUserId = req.user?._id;
    const { page = 1, limit = 30 } = req.query;
    if (!currentUserId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // Check access permission
    const conversation = await conversation_model_1.Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError_1.ApiError(404, 'Conversation not found');
    }
    const isParticipant = conversation.participants.some((p) => p.toString() === currentUserId.toString());
    if (!isParticipant) {
        throw new ApiError_1.ApiError(403, 'You do not have access to this conversation');
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    // Filter out messages that current user soft deleted/hid
    const filter = {
        conversationId,
        deletedFor: { $ne: currentUserId },
    };
    const messages = await message_model_1.Message.find(filter)
        .populate('senderId', 'firstName lastName avatar role')
        .populate({
        path: 'replyTo',
        select: 'message senderId messageType',
        populate: { path: 'senderId', select: 'firstName lastName' },
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await message_model_1.Message.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        messages: messages.reverse(), // reverse to display oldest to newest in UI
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Messages retrieved successfully'));
});

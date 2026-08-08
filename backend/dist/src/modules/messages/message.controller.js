"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationMessages = exports.searchMessages = exports.toggleReaction = exports.deleteMessageForEveryone = exports.deleteMessageForMe = exports.editMessage = exports.markAsRead = exports.sendMessage = void 0;
const message_model_1 = require("./message.model");
const conversation_model_1 = require("../conversations/conversation.model");
const socket_1 = require("../../config/socket");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Send a message in a conversation (real-time & persistent).
 */
exports.sendMessage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { conversationId, message, messageType, attachments, replyTo, clientMessageId } = req.body;
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
    // 2. Auto-detect messageType based on attachments if not explicitly set
    let resolvedMessageType = messageType || 'Text';
    if (attachments && attachments.length > 0 && (!messageType || messageType === 'Text')) {
        const firstAttachment = attachments[0];
        const ext = firstAttachment.split('.').pop()?.toLowerCase() || '';
        if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
            resolvedMessageType = 'Image';
        }
        else if (['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext)) {
            resolvedMessageType = 'Video';
        }
        else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
            resolvedMessageType = 'Audio';
        }
        else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'txt'].includes(ext)) {
            resolvedMessageType = 'Document';
        }
    }
    // 3. Create & Save Message in MongoDB
    const msg = await message_model_1.Message.create({
        conversationId,
        senderId,
        clientMessageId,
        message: message || '',
        messageType: resolvedMessageType,
        attachments: attachments || [],
        replyTo,
        status: 'sent',
        isRead: false,
        seenBy: [{ userId: senderId, seenAt: new Date() }],
    });
    // 3. Update Conversation lastMessage, lastSender & unreadCount map
    const unreadMap = conversation.unreadCount || new Map();
    conversation.participants.forEach((participantId) => {
        const pStr = participantId.toString();
        if (pStr !== senderId.toString()) {
            const current = unreadMap.get(pStr) || 0;
            unreadMap.set(pStr, current + 1);
        }
    });
    conversation.unreadCount = unreadMap;
    conversation.lastMessage = msg._id;
    conversation.lastSender = senderId;
    conversation.lastMessageAt = new Date();
    await conversation.save();
    // 4. Emit canonical message:new event to conversation room
    const populatedMsg = await msg.populate('senderId', 'firstName lastName avatar role');
    // Single canonical emission path to conversation room
    (0, socket_1.emitToConversation)(conversationId, 'message:new', populatedMsg);
    (0, socket_1.emitToConversation)(conversationId, 'message', populatedMsg);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, populatedMsg, 'Message sent successfully'));
});
/**
 * Mark all unread messages in a conversation as read by current user.
 */
exports.markAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const conversationId = req.params.conversationId;
    const currentUserId = req.user?._id;
    if (!currentUserId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const conversation = await conversation_model_1.Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError_1.ApiError(404, 'Conversation not found');
    }
    // Reset unread count for current user
    if (conversation.unreadCount) {
        conversation.unreadCount.set(currentUserId.toString(), 0);
        await conversation.save();
    }
    // Mark all messages from other participants as read
    await message_model_1.Message.updateMany({
        conversationId,
        senderId: { $ne: currentUserId },
        isRead: false,
    }, {
        $set: { isRead: true, status: 'read' },
        $addToSet: { seenBy: { userId: currentUserId, seenAt: new Date() } },
    });
    // Emit read event to conversation room
    (0, socket_1.emitToConversation)(conversationId, 'messages-read', {
        conversationId,
        readBy: currentUserId,
        readAt: new Date(),
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { conversationId }, 'Messages marked as read'));
});
/**
 * Edit a specific message.
 */
exports.editMessage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const currentUserId = req.user?._id;
    const msg = await message_model_1.Message.findById(id);
    if (!msg) {
        throw new ApiError_1.ApiError(404, 'Message not found');
    }
    if (msg.senderId.toString() !== currentUserId?.toString()) {
        throw new ApiError_1.ApiError(403, 'You can only edit your own messages');
    }
    msg.message = message;
    msg.edited = true;
    msg.editedAt = new Date();
    await msg.save();
    const populated = await msg.populate('senderId', 'firstName lastName avatar role');
    (0, socket_1.emitToConversation)(msg.conversationId.toString(), 'message-edited', populated);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, populated, 'Message edited successfully'));
});
/**
 * Delete message for current user only (Soft Hide).
 */
exports.deleteMessageForMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user?._id;
    const msg = await message_model_1.Message.findById(id);
    if (!msg) {
        throw new ApiError_1.ApiError(404, 'Message not found');
    }
    if (!msg.deletedFor.includes(currentUserId)) {
        msg.deletedFor.push(currentUserId);
        await msg.save();
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Message deleted for you'));
});
/**
 * Delete message for everyone (Sender or Admin/SuperAdmin).
 */
exports.deleteMessageForEveryone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user?._id;
    const currentUserRole = req.user?.role;
    const msg = await message_model_1.Message.findById(id);
    if (!msg) {
        throw new ApiError_1.ApiError(404, 'Message not found');
    }
    const isOwner = msg.senderId.toString() === currentUserId?.toString();
    const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'SUPER_ADMIN';
    if (!isOwner && !isAdmin) {
        throw new ApiError_1.ApiError(403, 'غير مصرح لك بحذف هذه الرسالة');
    }
    const conversationId = msg.conversationId.toString();
    await msg.deleteOne();
    (0, socket_1.emitToConversation)(conversationId, 'message-deleted', { messageId: id, conversationId });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Message deleted for everyone'));
});
/**
 * Toggle emoji reaction on a message
 */
exports.toggleReaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { emoji } = req.body;
    const currentUserId = req.user?._id;
    if (!currentUserId || !emoji) {
        throw new ApiError_1.ApiError(400, 'Missing message ID or emoji');
    }
    const msg = await message_model_1.Message.findById(id);
    if (!msg) {
        throw new ApiError_1.ApiError(404, 'Message not found');
    }
    msg.reactions = msg.reactions || [];
    const existingIdx = msg.reactions.findIndex((r) => r.userId.toString() === currentUserId.toString() && r.emoji === emoji);
    if (existingIdx > -1) {
        // Remove existing reaction
        msg.reactions.splice(existingIdx, 1);
    }
    else {
        // Add new reaction (limit 1 emoji type per user or replace)
        msg.reactions = msg.reactions.filter((r) => r.userId.toString() !== currentUserId.toString());
        msg.reactions.push({
            userId: currentUserId,
            emoji,
            createdAt: new Date(),
        });
    }
    await msg.save();
    const populated = await msg.populate('senderId', 'firstName lastName avatar role');
    (0, socket_1.emitToConversation)(msg.conversationId.toString(), 'message-reaction', {
        messageId: msg._id,
        conversationId: msg.conversationId,
        reactions: populated.reactions,
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, populated, 'Reaction updated'));
});
/**
 * Search messages inside a specific conversation
 */
exports.searchMessages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { conversationId } = req.params;
    const { q = '' } = req.query;
    const currentUserId = req.user?._id;
    if (!currentUserId)
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    if (!q)
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, [], 'Empty query'));
    const searchRegex = new RegExp(String(q).trim(), 'i');
    const messages = await message_model_1.Message.find({
        conversationId,
        deletedFor: { $ne: currentUserId },
        message: searchRegex,
    })
        .populate('senderId', 'firstName lastName avatar role')
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, messages, 'Message search results'));
});
/**
 * Retrieve messages of a specific conversation (ignores messages hidden via deletedFor).
 */
exports.getConversationMessages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { conversationId } = req.params;
    const currentUserId = req.user?._id;
    const { page = 1, limit = 50 } = req.query;
    if (!currentUserId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
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
        .limit(limitNum)
        .lean();
    const total = await message_model_1.Message.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        messages: messages.reverse(),
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Messages retrieved successfully'));
});

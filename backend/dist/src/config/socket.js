"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserOnline = exports.emitToConversation = exports.emitToRoom = exports.emitToTeacher = exports.emitToUser = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../modules/users/user.model"));
let io = null;
const onlineUsers = new Map(); // Maps userId -> Set of socketIds
/**
 * Initialize Socket.io Server wrapped around the HTTP Server with JWT Authentication.
 */
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });
    // Socket Authentication Middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token ||
                socket.handshake.query?.token ||
                socket.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                console.warn(`[Socket Auth Warning] Client ${socket.id} connecting without token.`);
                return next();
            }
            const jwtSecret = process.env.JWT_SECRET || 'jwt_access_secret_key_change_me';
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            }
            catch (e) {
                const altSecret = 'edusphere_jwt_secret_key_change_in_production';
                try {
                    decoded = jsonwebtoken_1.default.verify(token, altSecret);
                }
                catch (err2) {
                    console.warn(`[Socket Auth Warning] Client ${socket.id} token verification failed. Continuing as guest.`);
                    return next();
                }
            }
            const userId = decoded.userId || decoded.id || decoded._id || decoded.sub;
            if (userId) {
                const user = await user_model_1.default.findById(userId).select('-password');
                if (user && !user.isBlocked) {
                    socket.data.user = user;
                    socket.user = user;
                }
            }
            next();
        }
        catch (err) {
            console.warn(`[Socket Auth Notice] Client ${socket.id} auth bypass:`, err.message);
            next();
        }
    });
    io.on('connection', (socket) => {
        const user = socket.data?.user || socket.user;
        const userId = user ? user._id.toString() : null;
        console.log(`[Socket] Connected: ${socket.id}${userId ? ` (User: ${userId}, Role: ${user.role})` : ' (Guest)'}`);
        // Ping-test endpoint for diagnostic checks
        socket.on('ping-test', (msg) => {
            console.log('[Socket Ping Test] received:', msg);
            socket.emit('pong-test', 'OK');
        });
        if (userId) {
            // Auto-join personal rooms
            socket.join(userId);
            socket.join(`user:${userId}`);
            if (user.role === 'TEACHER' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                socket.join(`teacher:${userId}`);
            }
            // Track online presence
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }
            onlineUsers.get(userId).add(socket.id);
            // Broadcast user-online to all connected clients
            io?.emit('user-online', userId);
            // Send initial list of currently online users to the connecting client
            socket.emit('online-users-list', Array.from(onlineUsers.keys()));
        }
        // Join room explicitly
        socket.on('join-room', (room) => {
            if (room) {
                socket.join(room);
                console.log(`[Socket] Client ${socket.id} joined room: ${room}`);
            }
        });
        socket.on('join', (room) => {
            if (room) {
                socket.join(room.toString());
                socket.join(`user:${room.toString()}`);
                console.log(`[Socket] Client ${socket.id} joined personal room: ${room}`);
            }
        });
        // Leave room
        socket.on('leave-room', (room) => {
            if (room) {
                socket.leave(room);
                console.log(`[Socket] Client ${socket.id} left room: ${room}`);
            }
        });
        // Conversation rooms
        socket.on('join-conversation', (conversationId) => {
            if (conversationId) {
                socket.join(conversationId.toString());
            }
        });
        socket.on('leave-conversation', (conversationId) => {
            if (conversationId) {
                socket.leave(conversationId.toString());
            }
        });
        // Typing status (supports both formats)
        socket.on('typing', (data) => {
            if (data.conversationId) {
                socket.to(data.conversationId.toString()).emit('typing', data);
                socket.to(data.conversationId.toString()).emit('typing:start', data);
            }
        });
        socket.on('typing:start', (data) => {
            if (data.conversationId) {
                socket.to(data.conversationId.toString()).emit('typing:start', data);
                socket.to(data.conversationId.toString()).emit('typing', data);
            }
        });
        socket.on('stop-typing', (data) => {
            if (data.conversationId) {
                socket.to(data.conversationId.toString()).emit('stop-typing', data);
                socket.to(data.conversationId.toString()).emit('typing:stop', data);
            }
        });
        socket.on('typing:stop', (data) => {
            if (data.conversationId) {
                socket.to(data.conversationId.toString()).emit('typing:stop', data);
                socket.to(data.conversationId.toString()).emit('stop-typing', data);
            }
        });
        // Mark messages as read (real-time read receipts)
        socket.on('mark-read', async (data) => {
            if (!userId || !data.conversationId)
                return;
            try {
                const { Message } = await Promise.resolve().then(() => __importStar(require('../modules/messages/message.model')));
                const { Conversation } = await Promise.resolve().then(() => __importStar(require('../modules/conversations/conversation.model')));
                // Reset unread count for this user
                const conversation = await Conversation.findById(data.conversationId);
                if (conversation) {
                    if (conversation.unreadCount) {
                        conversation.unreadCount.set(userId, 0);
                        await conversation.save();
                    }
                }
                // Mark all messages not sent by current user as read
                await Message.updateMany({
                    conversationId: data.conversationId,
                    senderId: { $ne: userId },
                    isRead: false,
                }, {
                    $set: { isRead: true, status: 'read' },
                    $addToSet: { seenBy: { userId, seenAt: new Date() } },
                });
                // Emit read receipt to entire conversation room (so sender sees ✓✓ turn blue)
                io?.to(data.conversationId).emit('messages-read', {
                    conversationId: data.conversationId,
                    readBy: userId,
                    readAt: new Date().toISOString(),
                });
            }
            catch (err) {
                console.error('[Socket] mark-read error:', err);
            }
        });
        // ─── Real-Time Voice Call Signaling ────────────────────────
        socket.on('call:invite', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            console.log(`[Socket Call] User ${userId} inviting target: ${targetId}`);
            const callPayload = {
                callId: data.callId || `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                from: userId,
                callerId: userId,
                callerName: data.callerName || (user ? `${user.firstName} ${user.lastName}` : 'مستخدم المنصة'),
                callerAvatar: data.callerAvatar || user?.avatar,
                callerRole: data.callerRole || user?.role,
                conversationId: data.conversationId,
                offer: data.offer,
                callType: 'voice',
                timestamp: new Date().toISOString(),
            };
            // Emit to all possible rooms synchronously — no DB lookup needed.
            // Emitting to an empty room is a no-op in Socket.IO (safe).
            const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
            console.log("[PROOF][CALL][SERVER_EMIT]", {
                callId: callPayload.callId,
                callerId: userId,
                targetId,
                timestamp: Date.now(),
                rooms: targetRooms.map((room) => ({
                    room,
                    socketCount: io?.sockets.adapter.rooms.get(room)?.size || 0,
                    socketIds: Array.from(io?.sockets.adapter.rooms.get(room) || []),
                })),
            });
            io?.to(targetRooms).emit('call:invite', callPayload);
        });
        socket.on('call-user', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            const callPayload = {
                callId: `call_${Date.now()}`,
                from: userId,
                offer: data.offer,
                conversationId: data.conversationId,
                callerName: data.callerName || 'مستخدم المنصة',
                callerAvatar: data.callerAvatar,
                callType: 'voice',
            };
            const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
            io?.to(targetRooms).emit('call:invite', callPayload);
        });
        socket.on('call:accept', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            console.log(`[Socket Call] User ${userId} accepted call from: ${targetId}`);
            io?.to(targetId).emit('call:accept', { from: userId, callId: data.callId, answer: data.answer });
        });
        socket.on('answer-call', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:accept', { from: userId, answer: data.answer });
        });
        socket.on('call:offer', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:offer', { from: userId, offer: data.offer });
        });
        socket.on('call:answer', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:answer', { from: userId, answer: data.answer });
        });
        socket.on('call:ice-candidate', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:ice-candidate', { from: userId, candidate: data.candidate });
        });
        socket.on('ice-candidate', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:ice-candidate', { from: userId, candidate: data.candidate });
        });
        socket.on('call:reject', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            console.log(`[Socket Call] User ${userId} rejected call from: ${targetId}`);
            io?.to(targetId).emit('call:reject', { from: userId, callId: data.callId });
        });
        socket.on('reject-call', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:reject', { from: userId });
        });
        socket.on('call:cancel', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:cancel', { from: userId, callId: data.callId });
        });
        socket.on('call:busy', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:busy', { from: userId });
        });
        socket.on('call:timeout', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:timeout', { from: userId });
        });
        socket.on('call:end', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            console.log(`[Socket Call] User ${userId} ended call with: ${targetId}`);
            io?.to(targetId).emit('call:end', { from: userId, callId: data.callId });
        });
        socket.on('end-call', (data) => {
            if (!data.to)
                return;
            const targetId = data.to.toString();
            io?.to(targetId).emit('call:end', { from: userId });
        });
        // Disconnect
        socket.on('disconnect', () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
            if (userId && onlineUsers.has(userId)) {
                const userSockets = onlineUsers.get(userId);
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                    io?.emit('user-offline', userId);
                }
            }
        });
    });
    return io;
};
exports.initSocket = initSocket;
/**
 * Get Socket.io Server instance.
 */
const getIO = () => {
    return io;
};
exports.getIO = getIO;
/**
 * Emit event to a specific user room
 */
const emitToUser = (userId, event, payload) => {
    if (io) {
        const targetRoom = userId.toString();
        io.to(targetRoom).emit(event, payload);
        console.log(`[Socket] Emitted '${event}' to user room: ${targetRoom}`);
    }
};
exports.emitToUser = emitToUser;
/**
 * Emit event to a specific teacher room
 */
const emitToTeacher = (teacherId, event, payload) => {
    if (io) {
        const targetRoom = `teacher:${teacherId.toString()}`;
        io.to(targetRoom).to(teacherId.toString()).emit(event, payload);
        console.log(`[Socket] Emitted '${event}' to teacher room: ${teacherId}`);
    }
};
exports.emitToTeacher = emitToTeacher;
/**
 * Emit event to any target room
 */
const emitToRoom = (room, event, payload) => {
    if (io) {
        io.to(room).emit(event, payload);
        console.log(`[Socket] Emitted '${event}' to room: ${room}`);
    }
};
exports.emitToRoom = emitToRoom;
/**
 * Emit event to a conversation room
 */
const emitToConversation = (conversationId, event, payload) => {
    if (io) {
        io.to(conversationId.toString()).emit(event, payload);
    }
};
exports.emitToConversation = emitToConversation;
/**
 * Check if user is online
 */
const isUserOnline = (userId) => {
    return onlineUsers.has(userId.toString());
};
exports.isUserOnline = isUserOnline;

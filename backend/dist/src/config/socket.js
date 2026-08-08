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
        // Typing status
        socket.on('typing', (data) => {
            if (data.conversationId && data.userId) {
                socket.to(data.conversationId.toString()).emit('typing', data);
            }
        });
        socket.on('stop-typing', (data) => {
            if (data.conversationId && data.userId) {
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
        // ─── Real-Time Voice & Video Call Signaling ────────────────────────
        socket.on('call-user', (data) => {
            if (!data.to)
                return;
            console.log(`[Socket Call] User ${userId} (${data.callType || 'voice'}) calling target: ${data.to}`);
            io?.to(data.to.toString()).emit('incoming-call', {
                from: userId,
                offer: data.offer,
                conversationId: data.conversationId,
                callerName: data.callerName || 'مستخدم المنصة',
                callerAvatar: data.callerAvatar,
                callType: data.callType || 'voice',
            });
        });
        socket.on('answer-call', (data) => {
            if (!data.to)
                return;
            console.log(`[Socket Call] User ${userId} answered call from: ${data.to}`);
            io?.to(data.to.toString()).emit('call-answered', {
                from: userId,
                answer: data.answer,
            });
        });
        socket.on('ice-candidate', (data) => {
            if (!data.to)
                return;
            io?.to(data.to.toString()).emit('ice-candidate', {
                from: userId,
                candidate: data.candidate,
            });
        });
        socket.on('reject-call', (data) => {
            if (!data.to)
                return;
            console.log(`[Socket Call] User ${userId} rejected call from: ${data.to}`);
            io?.to(data.to.toString()).emit('call-rejected', {
                from: userId,
            });
        });
        socket.on('end-call', (data) => {
            if (!data.to)
                return;
            console.log(`[Socket Call] User ${userId} ended call with: ${data.to}`);
            io?.to(data.to.toString()).emit('call-ended', {
                from: userId,
            });
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
        io.to(targetRoom).to(`teacher:${targetRoom}`).emit(event, payload);
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

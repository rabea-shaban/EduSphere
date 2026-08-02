"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserOnline = exports.emitToConversation = exports.emitToUser = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const onlineUsers = new Map(); // Maps userId -> Set of socketIds
/**
 * Initialize Socket.io Server wrapped around the HTTP Server.
 */
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        let currentUserId = null;
        console.log(`[Socket] Client connected: ${socket.id}`);
        // Join room based on User ID & track online status
        socket.on('join', (userId) => {
            if (userId) {
                currentUserId = userId.toString();
                socket.join(currentUserId);
                // Add socket ID to user's Set of active connections
                if (!onlineUsers.has(currentUserId)) {
                    onlineUsers.set(currentUserId, new Set());
                    // Broadcast to everyone that this user is online
                    socket.broadcast.emit('user-online', currentUserId);
                }
                onlineUsers.get(currentUserId).add(socket.id);
                console.log(`[Socket] User ${currentUserId} joined private room. Active sockets: ${onlineUsers.get(currentUserId).size}`);
            }
        });
        // Listen for joining conversation rooms (for private/group chats)
        socket.on('join-conversation', (conversationId) => {
            if (conversationId) {
                socket.join(conversationId.toString());
                console.log(`[Socket] Socket ${socket.id} joined conversation room: ${conversationId}`);
            }
        });
        // Listen for leaving conversation rooms
        socket.on('leave-conversation', (conversationId) => {
            if (conversationId) {
                socket.leave(conversationId.toString());
                console.log(`[Socket] Socket ${socket.id} left conversation room: ${conversationId}`);
            }
        });
        // Typing Status indicators
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
        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
            if (currentUserId && onlineUsers.has(currentUserId)) {
                const userSockets = onlineUsers.get(currentUserId);
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(currentUserId);
                    // Broadcast to everyone that this user went offline
                    socket.broadcast.emit('user-offline', currentUserId);
                    console.log(`[Socket] User ${currentUserId} is completely offline.`);
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
 * Emit real-time socket events targeting a specific user room.
 */
const emitToUser = (userId, event, payload) => {
    if (io) {
        io.to(userId.toString()).emit(event, payload);
        console.log(`[Socket] Emitted event '${event}' to user room: ${userId}`);
    }
};
exports.emitToUser = emitToUser;
/**
 * Emit real-time socket events targeting a conversation room (private or group).
 */
const emitToConversation = (conversationId, event, payload) => {
    if (io) {
        io.to(conversationId.toString()).emit(event, payload);
        console.log(`[Socket] Emitted event '${event}' to conversation room: ${conversationId}`);
    }
};
exports.emitToConversation = emitToConversation;
/**
 * Check if a specific user is currently online.
 */
const isUserOnline = (userId) => {
    return onlineUsers.has(userId.toString());
};
exports.isUserOnline = isUserOnline;

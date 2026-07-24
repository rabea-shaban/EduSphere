import { Server } from 'socket.io';
import http from 'http';

let io: Server | null = null;
const onlineUsers = new Map<string, Set<string>>(); // Maps userId -> Set of socketIds

/**
 * Initialize Socket.io Server wrapped around the HTTP Server.
 */
export const initSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    let currentUserId: string | null = null;

    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join room based on User ID & track online status
    socket.on('join', (userId: string) => {
      if (userId) {
        currentUserId = userId.toString();
        socket.join(currentUserId);

        // Add socket ID to user's Set of active connections
        if (!onlineUsers.has(currentUserId)) {
          onlineUsers.set(currentUserId, new Set());
          // Broadcast to everyone that this user is online
          socket.broadcast.emit('user-online', currentUserId);
        }
        onlineUsers.get(currentUserId)!.add(socket.id);

        console.log(`[Socket] User ${currentUserId} joined private room. Active sockets: ${onlineUsers.get(currentUserId)!.size}`);
      }
    });

    // Listen for joining conversation rooms (for private/group chats)
    socket.on('join-conversation', (conversationId: string) => {
      if (conversationId) {
        socket.join(conversationId.toString());
        console.log(`[Socket] Socket ${socket.id} joined conversation room: ${conversationId}`);
      }
    });

    // Listen for leaving conversation rooms
    socket.on('leave-conversation', (conversationId: string) => {
      if (conversationId) {
        socket.leave(conversationId.toString());
        console.log(`[Socket] Socket ${socket.id} left conversation room: ${conversationId}`);
      }
    });

    // Typing Status indicators
    socket.on('typing', (data: { conversationId: string; userId: string }) => {
      if (data.conversationId && data.userId) {
        socket.to(data.conversationId.toString()).emit('typing', data);
      }
    });

    socket.on('stop-typing', (data: { conversationId: string; userId: string }) => {
      if (data.conversationId && data.userId) {
        socket.to(data.conversationId.toString()).emit('stop-typing', data);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);

      if (currentUserId && onlineUsers.has(currentUserId)) {
        const userSockets = onlineUsers.get(currentUserId)!;
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

/**
 * Get Socket.io Server instance.
 */
export const getIO = (): Server | null => {
  return io;
};

/**
 * Emit real-time socket events targeting a specific user room.
 */
export const emitToUser = (userId: any, event: string, payload: any): void => {
  if (io) {
    io.to(userId.toString()).emit(event, payload);
    console.log(`[Socket] Emitted event '${event}' to user room: ${userId}`);
  }
};

/**
 * Emit real-time socket events targeting a conversation room (private or group).
 */
export const emitToConversation = (conversationId: string, event: string, payload: any): void => {
  if (io) {
    io.to(conversationId.toString()).emit(event, payload);
    console.log(`[Socket] Emitted event '${event}' to conversation room: ${conversationId}`);
  }
};

/**
 * Check if a specific user is currently online.
 */
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId.toString());
};

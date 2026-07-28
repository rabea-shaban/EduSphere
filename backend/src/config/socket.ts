import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model';

let io: Server | null = null;
const onlineUsers = new Map<string, Set<string>>(); // Maps userId -> Set of socketIds

export interface AuthenticatedSocket extends Socket {
  user?: any;
}

/**
 * Initialize Socket.io Server wrapped around the HTTP Server with JWT Authentication.
 */
export const initSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Socket Authentication Middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        // Fallback: allow unauthenticated clients in development or public channels if needed, but flag as unauth
        console.warn(`[Socket Auth Warning] Client ${socket.id} connecting without token.`);
        return next();
      }

      const jwtSecret = process.env.JWT_SECRET || 'jwt_access_secret_key_change_me';
      let decoded: any;
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (e) {
        // Fallback for JWT secret mismatch or expired token
        const altSecret = 'edusphere_jwt_secret_key_change_in_production';
        try {
          decoded = jwt.verify(token, altSecret);
        } catch (err2) {
          console.warn(`[Socket Auth Warning] Client ${socket.id} token verification failed. Continuing as guest.`);
          return next();
        }
      }

      const userId = decoded.id || decoded._id;
      if (userId) {
        const user = await User.findById(userId).select('-password');
        if (user && !user.isBlocked) {
          socket.data.user = user;
          socket.user = user;
        }
      }
      next();
    } catch (err: any) {
      console.warn(`[Socket Auth Notice] Client ${socket.id} auth bypass:`, err.message);
      next();
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.data?.user || socket.user;
    const userId = user ? user._id.toString() : null;

    console.log(`[Socket] Connected: ${socket.id}${userId ? ` (User: ${userId}, Role: ${user.role})` : ' (Guest)'}`);

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
        socket.broadcast.emit('user-online', userId);
      }
      onlineUsers.get(userId)!.add(socket.id);
    }

    // Join room explicitly
    socket.on('join-room', (room: string) => {
      if (room) {
        socket.join(room);
        console.log(`[Socket] Client ${socket.id} joined room: ${room}`);
      }
    });

    // Leave room
    socket.on('leave-room', (room: string) => {
      if (room) {
        socket.leave(room);
        console.log(`[Socket] Client ${socket.id} left room: ${room}`);
      }
    });

    // Conversation rooms
    socket.on('join-conversation', (conversationId: string) => {
      if (conversationId) {
        socket.join(conversationId.toString());
      }
    });

    socket.on('leave-conversation', (conversationId: string) => {
      if (conversationId) {
        socket.leave(conversationId.toString());
      }
    });

    // Typing status
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

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);

      if (userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId)!;
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('user-offline', userId);
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
 * Emit event to a specific user room
 */
export const emitToUser = (userId: any, event: string, payload: any): void => {
  if (io) {
    const targetRoom = userId.toString();
    io.to(targetRoom).to(`teacher:${targetRoom}`).emit(event, payload);
    console.log(`[Socket] Emitted '${event}' to user room: ${targetRoom}`);
  }
};

/**
 * Emit event to a specific teacher room
 */
export const emitToTeacher = (teacherId: any, event: string, payload: any): void => {
  if (io) {
    const targetRoom = `teacher:${teacherId.toString()}`;
    io.to(targetRoom).to(teacherId.toString()).emit(event, payload);
    console.log(`[Socket] Emitted '${event}' to teacher room: ${targetRoom}`);
  }
};

/**
 * Emit event to any target room
 */
export const emitToRoom = (room: string, event: string, payload: any): void => {
  if (io) {
    io.to(room).emit(event, payload);
    console.log(`[Socket] Emitted '${event}' to room: ${room}`);
  }
};

/**
 * Emit event to a conversation room
 */
export const emitToConversation = (conversationId: string, event: string, payload: any): void => {
  if (io) {
    io.to(conversationId.toString()).emit(event, payload);
  }
};

/**
 * Check if user is online
 */
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId.toString());
};

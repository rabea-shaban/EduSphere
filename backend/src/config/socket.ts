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
        (socket.handshake.query?.token as string) ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        console.warn(`[Socket Auth Warning] Client ${socket.id} connecting without token.`);
        return next();
      }

      const jwtSecret = process.env.JWT_SECRET || 'jwt_access_secret_key_change_me';
      let decoded: any;
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (e) {
        const altSecret = 'edusphere_jwt_secret_key_change_in_production';
        try {
          decoded = jwt.verify(token, altSecret);
        } catch (err2) {
          console.warn(`[Socket Auth Warning] Client ${socket.id} token verification failed. Continuing as guest.`);
          return next();
        }
      }

      const userId = decoded.userId || decoded.id || decoded._id || decoded.sub;
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

    // Ping-test endpoint for diagnostic checks
    socket.on('ping-test', (msg: any) => {
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
      onlineUsers.get(userId)!.add(socket.id);

      // Broadcast user-online to all connected clients
      io?.emit('user-online', userId);

      // Send initial list of currently online users to the connecting client
      socket.emit('online-users-list', Array.from(onlineUsers.keys()));
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

    // Typing status (supports both formats)
    socket.on('typing', (data: { conversationId: string; userId: string }) => {
      if (data.conversationId) {
        socket.to(data.conversationId.toString()).emit('typing', data);
        socket.to(data.conversationId.toString()).emit('typing:start', data);
      }
    });

    socket.on('typing:start', (data: { conversationId: string; userId: string }) => {
      if (data.conversationId) {
        socket.to(data.conversationId.toString()).emit('typing:start', data);
        socket.to(data.conversationId.toString()).emit('typing', data);
      }
    });

    socket.on('stop-typing', (data: { conversationId: string; userId: string }) => {
      if (data.conversationId) {
        socket.to(data.conversationId.toString()).emit('stop-typing', data);
        socket.to(data.conversationId.toString()).emit('typing:stop', data);
      }
    });

    socket.on('typing:stop', (data: { conversationId: string; userId: string }) => {
      if (data.conversationId) {
        socket.to(data.conversationId.toString()).emit('typing:stop', data);
        socket.to(data.conversationId.toString()).emit('stop-typing', data);
      }
    });

    // Mark messages as read (real-time read receipts)
    socket.on('mark-read', async (data: { conversationId: string }) => {
      if (!userId || !data.conversationId) return;
      try {
        const { Message } = await import('../modules/messages/message.model');
        const { Conversation } = await import('../modules/conversations/conversation.model');

        // Reset unread count for this user
        const conversation = await Conversation.findById(data.conversationId);
        if (conversation) {
          if (conversation.unreadCount) {
            conversation.unreadCount.set(userId, 0);
            await conversation.save();
          }
        }

        // Mark all messages not sent by current user as read
        await Message.updateMany(
          {
            conversationId: data.conversationId,
            senderId: { $ne: userId },
            isRead: false,
          },
          {
            $set: { isRead: true, status: 'read' },
            $addToSet: { seenBy: { userId, seenAt: new Date() } },
          }
        );

        // Emit read receipt to entire conversation room (so sender sees ✓✓ turn blue)
        io?.to(data.conversationId).emit('messages-read', {
          conversationId: data.conversationId,
          readBy: userId,
          readAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[Socket] mark-read error:', err);
      }
    });

    // ─── Real-Time Voice Call Signaling ────────────────────────
    socket.on('call:invite', (data: { to: string; callId?: string; conversationId?: string; offer?: any; callerName?: string; callerAvatar?: string; callerRole?: string }) => {
      if (!data.to) return;
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

      io?.to(targetId).to(`user:${targetId}`).emit('call:invite', callPayload);
      io?.to(targetId).to(`user:${targetId}`).emit('incoming-call', callPayload);
    });

    socket.on('call-user', (data: { to: string; offer: any; conversationId: string; callerName: string; callerAvatar?: string }) => {
      if (!data.to) return;
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
      io?.to(targetId).to(`user:${targetId}`).emit('call:invite', callPayload);
      io?.to(targetId).to(`user:${targetId}`).emit('incoming-call', callPayload);
    });

    socket.on('call:accept', (data: { to: string; callId?: string; answer?: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      console.log(`[Socket Call] User ${userId} accepted call from: ${targetId}`);
      io?.to(targetId).to(`user:${targetId}`).emit('call:accept', { from: userId, callId: data.callId, answer: data.answer });
      io?.to(targetId).to(`user:${targetId}`).emit('call-answered', { from: userId, answer: data.answer });
    });

    socket.on('answer-call', (data: { to: string; answer: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:accept', { from: userId, answer: data.answer });
      io?.to(targetId).to(`user:${targetId}`).emit('call-answered', { from: userId, answer: data.answer });
    });

    socket.on('call:offer', (data: { to: string; offer: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:offer', { from: userId, offer: data.offer });
    });

    socket.on('call:answer', (data: { to: string; answer: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:answer', { from: userId, answer: data.answer });
    });

    socket.on('call:ice-candidate', (data: { to: string; candidate: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:ice-candidate', { from: userId, candidate: data.candidate });
      io?.to(targetId).to(`user:${targetId}`).emit('ice-candidate', { from: userId, candidate: data.candidate });
    });

    socket.on('ice-candidate', (data: { to: string; candidate: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:ice-candidate', { from: userId, candidate: data.candidate });
    });

    socket.on('call:reject', (data: { to: string; callId?: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      console.log(`[Socket Call] User ${userId} rejected call from: ${targetId}`);
      io?.to(targetId).to(`user:${targetId}`).emit('call:reject', { from: userId, callId: data.callId });
      io?.to(targetId).to(`user:${targetId}`).emit('call-rejected', { from: userId });
    });

    socket.on('reject-call', (data: { to: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:reject', { from: userId });
    });

    socket.on('call:cancel', (data: { to: string; callId?: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:cancel', { from: userId, callId: data.callId });
    });

    socket.on('call:busy', (data: { to: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:busy', { from: userId });
    });

    socket.on('call:timeout', (data: { to: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:timeout', { from: userId });
    });

    socket.on('call:end', (data: { to: string; callId?: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      console.log(`[Socket Call] User ${userId} ended call with: ${targetId}`);
      io?.to(targetId).to(`user:${targetId}`).emit('call:end', { from: userId, callId: data.callId });
      io?.to(targetId).to(`user:${targetId}`).emit('call-ended', { from: userId });
    });

    socket.on('end-call', (data: { to: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      io?.to(targetId).to(`user:${targetId}`).emit('call:end', { from: userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);

      if (userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId)!;
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
    io.to(targetRoom).emit(event, payload);
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
    console.log(`[Socket] Emitted '${event}' to teacher room: ${teacherId}`);
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

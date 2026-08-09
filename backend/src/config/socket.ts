import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../modules/users/user.model';
import { initTeacherRealtimeSocket } from '../modules/teacher-realtime/teacher-realtime.socket';

let io: Server | null = null;
const onlineUsers = new Map<string, Set<string>>(); // Maps userId -> Set of socketIds

// ─── Async Message Persistence Helper ───────────────────────────────────────
/**
 * Persists a chat message to MongoDB asynchronously (non-blocking).
 * Must NEVER be awaited on the realtime delivery path.
 * Idempotent: checks compound key {conversationId, senderId, clientMessageId} before creating.
 */
async function persistMessage(envelope: {
  _id: string;
  clientMessageId: string;
  conversationId: string;
  senderId: string;
  message: string;
  messageType: string;
  attachments: string[];
  replyTo?: string;
  createdAt: string;
  participantIds: string[];
}, retryCount = 0): Promise<void> {
  const logCtx = {
    messageId: envelope._id,
    clientMessageId: envelope.clientMessageId,
    conversationId: envelope.conversationId,
    senderId: envelope.senderId,
    timestamp: new Date().toISOString(),
  };

  try {
    const { Message } = await import('../modules/messages/message.model');
    const { Conversation } = await import('../modules/conversations/conversation.model');

    console.log('[CHAT][PERSIST_START]', logCtx);

    // Idempotency check — return existing if already persisted
    if (envelope.clientMessageId) {
      const existing = await Message.findOne({
        conversationId: envelope.conversationId,
        senderId: envelope.senderId,
        clientMessageId: envelope.clientMessageId,
      }).lean() as any;

      if (existing) {
        console.log('[CHAT][PERSIST_IDEMPOTENT] Already persisted, skipping.', logCtx);
        // Emit persisted event so sender can update status
        if (io) {
          io.to(envelope.senderId).emit('chat:message:persisted', {
            clientMessageId: envelope.clientMessageId,
            messageId: existing._id.toString(),
            conversationId: envelope.conversationId,
            timestamp: new Date().toISOString(),
          });
        }
        return;
      }
    }

    // Create message in DB
    const msg = await Message.create({
      _id: new Types.ObjectId(envelope._id),
      conversationId: envelope.conversationId,
      senderId: envelope.senderId,
      clientMessageId: envelope.clientMessageId,
      message: envelope.message || '',
      messageType: (envelope.messageType || 'Text') as 'Text' | 'Image' | 'Video' | 'Audio' | 'Document' | 'System',
      attachments: envelope.attachments || [],
      replyTo: envelope.replyTo || undefined,
      status: 'persisted' as 'sent' | 'delivered' | 'read' | 'delivering' | 'persisted',
      isRead: false,
      seenBy: [{ userId: envelope.senderId, seenAt: new Date() }],
    });

    // Update conversation metadata
    const conversation = await Conversation.findById(envelope.conversationId);
    if (conversation) {
      const unreadMap = conversation.unreadCount || new Map();
      envelope.participantIds.forEach((pId) => {
        if (pId !== envelope.senderId) {
          unreadMap.set(pId, (unreadMap.get(pId) || 0) + 1);
        }
      });
      conversation.unreadCount = unreadMap;
      conversation.lastMessage = msg._id as any;
      conversation.lastSender = envelope.senderId as any;
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    console.log('[CHAT][PERSIST_SUCCESS]', logCtx);

    // Notify sender that message is durably stored
    if (io) {
      io.to(envelope.senderId).emit('chat:message:persisted', {
        clientMessageId: envelope.clientMessageId,
        messageId: msg._id.toString(),
        conversationId: envelope.conversationId,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    // Handle duplicate key errors (race condition safe)
    if (err?.code === 11000) {
      console.log('[CHAT][PERSIST_IDEMPOTENT] Duplicate key — already persisted.', logCtx);
      return;
    }

    console.error('[CHAT][PERSIST_FAILED]', { ...logCtx, error: err?.message });

    // Retry once after 2s
    if (retryCount === 0) {
      console.log('[CHAT][PERSIST_RETRY] Retrying persistence in 2s...', logCtx);
      setTimeout(() => persistMessage(envelope, 1), 2000);
    } else {
      console.error('[CHAT][PERSIST_FAILED_FINAL] Giving up after retry.', logCtx);
    }
  }
}

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

  // Initialize Isolated Teacher Realtime Namespace (/teacher-realtime)
  initTeacherRealtimeSocket(io);

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

    socket.on('join', (room: string) => {
      if (room) {
        socket.join(room.toString());
        socket.join(`user:${room.toString()}`);
        console.log(`[Socket] Client ${socket.id} joined personal room: ${room}`);
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
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];

      io?.to(targetRooms).emit('call:invite', callPayload);
    });

    socket.on('call:accept', (data: { to: string; callId?: string; answer?: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      console.log(`[Socket Call] User ${userId} accepted call from: ${targetId}`);
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:accept', { from: userId, callId: data.callId, answer: data.answer });
    });

    socket.on('answer-call', (data: { to: string; answer: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:accept', { from: userId, answer: data.answer });
    });

    socket.on('call:offer', (data: { to: string; offer: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:offer', { from: userId, offer: data.offer });
    });

    socket.on('call:answer', (data: { to: string; answer: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:answer', { from: userId, answer: data.answer });
    });

    socket.on('call:ice-candidate', (data: { to: string; candidate: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:ice-candidate', { from: userId, candidate: data.candidate });
    });

    socket.on('ice-candidate', (data: { to: string; candidate: any }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:ice-candidate', { from: userId, candidate: data.candidate });
    });

    socket.on('call:reject', (data: { to: string; callId?: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      console.log(`[Socket Call] User ${userId} rejected call from: ${targetId}`);
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:reject', { from: userId, callId: data.callId });
    });

    socket.on('reject-call', (data: { to: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:reject', { from: userId });
    });

    socket.on('call:cancel', (data: { to: string; callId?: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:cancel', { from: userId, callId: data.callId });
    });

    socket.on('call:busy', (data: { to: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:busy', { from: userId });
    });

    socket.on('call:timeout', (data: { to: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:timeout', { from: userId });
    });

    socket.on('call:end', (data: { to: string; callId?: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      console.log(`[Socket Call] User ${userId} ended call with: ${targetId}`);
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:end', { from: userId, callId: data.callId });
    });

    socket.on('end-call', (data: { to: string }) => {
      if (!data.to) return;
      const targetId = data.to.toString();
      const targetRooms = [targetId, `user:${targetId}`, `teacher:${targetId}`];
      io?.to(targetRooms).emit('call:end', { from: userId });
    });

    // ─── Realtime-First Chat Messaging ────────────────────────────────────────
    socket.on('chat:message:send', async (payload: {
      clientMessageId: string;
      conversationId: string;
      text: string;
      messageType?: string;
      attachments?: string[];
      replyTo?: string;
      createdAt?: string;
    }) => {
      const senderUser = socket.data?.user || (socket as any).user;
      const senderId = senderUser?._id?.toString();

      const logCtx = {
        role: senderUser?.role,
        socketId: socket.id,
        clientMessageId: payload?.clientMessageId,
        conversationId: payload?.conversationId,
        timestamp: new Date().toISOString(),
      };

      console.log('[CHAT][SERVER_RECEIVE]', logCtx);

      if (!senderId) {
        socket.emit('chat:message:error', { error: 'Unauthorized', clientMessageId: payload?.clientMessageId });
        return;
      }

      if (!payload?.conversationId || !payload?.clientMessageId) {
        socket.emit('chat:message:error', { error: 'Missing conversationId or clientMessageId', clientMessageId: payload?.clientMessageId });
        return;
      }

      try {
        const { Conversation } = await import('../modules/conversations/conversation.model');

        // Lightweight membership check (.lean() = no mongoose overhead)
        const conversation = await Conversation.findById(payload.conversationId)
          .select('participants')
          .lean() as any;

        if (!conversation) {
          socket.emit('chat:message:error', { error: 'Conversation not found', clientMessageId: payload.clientMessageId });
          return;
        }

        const participantIds = conversation.participants.map((p: any) => p.toString());
        if (!participantIds.includes(senderId)) {
          socket.emit('chat:message:error', { error: 'Not a participant', clientMessageId: payload.clientMessageId });
          return;
        }

        // Pre-generate messageId (Mongo ObjectId) so recipient gets the real ID immediately
        const messageId = new Types.ObjectId().toString();

        // Build canonical message envelope
        const envelope = {
          _id: messageId,
          clientMessageId: payload.clientMessageId,
          conversationId: payload.conversationId,
          senderId: {
            _id: senderId,
            firstName: senderUser.firstName || '',
            lastName: senderUser.lastName || '',
            avatar: senderUser.avatar || null,
            role: senderUser.role || 'STUDENT',
          },
          message: payload.text || '',
          messageType: payload.messageType || 'Text',
          attachments: payload.attachments || [],
          replyTo: payload.replyTo || undefined,
          status: 'delivered',
          isRead: false,
          createdAt: payload.createdAt || new Date().toISOString(),
        };

        console.log('[CHAT][SERVER_EMIT]', {
          ...logCtx,
          messageId,
          recipientCount: participantIds.filter((p: string) => p !== senderId).length,
        });

        // ── STEP 1: Immediately emit to conversation room (catches users who have joined it)
        socket.to(payload.conversationId).emit('chat:message:receive', envelope);
        socket.to(payload.conversationId).emit('message:new', envelope); // backward compat

        // ── STEP 2: Immediately emit to each recipient's personal room (guarantees delivery)
        participantIds.forEach((pId: string) => {
          if (pId !== senderId && io) {
            io.to(pId).emit('chat:message:receive', envelope);
            io.to(pId).emit('message:new', envelope); // backward compat
          }
        });

        // ── STEP 3: Immediately acknowledge delivery to sender
        socket.emit('chat:message:delivered', {
          clientMessageId: payload.clientMessageId,
          messageId,
          conversationId: payload.conversationId,
          timestamp: new Date().toISOString(),
        });

        // ── STEP 4: Async persistence — NEVER blocks the delivery path
        setImmediate(() => persistMessage({
          _id: messageId,
          clientMessageId: payload.clientMessageId,
          conversationId: payload.conversationId,
          senderId,
          message: payload.text || '',
          messageType: payload.messageType || 'Text',
          attachments: payload.attachments || [],
          replyTo: payload.replyTo,
          createdAt: payload.createdAt || new Date().toISOString(),
          participantIds,
        }));

      } catch (err: any) {
        console.error('[CHAT][SERVER_RECEIVE_ERROR]', { ...logCtx, error: err?.message });
        socket.emit('chat:message:error', { error: 'Server error', clientMessageId: payload?.clientMessageId });
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

import { Server, Namespace, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../users/user.model';
import { teacherCallSessionStore } from './teacher-realtime.service';

export interface TeacherRealtimeSocket extends Socket {
  user?: any;
}

let teacherNamespace: Namespace | null = null;

export const initTeacherRealtimeSocket = (io: Server): Namespace => {
  teacherNamespace = io.of('/teacher-realtime');

  // Authentication & Authorization Middleware
  teacherNamespace.use(async (socket: TeacherRealtimeSocket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.query?.token as string) ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        console.warn(`[TEACHER_REALTIME][AUTH_FAIL] Socket ${socket.id} missing authentication token.`);
        return next(new Error('Authentication required'));
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
          console.warn(`[TEACHER_REALTIME][AUTH_FAIL] Socket ${socket.id} token verification failed.`);
          return next(new Error('Invalid token'));
        }
      }

      const userId = decoded.userId || decoded.id || decoded._id || decoded.sub;
      if (userId) {
        const user = await User.findById(userId).select('-password');
        if (user && !user.isBlocked) {
          socket.user = user;
          return next();
        }
      }
      return next(new Error('User unauthorized or blocked'));
    } catch (err: any) {
      console.error(`[TEACHER_REALTIME][AUTH_ERROR] Socket ${socket.id}:`, err.message);
      return next(new Error('Internal authorization error'));
    }
  });

  teacherNamespace.on('connection', (socket: TeacherRealtimeSocket) => {
    const user = socket.user;
    const userId = user._id.toString();

    console.log(`[TEACHER_REALTIME][CONNECT] socketId: ${socket.id}, userId: ${userId}, role: ${user.role}, transport: ${socket.conn.transport.name}`);

    // Join personal deterministic channel
    const personalRoom = `teacher-user:${userId}`;
    socket.join(personalRoom);

    const roomSocketCount = teacherNamespace?.adapter.rooms.get(personalRoom)?.size || 0;
    console.log('[TEACHER_CALL_V2][ROOM_JOIN]', {
      socketId: socket.id,
      userId,
      role: user.role,
      room: personalRoom,
      roomSocketCount,
    });

    // Call Signaling Events
    socket.on('teacher:call:invite', async (data: { to: string; conversationId?: string; callId?: string }) => {
      const targetUserId = data.to;
      console.log(`[TEACHER_CALL][INVITE] caller: ${userId}, target: ${targetUserId}, callId: ${data.callId}`);

      if (!targetUserId) return;

      const existingSession = data.callId ? await teacherCallSessionStore.get(data.callId) : null;

      if (!existingSession) {
        // Single active call protection if no session was created via REST
        const isCallerBusy = await teacherCallSessionStore.hasActiveCall(userId);
        const isTargetBusy = await teacherCallSessionStore.hasActiveCall(targetUserId);

        if (isCallerBusy || isTargetBusy) {
          console.warn(`[TEACHER_CALL][BUSY] Call rejected. CallerBusy: ${isCallerBusy}, TargetBusy: ${isTargetBusy}`);
          socket.emit('teacher:call:busy', { to: targetUserId, reason: isCallerBusy ? 'CALLER_BUSY' : 'TARGET_BUSY' });
          return;
        }
      }

      const callId = data.callId || `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const teacherId = user.role === 'TEACHER' ? userId : targetUserId;
      const studentId = user.role === 'STUDENT' ? userId : targetUserId;

      if (!existingSession) {
        await teacherCallSessionStore.create({
          callId,
          teacherId,
          studentId,
          status: 'RINGING',
          callerRole: user.role,
          createdAt: Date.now(),
          conversationId: data.conversationId,
        });
      }

      const targetRoom = `teacher-user:${targetUserId}`;
      const targetSockets = teacherNamespace?.adapter.rooms.get(targetRoom);
      const deliveredSocketCount = targetSockets?.size || 0;
      const roomSocketIds = Array.from(targetSockets || []);

      console.log('[TEACHER_CALL_V2][SERVER_INVITE]', {
        callId,
        callerId: userId,
        targetId: targetUserId,
        targetRoom,
        namespace: '/teacher-realtime',
        roomSocketCount: deliveredSocketCount,
        roomSocketIds,
      });

      // Optional acknowledgment to caller
      socket.emit('teacher:call:invite:ack', {
        callId,
        targetId: targetUserId,
        deliveredSocketCount,
      });

      // Forward invite to recipient's personal V2 channel
      teacherNamespace?.to(targetRoom).emit('teacher:call:invite', {
        callId,
        from: userId,
        callerName: `${user.firstName} ${user.lastName}`.trim(),
        callerAvatar: user.avatar,
        callerRole: user.role,
        conversationId: data.conversationId,
      });
    });

    socket.on('teacher:call:accept', async (data: { callId: string; to: string }) => {
      console.log(`[TEACHER_CALL][ACCEPT] callId: ${data.callId}, user: ${userId}`);
      const session = await teacherCallSessionStore.get(data.callId);
      if (!session || session.status !== 'RINGING') {
        console.warn(`[TEACHER_CALL][ACCEPT_FAIL] Invalid or non-ringing session ${data.callId}`);
        return;
      }

      // Verify participant authorization
      if (session.teacherId !== userId && session.studentId !== userId) return;

      await teacherCallSessionStore.update(data.callId, { status: 'ACCEPTED', acceptedAt: Date.now() });

      teacherNamespace?.to(`teacher-user:${data.to}`).emit('teacher:call:accept', {
        callId: data.callId,
        from: userId,
      });
    });

    socket.on('teacher:call:offer', async (data: { callId: string; to: string; offer: any }) => {
      console.log(`[TEACHER_CALL][OFFER] callId: ${data.callId}, from: ${userId}`);
      const session = await teacherCallSessionStore.get(data.callId);
      if (!session) return;
      if (session.teacherId !== userId && session.studentId !== userId) return;

      await teacherCallSessionStore.update(data.callId, { status: 'CONNECTING' });

      teacherNamespace?.to(`teacher-user:${data.to}`).emit('teacher:call:offer', {
        callId: data.callId,
        from: userId,
        offer: data.offer,
      });
    });

    socket.on('teacher:call:answer', async (data: { callId: string; to: string; answer: any }) => {
      console.log(`[TEACHER_CALL][ANSWER] callId: ${data.callId}, from: ${userId}`);
      const session = await teacherCallSessionStore.get(data.callId);
      if (!session) return;
      if (session.teacherId !== userId && session.studentId !== userId) return;

      await teacherCallSessionStore.update(data.callId, { status: 'CONNECTED' });

      teacherNamespace?.to(`teacher-user:${data.to}`).emit('teacher:call:answer', {
        callId: data.callId,
        from: userId,
        answer: data.answer,
      });
    });

    socket.on('teacher:call:ice', async (data: { callId: string; to: string; candidate: any }) => {
      const session = await teacherCallSessionStore.get(data.callId);
      if (!session) return;
      if (session.teacherId !== userId && session.studentId !== userId) return;

      teacherNamespace?.to(`teacher-user:${data.to}`).emit('teacher:call:ice', {
        callId: data.callId,
        from: userId,
        candidate: data.candidate,
      });
    });

    socket.on('teacher:call:reject', async (data: { callId: string; to: string }) => {
      console.log(`[TEACHER_CALL][REJECT] callId: ${data.callId}, user: ${userId}`);
      const session = await teacherCallSessionStore.get(data.callId);
      if (session) {
        await teacherCallSessionStore.update(data.callId, { status: 'REJECTED', endedAt: Date.now(), endedBy: userId });
      }

      teacherNamespace?.to(`teacher-user:${data.to}`).emit('teacher:call:reject', {
        callId: data.callId,
        from: userId,
      });
    });

    socket.on('teacher:call:end', async (data: { callId: string; to: string }) => {
      console.log(`[TEACHER_CALL][END] callId: ${data.callId}, user: ${userId}`);
      const session = await teacherCallSessionStore.get(data.callId);
      if (session) {
        await teacherCallSessionStore.update(data.callId, { status: 'ENDED', endedAt: Date.now(), endedBy: userId });
      }

      teacherNamespace?.to(`teacher-user:${data.to}`).emit('teacher:call:end', {
        callId: data.callId,
        from: userId,
      });
    });

    // Disconnect Handler
    socket.on('disconnect', (reason: string) => {
      console.log(`[TEACHER_REALTIME][DISCONNECT] socketId: ${socket.id}, userId: ${userId}, reason: ${reason}`);
    });
  });

  return teacherNamespace;
};

export const getTeacherNamespace = (): Namespace | null => teacherNamespace;

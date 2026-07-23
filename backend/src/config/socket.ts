import { Server } from 'socket.io';
import http from 'http';

let io: Server | null = null;

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
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join room based on User ID
    socket.on('join', (userId: string) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`[Socket] User ${userId} joined room`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
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
  } else {
    console.log(`[Socket] Warning: Socket Server not initialized. Event '${event}' was ignored.`);
  }
};

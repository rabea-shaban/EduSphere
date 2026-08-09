"use client";

import { io, Socket } from "socket.io-client";
import { logger } from "./teacher-call.logger";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "http://localhost:5000");

let teacherCallSocketInstance: Socket | null = null;

export const getTeacherCallSocket = (token: string): Socket => {
  if (teacherCallSocketInstance && teacherCallSocketInstance.connected) {
    return teacherCallSocketInstance;
  }

  if (teacherCallSocketInstance) {
    teacherCallSocketInstance.connect();
    return teacherCallSocketInstance;
  }

  logger.log("TEACHER_CALL_V2][CONNECT_INIT", { url: `${SOCKET_URL}/teacher-realtime` });

  teacherCallSocketInstance = io(`${SOCKET_URL}/teacher-realtime`, {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  teacherCallSocketInstance.on("connect", () => {
    logger.log("TEACHER_CALL_V2][CONNECT", {
      socketId: teacherCallSocketInstance?.id,
      transport: teacherCallSocketInstance?.io.engine.transport.name,
      connected: teacherCallSocketInstance?.connected,
    });
  });

  teacherCallSocketInstance.on("disconnect", (reason) => {
    logger.warn("TEACHER_CALL_V2][DISCONNECT", {
      socketId: teacherCallSocketInstance?.id,
      reason,
      connected: teacherCallSocketInstance?.connected,
    });
  });

  teacherCallSocketInstance.on("connect_error", (error) => {
    logger.error("TEACHER_CALL_V2][ERROR", { message: error.message });
  });

  return teacherCallSocketInstance;
};

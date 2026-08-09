"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "@/providers/auth-provider";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "http://localhost:5000");

export function useTeacherRealtime() {
  const { user } = useAuthContext();
  const userId = user?._id;

  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      if (socketRef.current) {
        console.log("[TEACHER_REALTIME][DISCONNECT_CLEANUP] User logged out.");
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    if (socketRef.current) {
      if (!socketRef.current.connected) {
        socketRef.current.connect();
      }
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("auth_token") : "";

    const socketInstance = io(`${SOCKET_URL}/teacher-realtime`, {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log(`[TEACHER_REALTIME][CONNECT] socketId: ${socketInstance.id}, transport: ${socketInstance.io.engine.transport.name}`);
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log(`[TEACHER_REALTIME][DISCONNECT] socketId: ${socketInstance.id}, reason: ${reason}`);
    });

    socketInstance.on("connect_error", (error) => {
      console.warn(`[TEACHER_REALTIME][ERROR] ${error.message}`);
    });

    // Clean up ONLY on unmount if session actually terminates
  }, [userId]);

  return { socket: socketRef.current, isConnected, socketId: socketRef.current?.id };
}

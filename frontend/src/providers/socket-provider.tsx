"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io as ioClient, Socket } from "socket.io-client";
import { useAuthContext } from "./auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Bell } from "lucide-react";
import type { SocketConnectionState, RealtimeEventPayload } from "@/features/teacher/types/realtime";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionState: SocketConnectionState;
  onlineUserIds: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionState: "disconnected",
  onlineUserIds: [],
});

export const useSocketContext = () => useContext(SocketContext);

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "http://localhost:5000");

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<SocketConnectionState>("disconnected");
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  const userId = user?._id;
  const userRole = user?.role;

  useEffect(() => {
    if (!userId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnectionState("disconnected");
      }
      return;
    }

    setConnectionState("connecting");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("auth_token") : "";

    const socketInstance = ioClient(SOCKET_URL, {
      transports: ["websocket", "polling"], // Prioritize direct WebSockets for zero HTTP polling disconnects
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setConnectionState("connected");
      console.log("[Socket.IO] Authenticated socket connected ID:", socketInstance.id);

      if (userId) {
        socketInstance.emit("join", userId);
        socketInstance.emit("join-room", `teacher:${userId}`);
      }
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
      setConnectionState(reason === "io client disconnect" ? "disconnected" : "reconnecting");
      console.log("[Socket.IO] Disconnected. Reason:", reason);
    });

    socketInstance.on("connect_error", (error) => {
      console.warn("[Socket.IO] Connection notice:", error.message);
      setConnectionState("reconnecting");
    });

    // Custom Toast Helper for Real-time Events
    const showRealtimeToast = (event: RealtimeEventPayload) => {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white dark:bg-[#0F274D] shadow-2xl rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex items-start gap-3 text-right`}
            dir="rtl"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center font-bold shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white truncate">{event.title}</h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{event.message}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {new Date(event.timestamp || Date.now()).toLocaleTimeString("ar-EG")}
              </span>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    };

    // 1. Student Enrolled Listener
    socketInstance.on("student.enrolled", (payload: RealtimeEventPayload) => {
      showRealtimeToast(payload);
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-students"] });
    });

    // 2. Payment Completed Listener
    socketInstance.on("payment.completed", (payload: RealtimeEventPayload) => {
      showRealtimeToast(payload);
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-earnings"] });
    });

    // 3. Assignment Submitted Listener
    socketInstance.on("assignment.submitted", (payload: RealtimeEventPayload) => {
      showRealtimeToast(payload);
      queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] });
    });

    // 4. Quiz Submitted Listener
    socketInstance.on("quiz.submitted", (payload: RealtimeEventPayload) => {
      showRealtimeToast(payload);
      queryClient.invalidateQueries({ queryKey: ["teacher-quizzes"] });
    });

    // 5. Review Created Listener
    socketInstance.on("review.created", (payload: RealtimeEventPayload) => {
      showRealtimeToast(payload);
      queryClient.invalidateQueries({ queryKey: ["teacher-reviews"] });
    });

    // 6. Withdrawal Status Updated Listener
    socketInstance.on("withdrawal.updated", (payload: RealtimeEventPayload) => {
      showRealtimeToast(payload);
      queryClient.invalidateQueries({ queryKey: ["teacher-earnings"] });
    });

    // 7. General Notification Listener
    socketInstance.on("notification", (payload: any) => {
      showRealtimeToast(payload.title ? payload : { title: "إشعار جديد", message: payload.message || "وصلك إشعار جديد", timestamp: new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    // 8. Presence Tracking
    socketInstance.on("online-users-list", (userIds: string[]) => {
      if (Array.isArray(userIds)) {
        setOnlineUserIds(Array.from(new Set(userIds)));
      }
    });

    socketInstance.on("user-online", (userId: string) => {
      setOnlineUserIds((prev) => Array.from(new Set([...prev, userId])));
    });

    socketInstance.on("user-offline", (userId: string) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== userId));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, userRole, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionState, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;

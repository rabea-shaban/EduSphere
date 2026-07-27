"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io as ioClient, Socket } from "socket.io-client";
import { useAuthContext } from "./auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUserIds: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUserIds: [],
});

export const useSocketContext = () => useContext(SocketContext);

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
  : "http://localhost:5000";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketInstance = ioClient(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("[Socket.IO] Connected successfully with ID:", socketInstance.id);

      // Join user's private room
      if (user._id) {
        socketInstance.emit("join", user._id);
      }
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("[Socket.IO] Disconnected from server");
    });

    // Real-Time Notification Listener
    socketInstance.on("notification", (notification: any) => {
      console.log("[Socket.IO] Real-time notification received:", notification);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white dark:bg-[#0F274D] shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 text-right border border-slate-200 dark:border-white/10`}
            dir="rtl"
          >
            <div className="flex-1 w-0">
              <p className="text-xs font-black text-[#0B2D5B] dark:text-white">
                {notification.title || "إشعار جديد 🔔"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                {notification.message}
              </p>
            </div>
          </div>
        ),
        { duration: 4000 }
      );
    });

    // Real-Time Payment Event Listeners
    socketInstance.on("payment:approved", () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("تم تأكيد العملية المالية واكتمال اشتراكك بنجاح! 💳");
    });

    // Real-Time Teacher Application Listeners
    socketInstance.on("teacher:approved", () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-applications"] });
      toast.success("مبروك! تم اعتماد حسابك كمعلم في EduSphere 🎉");
    });

    // User Presence Listeners
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
  }, [user, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;

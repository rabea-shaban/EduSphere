"use client";

import React, { useEffect, useRef } from "react";
import { useTeacherRealtime } from "../hooks/useTeacherRealtime";
import { toast } from "react-hot-toast";

export const StudentV2Bridge: React.FC = () => {
  const { socket, isConnected } = useTeacherRealtime();
  const socketRef = useRef(socket);
  useEffect(() => { socketRef.current = socket; }, [socket]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log("[TEACHER_CALL_V2][STUDENT_SOCKET]", {
      socketId: socket.id,
      connected: socket.connected,
      transport: socket.io.engine.transport.name,
    });

    socket.on("teacher:call:invite", (data: any) => {
      console.log("[TEACHER_CALL_V2][STUDENT_INCOMING]", {
        callId: data.callId,
        from: data.callerName,
        targetUserId: data.to,
        socketId: socket.id,
        connected: socket.connected,
        transport: socket.io.engine.transport.name,
      });
      toast(`📞 مكالمة واردة من المعلم: ${data.callerName}`, { duration: 6000 });
    });

    return () => {
      socket.off("teacher:call:invite");
    };
  }, [socket, isConnected]);

  return null;
};

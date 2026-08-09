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

    socket.on("teacher:call:invite", (data: any) => {
      console.log(`[STUDENT_V2_BRIDGE][INVITE_RECEIVE] callId: ${data.callId}`);
      toast(`📞 مكالمة واردة من المعلم: ${data.callerName}`, { duration: 6000 });
    });

    return () => {
      socket.off("teacher:call:invite");
    };
  }, [socket, isConnected]);

  return null;
};

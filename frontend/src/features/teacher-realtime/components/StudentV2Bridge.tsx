"use client";

import React, { useEffect, useRef } from "react";
import { useTeacherRealtime } from "../hooks/useTeacherRealtime";
import { toast } from "react-hot-toast";

export const StudentV2Bridge: React.FC = () => {
  const { socket, isConnected } = useTeacherRealtime();
  const socketRef = useRef(socket);
  useEffect(() => { socketRef.current = socket; }, [socket]);

  const processedMessageIdsRef = useRef<Set<string>>(new Set());

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

    const handleIncomingChatMessage = (msg: any) => {
      const msgId = msg._id || msg.clientMessageId;
      if (msgId && processedMessageIdsRef.current.has(msgId)) {
        return;
      }
      if (msgId) {
        processedMessageIdsRef.current.add(msgId);
      }

      console.log("[TEACHER_CHAT_V2][STUDENT_RECEIVE]", {
        clientMessageId: msg.clientMessageId,
        messageId: msg._id,
        conversationId: msg.conversationId,
        senderId: typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId,
        timestamp: Date.now(),
        socketId: socket.id,
      });

      // Dispatch window custom event so active ChatLayout updates instantly
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("teacher:chat:message", { detail: msg }));
      }
    };

    socket.on("teacher:chat:message", handleIncomingChatMessage);

    return () => {
      socket.off("teacher:call:invite");
      socket.off("teacher:chat:message", handleIncomingChatMessage);
    };
  }, [socket, isConnected]);

  return null;
};

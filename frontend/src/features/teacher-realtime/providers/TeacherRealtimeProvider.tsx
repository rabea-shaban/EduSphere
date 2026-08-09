"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useTeacherRealtime } from "../hooks/useTeacherRealtime";
import { useAuthContext } from "@/providers/auth-provider";
import { TeacherCallSessionState, IncomingTeacherCallPayload, TeacherChatMessage } from "../types/teacher-realtime.types";
import { canTransition } from "../state/teacher-call-machine";
import { toast } from "react-hot-toast";

interface TeacherRealtimeContextType {
  socket: any;
  isConnected: boolean;
  activeCall: TeacherCallSessionState | null;
  incomingCall: IncomingTeacherCallPayload | null;
  startCall: (targetUserId: string, targetName: string, targetAvatar?: string, targetRole?: string, conversationId?: string) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
}

const TeacherRealtimeContext = createContext<TeacherRealtimeContextType>({
  socket: null,
  isConnected: false,
  activeCall: null,
  incomingCall: null,
  startCall: async () => {},
  acceptCall: async () => {},
  rejectCall: () => {},
  endCall: () => {},
});

export const useTeacherRealtimeContext = () => useContext(TeacherRealtimeContext);

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const TeacherRealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, isConnected } = useTeacherRealtime();
  const { user } = useAuthContext();

  const [activeCall, setActiveCall] = useState<TeacherCallSessionState | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingTeacherCallPayload | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const activeCallRef = useRef(activeCall);
  const incomingCallRef = useRef(incomingCall);
  const socketRef = useRef(socket);

  useEffect(() => { activeCallRef.current = activeCall; }, [activeCall]);
  useEffect(() => { incomingCallRef.current = incomingCall; }, [incomingCall]);
  useEffect(() => { socketRef.current = socket; }, [socket]);

  // Clean WebRTC tracks and PeerConnection without EVER calling socket.disconnect()
  const cleanupCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setActiveCall(null);
    setIncomingCall(null);
  }, []);

  // WebRTC Signal Handlers
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("teacher:call:invite", (data: IncomingTeacherCallPayload) => {
      console.log(`[TEACHER_CALL][INVITE] callId: ${data.callId}, from: ${data.callerName}`);
      if (activeCallRef.current || incomingCallRef.current) {
        socketRef.current?.emit("teacher:call:busy", { to: data.from, callId: data.callId });
        return;
      }
      setIncomingCall(data);
    });

    socket.on("teacher:call:accept", async (data: { callId: string; from: string }) => {
      console.log(`[TEACHER_CALL][ACCEPT] callId: ${data.callId}`);
      if (!activeCallRef.current || activeCallRef.current.callId !== data.callId) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;

        const pc = new RTCPeerConnection(RTC_CONFIG);
        peerConnectionRef.current = pc;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit("teacher:call:ice", {
              callId: data.callId,
              to: data.from,
              candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate,
            });
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socketRef.current?.emit("teacher:call:offer", {
          callId: data.callId,
          to: data.from,
          offer: { type: offer.type, sdp: offer.sdp },
        });

        setActiveCall((prev) => (prev ? { ...prev, status: "CONNECTING" } : null));
      } catch (err) {
        console.error("[TEACHER_CALL][OFFER_ERROR]", err);
        cleanupCall();
      }
    });

    socket.on("teacher:call:offer", async (data: { callId: string; from: string; offer: any }) => {
      console.log(`[TEACHER_CALL][OFFER_RECEIVE] callId: ${data.callId}`);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;

        const pc = new RTCPeerConnection(RTC_CONFIG);
        peerConnectionRef.current = pc;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit("teacher:call:ice", {
              callId: data.callId,
              to: data.from,
              candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate,
            });
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketRef.current?.emit("teacher:call:answer", {
          callId: data.callId,
          to: data.from,
          answer: { type: answer.type, sdp: answer.sdp },
        });

        setActiveCall((prev) => (prev ? { ...prev, status: "CONNECTED" } : null));
      } catch (err) {
        console.error("[TEACHER_CALL][ANSWER_ERROR]", err);
        cleanupCall();
      }
    });

    socket.on("teacher:call:answer", async (data: { callId: string; from: string; answer: any }) => {
      console.log(`[TEACHER_CALL][ANSWER_RECEIVE] callId: ${data.callId}`);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setActiveCall((prev) => (prev ? { ...prev, status: "CONNECTED" } : null));
      }
    });

    socket.on("teacher:call:ice", async (data: { callId: string; from: string; candidate: any }) => {
      if (peerConnectionRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {}
      }
    });

    socket.on("teacher:call:reject", () => {
      toast.error("تم رفض المكالمة");
      cleanupCall();
    });

    socket.on("teacher:call:busy", () => {
      toast.error("المستخدم مشغول بمكالمة أخرى");
      cleanupCall();
    });

    socket.on("teacher:call:end", () => {
      toast.success("انتهت المكالمة");
      cleanupCall();
    });

    return () => {
      socket.off("teacher:call:invite");
      socket.off("teacher:call:accept");
      socket.off("teacher:call:offer");
      socket.off("teacher:call:answer");
      socket.off("teacher:call:ice");
      socket.off("teacher:call:reject");
      socket.off("teacher:call:busy");
      socket.off("teacher:call:end");
    };
  }, [socket, isConnected, cleanupCall]);

  const startCall = async (
    targetUserId: string,
    targetName: string,
    targetAvatar?: string,
    targetRole?: string,
    conversationId?: string
  ) => {
    if (!socket || !user) return;

    socket.emit("teacher:call:invite", { to: targetUserId, conversationId });
    setActiveCall({
      callId: `pending_${Date.now()}`,
      partnerId: targetUserId,
      partnerName: targetName,
      partnerAvatar: targetAvatar,
      partnerRole: targetRole,
      conversationId,
      role: "caller",
      status: "RINGING",
    });
  };

  const acceptCall = async () => {
    if (!incomingCall || !socket) return;
    socket.emit("teacher:call:accept", { callId: incomingCall.callId, to: incomingCall.from });
    setActiveCall({
      callId: incomingCall.callId,
      partnerId: incomingCall.from,
      partnerName: incomingCall.callerName,
      partnerAvatar: incomingCall.callerAvatar,
      partnerRole: incomingCall.callerRole,
      conversationId: incomingCall.conversationId,
      role: "receiver",
      status: "CONNECTING",
    });
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (incomingCall && socket) {
      socket.emit("teacher:call:reject", { callId: incomingCall.callId, to: incomingCall.from });
    }
    cleanupCall();
  };

  const endCall = () => {
    if (activeCall && socket) {
      socket.emit("teacher:call:end", { callId: activeCall.callId, to: activeCall.partnerId });
    }
    cleanupCall();
  };

  return (
    <TeacherRealtimeContext.Provider
      value={{
        socket,
        isConnected,
        activeCall,
        incomingCall,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </TeacherRealtimeContext.Provider>
  );
};

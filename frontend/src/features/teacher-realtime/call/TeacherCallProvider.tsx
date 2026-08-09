"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuthContext } from "@/providers/auth-provider";
import { getTeacherCallSocket } from "./teacher-call.socket";
import { teacherCallService } from "./teacher-call.service";
import { logger } from "./teacher-call.logger";
import { TeacherCallSessionState, IncomingTeacherCallPayload } from "../types/teacher-realtime.types";
import { TeacherCallOverlay } from "../components/TeacherCallOverlay";
import { toast } from "react-hot-toast";

interface TeacherCallContextV2Type {
  activeCall: TeacherCallSessionState | null;
  incomingCall: IncomingTeacherCallPayload | null;
  startCallV2: (targetUserId: string, targetName: string, targetAvatar?: string, targetRole?: string, conversationId?: string) => Promise<void>;
  acceptCallV2: () => Promise<void>;
  rejectCallV2: () => void;
  endCallV2: () => void;
}

const TeacherCallContextV2 = createContext<TeacherCallContextV2Type>({
  activeCall: null,
  incomingCall: null,
  startCallV2: async () => {},
  acceptCallV2: async () => {},
  rejectCallV2: () => {},
  endCallV2: () => {},
});

export const useTeacherCallV2 = () => useContext(TeacherCallContextV2);

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const TeacherCallProviderV2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const userId = user?._id;

  const [activeCall, setActiveCall] = useState<TeacherCallSessionState | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingTeacherCallPayload | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<any>(null);
  const activeCallRef = useRef(activeCall);
  const incomingCallRef = useRef(incomingCall);

  useEffect(() => { activeCallRef.current = activeCall; }, [activeCall]);
  useEffect(() => { incomingCallRef.current = incomingCall; }, [incomingCall]);

  useEffect(() => {
    if (!userId) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("auth_token") || "" : "";
    const socket = getTeacherCallSocket(token);
    socketRef.current = socket;

    socket.on("teacher:call:invite", (data: IncomingTeacherCallPayload) => {
      logger.log("TEACHER_CALL_V2][INVITE_RECEIVE", {
        callId: data.callId,
        caller: data.callerName,
        socketId: socket.id,
        connected: socket.connected,
      });

      if (activeCallRef.current || incomingCallRef.current) {
        socket.emit("teacher:call:busy", { to: data.from, callId: data.callId });
        return;
      }
      setIncomingCall(data);
    });

    socket.on("teacher:call:accept", async (data: { callId: string; from: string }) => {
      logger.log("TEACHER_CALL_V2][ACCEPT_RECEIVE", {
        callId: data.callId,
        from: data.from,
        socketId: socket.id,
        connected: socket.connected,
      });

      if (!activeCallRef.current || activeCallRef.current.callId !== data.callId) return;

      try {
        logger.log("TEACHER_CALL_V2][GET_USER_MEDIA", { callId: data.callId });
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;

        logger.log("TEACHER_CALL_V2][PEER_CREATE", { callId: data.callId });
        const pc = new RTCPeerConnection(RTC_CONFIG);
        peerConnectionRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            logger.log("TEACHER_CALL_V2][ICE_SEND", { callId: data.callId, candidate: event.candidate.candidate });
            socketRef.current?.emit("teacher:call:ice", {
              callId: data.callId,
              to: data.from,
              candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate,
            });
          }
        };

        logger.log("TEACHER_CALL_V2][OFFER_CREATE", { callId: data.callId });
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        logger.log("TEACHER_CALL_V2][OFFER_SET_LOCAL", { callId: data.callId });

        socketRef.current?.emit("teacher:call:offer", {
          callId: data.callId,
          to: data.from,
          offer: { type: offer.type, sdp: offer.sdp },
        });

        setActiveCall((prev) => (prev ? { ...prev, status: "CONNECTING" } : null));
      } catch (err: any) {
        logger.error("TEACHER_CALL_V2][OFFER_FAILED", { message: err.message });
        cleanupCall();
      }
    });

    socket.on("teacher:call:offer", async (data: { callId: string; from: string; offer: any }) => {
      logger.log("TEACHER_CALL_V2][OFFER_RECEIVE", { callId: data.callId, from: data.from });
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
      } catch (err: any) {
        logger.error("TEACHER_CALL_V2][ANSWER_FAILED", { message: err.message });
        cleanupCall();
      }
    });

    socket.on("teacher:call:answer", async (data: { callId: string; from: string; answer: any }) => {
      logger.log("TEACHER_CALL_V2][ANSWER_RECEIVE", { callId: data.callId });
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setActiveCall((prev) => (prev ? { ...prev, status: "CONNECTED" } : null));
        logger.log("TEACHER_CALL_V2][CONNECTED", { callId: data.callId });
      }
    });

    socket.on("teacher:call:ice", async (data: { callId: string; from: string; candidate: any }) => {
      if (peerConnectionRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          logger.log("TEACHER_CALL_V2][ICE_RECEIVE", { callId: data.callId });
        } catch (e) {}
      }
    });

    socket.on("teacher:call:reject", (data: { callId: string }) => {
      logger.warn("TEACHER_CALL_V2][REJECT", { callId: data.callId });
      toast.error("تم رفض المكالمة");
      cleanupCall();
    });

    socket.on("teacher:call:busy", (data: { callId: string }) => {
      logger.warn("TEACHER_CALL_V2][BUSY", { callId: data.callId });
      toast.error("المستخدم مشغول بمكالمة أخرى");
      cleanupCall();
    });

    socket.on("teacher:call:end", (data: { callId: string }) => {
      logger.log("TEACHER_CALL_V2][END", { callId: data.callId });
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
  }, [userId]);

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

  const startCallV2 = async (
    targetUserId: string,
    targetName: string,
    targetAvatar?: string,
    targetRole?: string,
    conversationId?: string
  ) => {
    logger.log("TEACHER_CALL_V2][CLICK", { targetUserId, targetName });

    if (activeCallRef.current && ["RINGING", "OUTGOING", "CONNECTING", "CONNECTED"].includes(activeCallRef.current.status)) {
      logger.warn("TEACHER_CALL_V2][CLICK_IGNORED_ACTIVE_CALL", { activeStatus: activeCallRef.current.status });
      toast.error("هناك مكالمة قيد التشغيل بالفعل");
      return;
    }

    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      logger.error("TEACHER_CALL_V2][SOCKET_NOT_READY", {
        connected: socket?.connected,
        socketId: socket?.id,
      });
      toast.error("غير متصل بالخادم الخاص بمكالمات المعلم");
      return;
    }

    logger.log("TEACHER_CALL_V2][SOCKET_STATE", {
      socketId: socket.id,
      connected: socket.connected,
      transport: socket.io.engine.transport.name,
    });

    try {
      logger.log("TEACHER_CALL_V2][SESSION_START", { targetUserId });
      const session = await teacherCallService.createSession(targetUserId);
      const callId = session.callId;

      logger.log("TEACHER_CALL_V2][INVITE_SEND", { callId, targetUserId });
      socket.emit("teacher:call:invite", { to: targetUserId, conversationId, callId });

      setActiveCall({
        callId,
        partnerId: targetUserId,
        partnerName: targetName,
        partnerAvatar: targetAvatar,
        partnerRole: targetRole,
        conversationId,
        role: "caller",
        status: "RINGING",
      });
    } catch (err: any) {
      logger.error("TEACHER_CALL_V2][SESSION_FAILED", { message: err.message });
      toast.error("فشل بدء الجلسة للمكالمة");
    }
  };

  const acceptCallV2 = async () => {
    if (!incomingCall || !socketRef.current) return;
    socketRef.current.emit("teacher:call:accept", { callId: incomingCall.callId, to: incomingCall.from });
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

  const rejectCallV2 = () => {
    if (incomingCall && socketRef.current) {
      socketRef.current.emit("teacher:call:reject", { callId: incomingCall.callId, to: incomingCall.from });
    }
    cleanupCall();
  };

  const endCallV2 = () => {
    if (activeCall && socketRef.current) {
      socketRef.current.emit("teacher:call:end", { callId: activeCall.callId, to: activeCall.partnerId });
    }
    cleanupCall();
  };

  return (
    <TeacherCallContextV2.Provider
      value={{
        activeCall,
        incomingCall,
        startCallV2,
        acceptCallV2,
        rejectCallV2,
        endCallV2,
      }}
    >
      {children}
      <TeacherCallOverlay />
    </TeacherCallContextV2.Provider>
  );
};

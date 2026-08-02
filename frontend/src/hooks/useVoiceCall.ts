"use client";

import * as React from "react";
import { toast } from "react-hot-toast";
import { useSocketContext } from "@/providers/socket-provider";
import { ringtoneManager } from "@/utils/ringtone";
import { chatService } from "@/services/chat.service";
import api from "@/services/api";

export type CallState = "idle" | "outgoing" | "incoming" | "connected" | "ended";
export type CallType = "voice" | "video";

export interface CallUserInfo {
  userId: string;
  name: string;
  avatar?: string;
  conversationId?: string;
  callType?: CallType;
  callId?: string;
}

export function useVoiceCall() {
  const { socket } = useSocketContext();
  const [callState, setCallState] = React.useState<CallState>("idle");
  const [callType, setCallType] = React.useState<CallType>("voice");
  const [targetUser, setTargetUser] = React.useState<CallUserInfo | null>(null);
  const [activeCallId, setActiveCallId] = React.useState<string | null>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);
  const [callSeconds, setCallSeconds] = React.useState(0);

  const peerRef = React.useRef<RTCPeerConnection | null>(null);
  const localStreamRef = React.useRef<MediaStream | null>(null);
  const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const localVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const pendingOfferRef = React.useRef<any>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Helper to log missed or completed call system message in chat
  const logCallMessage = React.useCallback(
    async (convId?: string, isVideo?: boolean, durationSec: number = 0) => {
      if (!convId) return;
      try {
        let msgText = "";
        if (durationSec <= 0) {
          msgText = isVideo ? "📹 مكالمة فيديو فائتة" : "📞 مكالمة صوتية فائتة";
        } else {
          const m = Math.floor(durationSec / 60);
          const s = durationSec % 60;
          const durStr = m > 0 ? `${m} دقيقة و ${s} ثانية` : `${s} ثانية`;
          msgText = isVideo ? `📹 مكالمة فيديو منتهية (${durStr})` : `📞 مكالمة صوتية منتهية (${durStr})`;
        }
        await chatService.sendMessage(convId, msgText, "System");
      } catch (e) {
        console.error("Failed to log call message:", e);
      }
    },
    []
  );

  // 1.5s DB Call Signaling & Heartbeat Poll (guarantees calls ring across Vercel serverless instances)
  React.useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await api.get("/conversations/call/poll");
        const signal = res.data?.data;
        if (!signal) return;

        if (signal._id) setActiveCallId(signal._id);

        // Incoming call received via DB signal
        if (signal.status === "outgoing" && callState === "idle") {
          const type = signal.callType || "voice";
          setCallType(type);
          pendingOfferRef.current = signal.offer;
          setTargetUser({
            userId: signal.callerId,
            name: signal.callerName || "مستخدم المنصة",
            avatar: signal.callerAvatar,
            conversationId: signal.conversationId,
            callType: type,
            callId: signal._id,
          });
          setCallState("incoming");
        }

        // Outgoing call answered via DB signal
        if (signal.status === "connected" && callState === "outgoing" && signal.answer) {
          if (peerRef.current) {
            try {
              await peerRef.current.setRemoteDescription(new RTCSessionDescription(signal.answer));
              setCallState("connected");
              startTimer();
            } catch (e) {}
          }
        }

        // Call rejected via DB signal
        if (signal.status === "rejected" && callState !== "idle") {
          toast.error("تم رفض المكالمة من الطرف الآخر");
          setCallState("ended");
          if (targetUser?.conversationId) {
            logCallMessage(targetUser.conversationId, callType === "video", 0);
          }
          setTimeout(() => {
            cleanup();
            setCallState("idle");
            setTargetUser(null);
          }, 1200);
        }

        // Call ended via DB signal
        if (signal.status === "ended" && callState !== "idle") {
          toast("انتهت المكالمة", { icon: "📞" });
          setCallState("ended");
          if (targetUser?.conversationId) {
            logCallMessage(targetUser.conversationId, callType === "video", callSeconds);
          }
          setTimeout(() => {
            cleanup();
            setCallState("idle");
            setTargetUser(null);
          }, 1200);
        }
      } catch (e) {}
    }, 1500);

    return () => clearInterval(pollInterval);
  }, [callState, targetUser, callType, callSeconds, logCallMessage]);

  // Play ringtone on incoming call & ringback sound on outgoing call
  React.useEffect(() => {
    if (callState === "incoming") {
      ringtoneManager.startIncomingRingtone();
    } else if (callState === "outgoing") {
      ringtoneManager.startOutgoingRingback();
    } else {
      ringtoneManager.stop();
    }
    return () => {
      ringtoneManager.stop();
    };
  }, [callState]);

  // Audio element for remote stream fallback
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio();
      audio.autoplay = true;
      remoteAudioRef.current = audio;
    }
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = React.useCallback(() => {
    ringtoneManager.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setCallSeconds(0);
    setIsMuted(false);
    setIsVideoOff(false);
    pendingOfferRef.current = null;
    setActiveCallId(null);
  }, []);

  // Listen to Socket call signaling
  React.useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: {
      from: string;
      offer: any;
      conversationId: string;
      callerName: string;
      callerAvatar?: string;
      callType?: CallType;
    }) => {
      if (callState !== "idle") {
        socket.emit("reject-call", { to: data.from });
        return;
      }

      const type = data.callType || "voice";
      setCallType(type);
      pendingOfferRef.current = data.offer;
      setTargetUser({
        userId: data.from,
        name: data.callerName,
        avatar: data.callerAvatar,
        conversationId: data.conversationId,
        callType: type,
      });
      setCallState("incoming");
    };

    const handleCallAnswered = async (data: { from: string; answer: any }) => {
      if (peerRef.current && data.answer) {
        try {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          setCallState("connected");
          startTimer();
        } catch (e) {
          console.error("Failed to set remote answer:", e);
        }
      }
    };

    const handleIceCandidate = async (data: { from: string; candidate: any }) => {
      if (peerRef.current && data.candidate) {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Failed to add ICE candidate:", e);
        }
      }
    };

    const handleCallRejected = () => {
      toast.error("تم رفض المكالمة من الطرف الآخر");
      setCallState("ended");
      if (targetUser?.conversationId) {
        logCallMessage(targetUser.conversationId, callType === "video", 0);
      }
      setTimeout(() => {
        cleanup();
        setCallState("idle");
        setTargetUser(null);
      }, 1500);
    };

    const handleCallEnded = () => {
      toast("انتهت المكالمة", { icon: "📞" });
      setCallState("ended");
      if (targetUser?.conversationId) {
        logCallMessage(targetUser.conversationId, callType === "video", callSeconds);
      }
      setTimeout(() => {
        cleanup();
        setCallState("idle");
        setTargetUser(null);
      }, 1500);
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-answered", handleCallAnswered);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-ended", handleCallEnded);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-answered", handleCallAnswered);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-ended", handleCallEnded);
    };
  }, [callState, cleanup, socket]);

  const startTimer = () => {
    setCallSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
  };

  const createPeer = React.useCallback(
    (targetUserId: string) => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice-candidate", {
            to: targetUserId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        if (event.streams[0]) {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      peerRef.current = pc;
      return pc;
    },
    [socket]
  );

  // Bind video element refs when connected
  React.useEffect(() => {
    if (callState === "connected" && localStreamRef.current) {
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [callState]);

  // Initiate an outgoing call (voice or video)
  const startCall = React.useCallback(
    async (
      targetUserId: string,
      targetName: string,
      targetAvatar?: string | undefined,
      conversationId?: string | undefined,
      callerName?: string | undefined,
      type: CallType = "voice"
    ) => {
      try {
        const wantsVideo = type === "video";
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: wantsVideo ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
          });
        } catch (e) {
          // Fallback to audio if video camera is unavailable
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        localStreamRef.current = stream;
        setCallType(type);
        setTargetUser({ userId: targetUserId, name: targetName, avatar: targetAvatar, conversationId, callType: type });
        setCallState("outgoing");

        const pc = createPeer(targetUserId);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Initiate signal via REST API for Vercel persistence
        try {
          const res = await api.post("/conversations/call/initiate", {
            targetUserId,
            conversationId,
            offer,
            callerName: callerName || "مستخدم المنصة",
            callerAvatar: targetAvatar,
            callType: type,
          });
          if (res.data?.data?._id) {
            setActiveCallId(res.data.data._id);
          }
        } catch (e) {}

        if (socket) {
          socket.emit("call-user", {
            to: targetUserId,
            offer,
            conversationId,
            callerName: callerName || "مستخدم المنصة",
            callerAvatar: targetAvatar,
            callType: type,
          });
        }
      } catch (err: any) {
        toast.error("لا يمكن الوصول للميكروفون أو الكاميرا لبدء المكالمة");
        cleanup();
        setCallState("idle");
      }
    },
    [createPeer, cleanup, socket]
  );

  // Accept an incoming call
  const acceptCall = React.useCallback(async () => {
    if (!targetUser || !pendingOfferRef.current) return;

    try {
      const wantsVideo = callType === "video";
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: wantsVideo ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        });
      } catch (e) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      localStreamRef.current = stream;

      const pc = createPeer(targetUser.userId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(pendingOfferRef.current));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Respond via REST API
      const cid = targetUser.callId || activeCallId;
      if (cid) {
        api.post("/conversations/call/respond", { callId: cid, action: "accept", answer }).catch(() => {});
      }

      if (socket) {
        socket.emit("answer-call", {
          to: targetUser.userId,
          answer,
        });
      }

      setCallState("connected");
      startTimer();
    } catch (err: any) {
      toast.error("فشل قبول المكالمة");
      cleanup();
      setCallState("idle");
    }
  }, [targetUser, callType, createPeer, cleanup, socket, activeCallId]);

  // Reject call
  const rejectCall = React.useCallback(() => {
    const cid = targetUser?.callId || activeCallId;
    if (cid) {
      api.post("/conversations/call/respond", { callId: cid, action: "reject" }).catch(() => {});
    }

    if (targetUser && socket) {
      socket.emit("reject-call", { to: targetUser.userId });
    }
    if (targetUser?.conversationId) {
      logCallMessage(targetUser.conversationId, callType === "video", 0);
    }

    cleanup();
    setCallState("idle");
    setTargetUser(null);
  }, [targetUser, cleanup, socket, logCallMessage, callType, activeCallId]);

  // End call
  const endCall = React.useCallback(() => {
    const cid = targetUser?.callId || activeCallId;
    if (cid) {
      api.post("/conversations/call/respond", { callId: cid, action: "end" }).catch(() => {});
    }

    if (targetUser && socket) {
      socket.emit("end-call", { to: targetUser.userId });
    }
    if (targetUser?.conversationId) {
      logCallMessage(targetUser.conversationId, callType === "video", callSeconds);
    }

    setCallState("ended");
    setTimeout(() => {
      cleanup();
      setCallState("idle");
      setTargetUser(null);
    }, 500);
  }, [targetUser, cleanup, socket, logCallMessage, callType, callSeconds, activeCallId]);

  // Toggle Mute Audio
  const toggleMute = React.useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // Toggle Camera Video
  const toggleVideo = React.useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, []);

  return {
    callState,
    callType,
    targetUser,
    callSeconds,
    isMuted,
    isVideoOff,
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
}

export default useVoiceCall;

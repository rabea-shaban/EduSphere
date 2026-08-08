"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useSocketContext } from "./socket-provider";
import { useAuthContext } from "./auth-provider";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldAlert, GraduationCap, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";

interface IncomingCallPayload {
  callId: string;
  from: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  callerRole?: string;
  conversationId?: string;
  offer?: any;
}

interface ActiveCallPayload {
  callId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerRole?: string;
  conversationId?: string;
  role: "caller" | "receiver";
  status: "calling" | "connected" | "ended";
}

interface CallContextType {
  incomingCall: IncomingCallPayload | null;
  activeCall: ActiveCallPayload | null;
  isMuted: boolean;
  isSpeakerMuted: boolean;
  callDuration: number;
  audioBlocked: boolean;
  startCall: (targetUserId: string, targetName: string, targetAvatar?: string, targetRole?: string, conversationId?: string) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  cancelCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeakerMute: () => void;
  unlockAudio: () => void;
}

const CallContext = createContext<CallContextType>({
  incomingCall: null,
  activeCall: null,
  isMuted: false,
  isSpeakerMuted: false,
  callDuration: 0,
  audioBlocked: false,
  startCall: async () => {},
  acceptCall: async () => {},
  rejectCall: () => {},
  cancelCall: () => {},
  endCall: () => {},
  toggleMute: () => {},
  toggleSpeakerMute: () => {},
  unlockAudio: () => {},
});

export const useCallContext = () => useContext(CallContext);

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, isConnected } = useSocketContext();
  const { user } = useAuthContext();

  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCallPayload | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [audioBlocked, setAudioBlocked] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Native WebAudio Synthesizer for 100% reliable CORS-free Ringtone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      remoteAudioRef.current = remoteAudio;
    }
  }, []);

  const stopRingtone = useCallback(() => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      try {
        audioCtxRef.current.suspend();
      } catch (e) {}
    }
    setAudioBlocked(false);
  }, []);

  const playRingtone = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume().then(() => setAudioBlocked(false)).catch(() => setAudioBlocked(true));
      }

      const triggerTone = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== "running") return;
        try {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = "sine";
          osc2.type = "sine";
          osc1.frequency.value = 440;
          osc2.frequency.value = 480;

          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(ctx.currentTime);
          osc2.start(ctx.currentTime);
          osc1.stop(ctx.currentTime + 1.8);
          osc2.stop(ctx.currentTime + 1.8);
        } catch (e) {}
      };

      triggerTone();
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = setInterval(triggerTone, 3000);
      setAudioBlocked(false);
    } catch (err) {
      console.warn("[CallProvider] Ringtone synthesis notice:", err);
      setAudioBlocked(true);
    }
  }, []);

  const unlockAudio = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().then(() => {
        setAudioBlocked(false);
        playRingtone();
      }).catch(() => {});
    }
  }, [playRingtone]);

  // Cleanup WebRTC & Streams
  const cleanupCall = useCallback(() => {
    stopRingtone();
    setAudioBlocked(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    setIncomingCall(null);
    setActiveCall(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeakerMuted(false);
  }, [stopRingtone]);

  // Duration Timer
  useEffect(() => {
    if (activeCall?.status === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCall?.status]);

  const processedCallIdsRef = useRef<Set<string>>(new Set());

  // Register Global Socket Call Listeners
  useEffect(() => {
    if (!socket || !isConnected || !user) return;

    const handleIncomingInvite = (data: IncomingCallPayload) => {
      if (processedCallIdsRef.current.has(data.callId)) {
        return;
      }
      processedCallIdsRef.current.add(data.callId);
      setTimeout(() => processedCallIdsRef.current.delete(data.callId), 30000);
      if (activeCall || incomingCall) {
        socket.emit("call:busy", { to: data.from });
        return;
      }

      setIncomingCall(data);
      playRingtone();

      // Browser Notification if granted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("📞 مكالمة صوتية واردة", {
          body: `لديك مكالمة صوتية من ${data.callerName}`,
          icon: data.callerAvatar || "/logo.png",
          tag: data.callId,
        });
      }

      // 30s Ringing Timeout
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = setTimeout(() => {
        socket.emit("call:timeout", { to: data.from });
        toast.error("مكالمة فائتة لم يتم الرد عليها");
        cleanupCall();
      }, 30000);
    };

    const handleCallAccept = async (data: { from: string; answer?: any }) => {
      stopRingtone();
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);

      setActiveCall((prev) => (prev ? { ...prev, status: "connected" } : null));

      if (data.answer && peerConnectionRef.current) {
        try {
          if (peerConnectionRef.current.signalingState === "have-local-offer") {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
        } catch (err) {
          console.error("Set remote description error:", err);
        }
      }
    };

    const handleCallReject = () => {
      toast.error("تم رفض المكالمة من الطرف الآخر");
      cleanupCall();
    };

    const handleCallCancel = () => {
      toast("تم إلغاء المكالمة الواردة", { icon: "ℹ️" });
      cleanupCall();
    };

    const handleCallBusy = () => {
      toast.error("المستخدم مشغول بمكالمة أخرى حالياً");
      cleanupCall();
    };

    const handleCallTimeout = () => {
      toast.error("لم يتم الرد على المكالمة");
      cleanupCall();
    };

    const handleCallEnd = () => {
      toast("انتهت المكالمة", { icon: "📞" });
      cleanupCall();
    };

    const handleIceCandidate = async (data: { from: string; candidate: any }) => {
      if (data.candidate && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error("Add ICE candidate error:", err);
        }
      }
    };

    socket.on("call:invite", handleIncomingInvite);
    socket.on("call:accept", handleCallAccept);
    socket.on("call:reject", handleCallReject);
    socket.on("call:cancel", handleCallCancel);
    socket.on("call:busy", handleCallBusy);
    socket.on("call:timeout", handleCallTimeout);
    socket.on("call:end", handleCallEnd);
    socket.on("call:ice-candidate", handleIceCandidate);

    return () => {
      socket.off("call:invite", handleIncomingInvite);
      socket.off("call:accept", handleCallAccept);
      socket.off("call:reject", handleCallReject);
      socket.off("call:cancel", handleCallCancel);
      socket.off("call:busy", handleCallBusy);
      socket.off("call:timeout", handleCallTimeout);
      socket.off("call:end", handleCallEnd);
      socket.off("call:ice-candidate", handleIceCandidate);
    };
  }, [socket, isConnected, user, activeCall, incomingCall, playRingtone, stopRingtone, cleanupCall]);

  // Start Outgoing Call
  const startCall = async (
    targetUserId: string,
    targetName: string,
    targetAvatar?: string,
    targetRole?: string,
    conversationId?: string
  ) => {
    if (!socket || !user) {
      toast.error("غير متصل بالخادم");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidatePayload = typeof event.candidate.toJSON === "function" ? event.candidate.toJSON() : event.candidate;
          socket.emit("call:ice-candidate", { to: targetUserId, candidate: candidatePayload });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      setActiveCall({
        callId,
        partnerId: targetUserId,
        partnerName: targetName,
        partnerAvatar: targetAvatar,
        partnerRole: targetRole,
        conversationId,
        role: "caller",
        status: "calling",
      });

      socket.emit("call:invite", {
        callId,
        to: targetUserId,
        callerName: `${user.firstName} ${user.lastName}`,
        callerAvatar: user.avatar,
        callerRole: user.role,
        conversationId,
        offer: { type: offer.type, sdp: offer.sdp },
      });

      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = setTimeout(() => {
        socket.emit("call:timeout", { to: targetUserId });
        toast.error("لم يتم الرد على المكالمة");
        cleanupCall();
      }, 30000);
    } catch (err) {
      console.error("Failed to start call:", err);
      toast.error("يرجى السماح بالحصول على صلاحية الميكروفون للاتصال");
      cleanupCall();
    }
  };

  // Accept Incoming Call
  const acceptCall = async () => {
    if (!incomingCall || !socket) return;
    stopRingtone();
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidatePayload = typeof event.candidate.toJSON === "function" ? event.candidate.toJSON() : event.candidate;
          socket.emit("call:ice-candidate", { to: incomingCall.from, candidate: candidatePayload });
        }
      };

      if (incomingCall.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      setActiveCall({
        callId: incomingCall.callId,
        partnerId: incomingCall.from,
        partnerName: incomingCall.callerName,
        partnerAvatar: incomingCall.callerAvatar,
        partnerRole: incomingCall.callerRole,
        conversationId: incomingCall.conversationId,
        role: "receiver",
        status: "connected",
      });

      socket.emit("call:accept", {
        to: incomingCall.from,
        callId: incomingCall.callId,
        answer: { type: answer.type, sdp: answer.sdp },
      });
      setIncomingCall(null);
    } catch (err) {
      console.error("Failed to accept call:", err);
      toast.error("تعذر فتح صوت الميكروفون");
      rejectCall();
    }
  };

  const rejectCall = () => {
    if (incomingCall && socket) {
      socket.emit("call:reject", { to: incomingCall.from, callId: incomingCall.callId });
    }
    cleanupCall();
  };

  const cancelCall = () => {
    if (activeCall && socket) {
      socket.emit("call:cancel", { to: activeCall.partnerId, callId: activeCall.callId });
    }
    cleanupCall();
  };

  const endCall = () => {
    if (activeCall && socket) {
      socket.emit("call:end", { to: activeCall.partnerId, callId: activeCall.callId });
    }
    cleanupCall();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleSpeakerMute = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !isSpeakerMuted;
      setIsSpeakerMuted(!isSpeakerMuted);
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const getRoleBadge = (r?: string) => {
    if (!r) return null;
    switch (r) {
      case "TEACHER":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <GraduationCap className="w-3 h-3" /> معلم
          </span>
        );
      case "ADMIN":
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <ShieldCheck className="w-3 h-3" /> إدارة
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <UserCheck className="w-3 h-3" /> طالب
          </span>
        );
    }
  };

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        activeCall,
        isMuted,
        isSpeakerMuted,
        callDuration,
        audioBlocked,
        startCall,
        acceptCall,
        rejectCall,
        cancelCall,
        endCall,
        toggleMute,
        toggleSpeakerMute,
        unlockAudio,
      }}
    >
      {children}

      {/* Global Incoming Call Modal Banner (App-Wide, Any Page) */}
      {incomingCall && (
        <div className="fixed inset-x-4 top-6 z-50 max-w-md mx-auto bg-white dark:bg-[#0F172A] border-2 border-[#1769D3] rounded-3xl shadow-2xl p-5 animate-in slide-in-from-top-6 duration-250 select-none" dir="rtl">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-md">
                {incomingCall.callerAvatar ? (
                  <img src={incomingCall.callerAvatar} alt={incomingCall.callerName} className="w-full h-full object-cover" />
                ) : (
                  incomingCall.callerName[0] || "U"
                )}
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{incomingCall.callerName}</h3>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                {getRoleBadge(incomingCall.callerRole)}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">مكالمة صوتية واردة...</span>
              </div>
            </div>

            {audioBlocked && (
              <button
                onClick={unlockAudio}
                className="w-full py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-semibold animate-pulse"
              >
                🔔 انقر هنا لتفعيل صوت التنبيه
              </button>
            )}

            {/* Action Buttons: Accept / Reject */}
            <div className="grid grid-cols-2 gap-3 w-full pt-1">
              <button
                onClick={acceptCall}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>قبول</span>
              </button>

              <button
                onClick={rejectCall}
                className="flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <PhoneOff className="w-4 h-4 fill-current" />
                <span>رفض</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Active Call Floating Panel (App-Wide, Surfacing Across All Routes) */}
      {activeCall && (
        <div className="fixed bottom-6 start-6 z-50 w-72 sm:w-80 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#243047] rounded-3xl shadow-2xl p-4 select-none animate-in slide-in-from-bottom-6 duration-200" dir="rtl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0 shadow-xs">
                {activeCall.partnerAvatar ? (
                  <img src={activeCall.partnerAvatar} alt={activeCall.partnerName} className="w-full h-full object-cover" />
                ) : (
                  activeCall.partnerName[0] || "U"
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{activeCall.partnerName}</span>
                <span className="text-[11px] font-mono text-[#1769D3] dark:text-blue-400 font-semibold">
                  {activeCall.status === "calling" ? "جاري الاتصال..." : formatDuration(callDuration)}
                </span>
              </div>
            </div>

            {/* Mute, Speaker, and End Call Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-xl border transition-all ${
                  isMuted
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                    : "bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200"
                }`}
                title={isMuted ? "إلغاء كتم الميكروفون" : "كتم الميكروفون"}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={endCall}
                className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs transition-all active:scale-95"
                title="إنهاء المكالمة"
              >
                <PhoneOff className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}
    </CallContext.Provider>
  );
};

export default CallProvider;

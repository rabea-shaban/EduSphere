"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2 } from "lucide-react";
import { CallState, CallType, CallUserInfo } from "@/hooks/useVoiceCall";

export interface VoiceCallModalProps {
  callState: CallState;
  callType?: CallType;
  targetUser: CallUserInfo | null;
  callSeconds: number;
  isMuted: boolean;
  isVideoOff?: boolean;
  localVideoRef?: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef?: React.RefObject<HTMLVideoElement | null>;
  onAccept: () => void;
  onReject: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
  onToggleVideo?: () => void;
}

function formatCallTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function VoiceCallModal({
  callState,
  callType = "voice",
  targetUser,
  callSeconds,
  isMuted,
  isVideoOff = false,
  localVideoRef,
  remoteVideoRef,
  onAccept,
  onReject,
  onEnd,
  onToggleMute,
  onToggleVideo,
}: VoiceCallModalProps) {
  if (callState === "idle" || !targetUser) return null;

  const isVideoCall = callType === "video";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full ${
            isVideoCall && callState === "connected" ? "max-w-2xl h-[520px]" : "max-w-sm"
          } rounded-3xl bg-[#123D7A] text-white border border-white/15 shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300`}
        >
          {/* VIDEO CONNECTED VIEW */}
          {isVideoCall && callState === "connected" ? (
            <div className="relative w-full h-full bg-slate-900 flex flex-col justify-between p-4 overflow-hidden">
              {/* Remote Video Stream */}
              <video
                ref={remoteVideoRef as any}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Top Bar with Recipient Info & Timer */}
              <div className="relative z-10 flex items-center justify-between bg-black/40 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 bg-[#1E5DB8] flex items-center justify-center font-bold">
                    {targetUser.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={targetUser.avatar} alt={targetUser.name} className="w-full h-full object-cover" />
                    ) : (
                      targetUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-black text-white">{targetUser.name}</h4>
                    <span className="text-[11px] font-bold text-emerald-400">مكالمة فيديو جارية</span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold bg-black/50 px-3 py-1 rounded-full border border-white/20 text-white">
                  {formatCallTime(callSeconds)}
                </span>
              </div>

              {/* Local Camera PIP Preview */}
              <div className="absolute bottom-20 left-4 z-20 w-28 h-40 rounded-2xl overflow-hidden border-2 border-white/80 shadow-2xl bg-black">
                <video
                  ref={localVideoRef as any}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isVideoOff ? "hidden" : "block"}`}
                />
                {isVideoOff && (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                    <VideoOff className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="relative z-20 flex items-center justify-center gap-4 bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10 mx-auto">
                <button
                  onClick={onToggleMute}
                  className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  title={isMuted ? "إلغاء الكتم" : "كتم الصوت"}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                {onToggleVideo && (
                  <button
                    onClick={onToggleVideo}
                    className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                      isVideoOff ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                    title={isVideoOff ? "تشغيل الكاميرا" : "إيقاف الكاميرا"}
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </button>
                )}

                <button
                  onClick={onEnd}
                  className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  title="إنهاء المكالمة"
                >
                  <PhoneOff className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD VOICE / RINGING VIEW */
            <div className="p-6 text-center space-y-6">
              {/* Top Gradient Bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1E5DB8] via-[#F7941D] to-[#1E5DB8]" />

              {/* Avatar with Animated Pulse Rings */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                {(callState === "outgoing" || callState === "incoming") && (
                  <>
                    <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#1E5DB8]" />
                    <span className="absolute inset-[-12px] rounded-full border-2 border-[#1E5DB8]/30 animate-pulse" />
                  </>
                )}
                {callState === "connected" && (
                  <span className="absolute inset-[-6px] rounded-full border-2 border-[#22C55E]/40 animate-pulse" />
                )}

                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#123D7A] shadow-lg bg-gradient-to-tr from-[#123D7A] to-[#1E5DB8] text-white flex items-center justify-center font-black text-2xl">
                  {targetUser.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={targetUser.avatar} alt={targetUser.name} className="w-full h-full object-cover" />
                  ) : (
                    targetUser.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* Call Info */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">{targetUser.name}</h3>

                <p className="text-xs font-semibold text-slate-300">
                  {callState === "incoming" && (isVideoCall ? "📹 مكالمة فيديو واردة..." : "📞 مكالمة صوتية واردة...")}
                  {callState === "outgoing" && (isVideoCall ? "📹 جارٍ الاتصال مرئي..." : "🔔 جارٍ الاتصال...")}
                  {callState === "connected" && (
                    <span className="text-[#22C55E] font-bold flex items-center justify-center gap-1.5">
                      <Volume2 className="h-4 w-4 animate-bounce" />
                      مكالمة جارية • {formatCallTime(callSeconds)}
                    </span>
                  )}
                  {callState === "ended" && "انتهت المكالمة"}
                </p>
              </div>

              {/* Waveform for voice call */}
              {callState === "connected" && !isVideoCall && (
                <div className="flex items-center justify-center gap-1 h-6">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-[#F7941D]"
                      style={{
                        height: `${30 + Math.sin(Date.now() / 150 + i) * 35}%`,
                        animation: `waveBar ${0.4 + i * 0.08}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Controls Buttons */}
              <div className="flex items-center justify-center gap-6 pt-2">
                {callState === "incoming" && (
                  <>
                    <button
                      onClick={onReject}
                      className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                      title="رفض"
                    >
                      <PhoneOff className="h-6 w-6" />
                    </button>

                    <button
                      onClick={onAccept}
                      className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 animate-bounce"
                      title="رد"
                    >
                      {isVideoCall ? <Video className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
                    </button>
                  </>
                )}

                {callState === "outgoing" && (
                  <button
                    onClick={onEnd}
                    className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                    title="إنهاء المكالمة"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </button>
                )}

                {callState === "connected" && (
                  <>
                    <button
                      onClick={onToggleMute}
                      className={`h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                        isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                      title={isMuted ? "إلغاء الكتم" : "كتم الصوت"}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>

                    <button
                      onClick={onEnd}
                      className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                      title="إنهاء المكالمة"
                    >
                      <PhoneOff className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default VoiceCallModal;

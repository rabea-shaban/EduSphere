"use client";

import React, { useState, useEffect } from "react";
import { useTeacherCallV2 } from "../call/TeacherCallProvider";
import { Phone, PhoneOff, Mic, MicOff, User } from "lucide-react";
import Image from "next/image";

export const TeacherCallOverlay: React.FC = () => {
  const { activeCall, incomingCall, acceptCallV2, rejectCallV2, endCallV2 } = useTeacherCallV2();

  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (activeCall?.status === "CONNECTED") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall?.status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!activeCall && !incomingCall) return null;

  // 1. Incoming Call Modal (Exact matching image 2)
  if (incomingCall) {
    const callerRoleBadge = incomingCall.callerRole === "STUDENT" || !incomingCall.callerRole ? "طالب" : "معلم";

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
        <div className="w-full max-w-lg bg-white dark:bg-[#0B172A] border-2 border-blue-500 rounded-[32px] p-6 shadow-2xl text-center flex flex-col items-center relative overflow-hidden">
          {/* Circular Avatar with subtle shadow */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 dark:border-white/10 shadow-md mb-3 relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            {incomingCall.callerAvatar ? (
              <Image
                src={incomingCall.callerAvatar}
                alt={incomingCall.callerName}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-slate-400" />
            )}
          </div>

          {/* Caller Name */}
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1.5">{incomingCall.callerName}</h3>

          {/* Role badge & Call status inline */}
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-700/50">
              <User className="w-3.5 h-3.5" />
              {callerRoleBadge}
            </span>
            <span>مكالمة صوتية واردة...</span>
          </div>

          {/* Action Buttons: Red Reject (Right in RTL / Left visually) & Green Accept */}
          <div className="grid grid-cols-2 gap-4 w-full px-2">
            <button
              onClick={rejectCallV2}
              className="py-4 px-6 rounded-[22px] bg-[#FF0040] hover:bg-rose-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
            >
              <PhoneOff className="w-5 h-5 fill-current" />
              <span>رفض</span>
            </button>

            <button
              onClick={acceptCallV2}
              className="py-4 px-6 rounded-[22px] bg-[#00A86B] hover:bg-emerald-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>قبول</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Call Floating Pill Banner (Exact matching image 1)
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] animate-bounce-in" dir="rtl">
      <div className="bg-white dark:bg-[#0B172A] border border-slate-200 dark:border-white/10 rounded-[32px] px-5 py-3 shadow-2xl flex items-center gap-4">
        {/* End Call Button (Red square/rounded) */}
        <button
          onClick={endCallV2}
          className="w-12 h-12 rounded-2xl bg-[#FF0040] hover:bg-rose-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
          title="إنهاء المكالمة"
        >
          <PhoneOff className="w-5 h-5 fill-current" />
        </button>

        {/* Mic Toggle Button (Light grey rounded) */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isMuted
              ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200"
          }`}
          title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* User Info & Timer */}
        <div className="flex flex-col text-right ml-2 min-w-[120px]">
          <span className="text-sm font-black text-slate-800 dark:text-white leading-tight">
            {activeCall?.partnerName}
          </span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 dir-ltr text-right">
            {activeCall?.status === "CONNECTED"
              ? formatDuration(callDuration)
              : activeCall?.status === "RINGING"
              ? "جاري الاتصال..."
              : "جاري الربط..."}
          </span>
        </div>

        {/* Avatar Circle */}
        <div className="w-11 h-11 rounded-full overflow-hidden relative border border-slate-200 dark:border-white/10 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {activeCall?.partnerAvatar ? (
            <Image
              src={activeCall.partnerAvatar}
              alt={activeCall.partnerName || "Partner"}
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
};

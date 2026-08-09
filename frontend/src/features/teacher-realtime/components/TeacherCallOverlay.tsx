"use client";

import React from "react";
import { useTeacherCallV2 } from "../call/TeacherCallProvider";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldAlert } from "lucide-react";

export const TeacherCallOverlay: React.FC = () => {
  const { activeCall, incomingCall, acceptCallV2, rejectCallV2, endCallV2 } = useTeacherCallV2();

  if (!activeCall && !incomingCall) return null;

  if (incomingCall) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
        <div className="w-full max-w-md bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center mb-4 animate-pulse">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {incomingCall.callerName?.substring(0, 2) || "📞"}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white">{incomingCall.callerName}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">مكالمة صوتية واردة...</p>

          <div className="flex items-center justify-center gap-6 mt-8 w-full">
            <button
              onClick={rejectCallV2}
              className="flex-1 py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
            >
              <PhoneOff className="w-5 h-5" />
              <span>رفض</span>
            </button>
            <button
              onClick={acceptCallV2}
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 animate-bounce"
            >
              <Phone className="w-5 h-5" />
              <span>رد</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
      <div className="w-full max-w-md bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-4 relative">
          {activeCall?.status === "CONNECTED" && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          )}
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {activeCall?.partnerName?.substring(0, 2) || "📞"}
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-800 dark:text-white">{activeCall?.partnerName}</h3>
        <p className="text-xs text-emerald-500 font-bold mt-1">
          {activeCall?.status === "RINGING" && "جاري الاتصال..."}
          {activeCall?.status === "CONNECTING" && "جاري الربط الصوتي..."}
          {activeCall?.status === "CONNECTED" && "متصل الآن 🟢"}
        </p>

        <div className="flex items-center justify-center gap-6 mt-8 w-full">
          <button
            onClick={endCallV2}
            className="w-full py-3.5 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
          >
            <PhoneOff className="w-5 h-5" />
            <span>إنهاء المكالمة</span>
          </button>
        </div>
      </div>
    </div>
  );
};

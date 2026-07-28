import * as React from "react";
import { Monitor, Smartphone, Globe, LogOut, Loader2, ShieldCheck, MapPin } from "lucide-react";
import type { ActiveSession } from "@/features/teacher/types/settings";

interface SessionsListCardProps {
  sessions?: ActiveSession[];
  onRevokeSession: (sessionId: string) => void;
  onLogoutAllDevices: () => void;
  isRevoking?: boolean;
  isLoggingOutAll?: boolean;
  isLoadingSessions?: boolean;
}

export function SessionsListCard({
  sessions = [],
  onRevokeSession,
  onLogoutAllDevices,
  isRevoking,
  isLoggingOutAll,
  isLoadingSessions,
}: SessionsListCardProps) {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[#F58220]" />
            الجلسات والأجهزة النشطة (Active Sessions & Devices)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة الأجهزة المتصلة بحسابك وتسجيل الخروج من الجلسات غير المصرح بها
          </p>
        </div>

        <button
          type="button"
          onClick={onLogoutAllDevices}
          disabled={isLoggingOutAll || sessions.length <= 1}
          className="h-10 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoggingOutAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          تسجيل الخروج من كافة الأجهزة الأخرى
        </button>
      </div>

      {isLoadingSessions ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-white/5 rounded-2xl text-xs text-slate-500">
          لا توجد جلسات نشطة مسجلة حالياً
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-[#0B2D5B] dark:text-[#1E73D8]">
                  {session.deviceName.toLowerCase().includes("mobile") ||
                  session.deviceName.toLowerCase().includes("phone") ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Monitor className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{session.deviceName}</h4>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        الجهاز الحالي
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {session.ipAddress}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {session.location}
                    </span>
                    <span>
                      آخر نشاط: {new Date(session.lastActive).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  type="button"
                  onClick={() => onRevokeSession(session.id)}
                  disabled={isRevoking}
                  className="px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-rose-500 hover:text-white dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  إنهاء الجلسة
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default SessionsListCard;

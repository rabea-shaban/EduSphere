import * as React from "react";
import { Radio, WifiOff, RefreshCw } from "lucide-react";
import { useSocketContext } from "@/providers/socket-provider";

export function SocketStatusBadge() {
  const { isConnected, socket, connectionState } = useSocketContext();

  const isSocketConnected = isConnected || Boolean(socket?.connected);

  if (isSocketConnected) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold" dir="rtl">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>مباشر (Live Sync)</span>
      </div>
    );
  }

  if (connectionState === "connecting" || connectionState === "reconnecting") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold" dir="rtl">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>جاري إعادة الاتصال...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 text-xs font-bold" dir="rtl">
      <WifiOff className="w-3.5 h-3.5" />
      <span>غير متصل</span>
    </div>
  );
}
export default SocketStatusBadge;

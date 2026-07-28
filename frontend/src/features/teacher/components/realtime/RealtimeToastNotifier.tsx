import * as React from "react";
import { Bell, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RealtimeEventPayload } from "@/features/teacher/types/realtime";

interface RealtimeToastNotifierProps {
  event: RealtimeEventPayload;
  onClose?: () => void;
  actionUrl?: string;
}

export function RealtimeToastNotifier({ event, onClose, actionUrl }: RealtimeToastNotifierProps) {
  const router = useRouter();

  return (
    <div
      className="max-w-md w-full bg-white dark:bg-[#0F274D] shadow-2xl rounded-3xl p-4 border border-slate-200 dark:border-white/10 flex items-start justify-between gap-3 text-right"
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center font-bold shrink-0">
          <Bell className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{event.title}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">{event.message}</p>
          {actionUrl && (
            <button
              onClick={() => {
                if (onClose) onClose();
                router.push(actionUrl);
              }}
              className="text-[11px] font-bold text-[#F58220] hover:underline flex items-center gap-1 mt-2"
            >
              عرض التفاصيل والعمليات <ArrowLeft className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {onClose && (
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
export default RealtimeToastNotifier;

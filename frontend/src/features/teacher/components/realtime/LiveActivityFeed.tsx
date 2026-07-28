import * as React from "react";
import { Activity, Radio, UserCheck, DollarSign, FileCheck, Star } from "lucide-react";
import { useLiveEventListener } from "@/hooks/useRealtimeSync";
import type { RealtimeEventPayload } from "@/features/teacher/types/realtime";

export function LiveActivityFeed() {
  const [events, setEvents] = React.useState<RealtimeEventPayload[]>([]);

  useLiveEventListener("student.enrolled", (payload) => {
    setEvents((prev) => [payload, ...prev.slice(0, 9)]);
  });

  useLiveEventListener("payment.completed", (payload) => {
    setEvents((prev) => [payload, ...prev.slice(0, 9)]);
  });

  useLiveEventListener("assignment.submitted", (payload) => {
    setEvents((prev) => [payload, ...prev.slice(0, 9)]);
  });

  useLiveEventListener("review.created", (payload) => {
    setEvents((prev) => [payload, ...prev.slice(0, 9)]);
  });

  const getEventIcon = (type: string) => {
    if (type.includes("enrolled")) return <UserCheck className="w-4 h-4 text-emerald-500" />;
    if (type.includes("payment")) return <DollarSign className="w-4 h-4 text-amber-500" />;
    if (type.includes("assignment")) return <FileCheck className="w-4 h-4 text-blue-500" />;
    if (type.includes("review")) return <Star className="w-4 h-4 text-yellow-500" />;
    return <Activity className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 text-right" dir="rtl">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#F58220]" />
          البث اللحظي للأنشطة والأحداث (Live Activity Stream)
        </h3>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          تحديث مباشر
        </div>
      </div>

      {events.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          بانتظار الأحداث اللحظية... ستظهر هنا فور تسجيل طالب أو شراء كورس أو تسليم واجب.
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((evt, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-xl bg-white dark:bg-[#071C3B]">
                  {getEventIcon(evt.type)}
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{evt.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{evt.message}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {new Date(evt.timestamp).toLocaleTimeString("ar-EG")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default LiveActivityFeed;

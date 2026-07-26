"use client";

import * as React from "react";
import { Send, Bell, Sparkles } from "lucide-react";

import { toast } from "react-hot-toast";

export default function AdminBroadcastNotificationsPage() {
  const [targetGroup, setTargetGroup] = React.useState("all");
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSending(false);
    toast.success("تم إرسال الإشعار الشامل للمستهدفين بنجاح! 🚀");
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          نظام الإشعارات والتنبيهات العامة 📣
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          إرسال تنبيهات Push Notifications وإيميلات جماعية لكافة الطلاب أو المعلمين
        </p>
      </div>

      <form onSubmit={handleSend} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 max-w-xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">فئة المستهدفين بالإشعار</label>
          <select
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="all">جميع مستخدمي المنصة (18,450 مستخدم)</option>
            <option value="students">الطلاب فقط (17,800 طالب)</option>
            <option value="teachers">المعلمون والمحاضرون فقط (650 معلم)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">عنوان الإشعار</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: خصم 20% على جميع كورسات مسار علوم الحاسب 🎉"
            required
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">نص التنبيه الرسالة</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="اكتب نص التنبيه الإرشادي أو الترويجي..."
            required
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <Send className="h-4 w-4" />
          <span>{isSending ? "جاري الإرسال..." : "إرسال التنبيه الجماعي فوراً"}</span>
        </button>
      </form>
    </div>
  );
}

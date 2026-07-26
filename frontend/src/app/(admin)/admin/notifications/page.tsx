"use client";

import * as React from "react";
import { Send, Bell, Sparkles, History, Eye, RotateCw, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

const notificationTemplates = [
  { title: "🎉 خصم خاص 25% على كورسات علوم الحاسب", target: "students", message: "استفد من خصم لفترة محدودة على جميع كورسات الذكاء الاصطناعي والبرمجة بلغة C++!" },
  { title: "📝 تنبيه باقتراب موعد الاختبار الشامل", target: "students", message: "تذكير لكافة طلاب الثانوية العامة والبكالوريا: يبدأ الاختبار التجريبي غداً الساعة 6 مساءً." },
  { title: "📢 اجتماع هام للمحاضرين والمعلمين", target: "teachers", message: "يسر إدارة المنصة دعوتكم لاجتماع مراجعة المناهج وتحديث أسئلة البكالوريا يوم الخميس." },
  { title: "⚙️ صيانة دورية مجدولة للمنصة", target: "all", message: "سيتم إجراء صيانة سريعة لقواعد البيانات يوم الجمعة القادم من 3:00 ص إلى 4:00 ص." },
];

interface SentNotification {
  id: string;
  title: string;
  targetGroup: string;
  sentAt: string;
  recipientsCount: number;
}

export default function AdminBroadcastNotificationsPage() {
  const [targetGroup, setTargetGroup] = React.useState("all");
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const [history, setHistory] = React.useState<SentNotification[]>([
    { id: "1", title: "مرحباً بكم في الفصل الدراسي الجديد 🎓", targetGroup: "جميع المستخدمين", sentAt: "منذ ساعتين", recipientsCount: 18450 },
    { id: "2", title: "تنبيه رفع الواجب الأول لمسار C++ 💻", targetGroup: "طلاب علوم الحاسب", sentAt: "أمس في 4:30 م", recipientsCount: 4200 },
    { id: "3", title: "تحديث معايير تقييم البكالوريا الدولية 📜", targetGroup: "المعلمون والمحاضرون", sentAt: "منذ 3 أيام", recipientsCount: 650 },
  ]);

  const handleApplyTemplate = (tpl: typeof notificationTemplates[0]) => {
    setTitle(tpl.title);
    setMessage(tpl.message);
    setTargetGroup(tpl.target);
    toast.success("تم تحميل قالب الإشعار الجاهز بنجاح! 📋");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("يرجى إدخال عنوان الإشعار ونص الرسالة أولاً!");
      return;
    }

    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSending(false);

    const newNotif: SentNotification = {
      id: Date.now().toString(),
      title: title,
      targetGroup: targetGroup === "all" ? "جميع المستخدمين" : targetGroup === "students" ? "الطلاب فقط" : "المعلمون فقط",
      sentAt: "الآن",
      recipientsCount: targetGroup === "all" ? 18450 : targetGroup === "students" ? 17800 : 650,
    };

    setHistory([newNotif, ...history]);
    toast.success("تم إرسال الإشعار الشامل للمستهدفين بنجاح! 🚀");
    setTitle("");
    setMessage("");
  };

  const handleResend = (notifTitle: string) => {
    toast.success(`تم إعادة إرسال الإشعار "${notifTitle}" بنجاح! 🔄`);
  };

  const handlePreview = (notif: SentNotification) => {
    toast(`معاينة الإشعار: "${notif.title}" — المستهدفين: ${notif.targetGroup} 🔔`);
  };

  const handleDelete = (id: string) => {
    setHistory(history.filter((h) => h.id !== id));
    toast.error("تم حذف الإشعار من السجل التاريخي.");
  };

  return (
    <div className="space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          نظام الإشعارات والتنبيهات العامة 📣
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          إرسال تنبيهات Push Notifications ورسائل جماعية لكافة الطلاب أو المعلمين بمؤثرات توست فورية
        </p>
      </div>

      {/* Quick Templates Selector */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#F58220]" />
          <span>قوالب إشعارات جاهزة للاستخدام السريع:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {notificationTemplates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 hover:border-[#F58220] transition-all text-right shadow-sm group hover:-translate-y-0.5"
            >
              <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white group-hover:text-[#F58220] transition-colors truncate">
                {tpl.title}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{tpl.message}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleSend} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5 max-w-2xl">
        <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#F58220]" />
          <span>إنشاء تنبيه جماعي جديد</span>
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">فئة المستهدفين بالإشعار</label>
          <select
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none cursor-pointer focus:border-[#F58220]"
          >
            <option value="all">🌐 جميع مستخدمي المنصة (18,450 مستخدم)</option>
            <option value="students">🎓 الطلاب فقط (17,800 طالب)</option>
            <option value="teachers">👨‍🏫 المعلمون والمحاضرون فقط (650 معلم)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">عنوان الإشعار</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: خصم 25% على جميع كورسات مسار علوم الحاسب 🎉"
            required
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">نص التنبيه أو الرسالة</label>
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
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/20 hover:shadow-xl transition-all"
        >
          <Send className="h-4 w-4" />
          <span>{isSending ? "جاري الإرسال..." : "إرسال التنبيه الجماعي فوراً"}</span>
        </button>
      </form>

      {/* Broadcast History */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <History className="h-5 w-5 text-[#0B2D5B] dark:text-[#F58220]" />
            <span>سجل الإشعارات المرسلة سابقاً ({history.length})</span>
          </h3>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">{item.title}</div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  الفئة: <span className="text-[#F58220]">{item.targetGroup}</span> ({item.recipientsCount.toLocaleString("en-US")} مستلم) • {item.sentAt}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handlePreview(item)}
                  className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#F58220] text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>معاينة</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResend(item.title)}
                  className="h-9 px-3 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#F58220] transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>إعادة إرسال</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="h-9 px-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

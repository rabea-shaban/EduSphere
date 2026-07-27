"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Send,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Users,
  Megaphone,
  Radio,
  FileSpreadsheet,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminNotificationService, { AdminNotificationItem } from "@/services/adminNotification.service";
import { Button } from "@/components/ui/button";

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [typeFilter, setTypeFilter] = React.useState<string>("All");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("All");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  // Broadcast Modal State
  const [broadcastModalOpen, setBroadcastModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [targetAudience, setTargetAudience] = React.useState<"ALL" | "STUDENTS" | "TEACHERS" | "ADMINS">("ALL");
  const [notificationType, setNotificationType] = React.useState("Announcement");
  const [priority, setPriority] = React.useState<"Low" | "Medium" | "High">("High");

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Notifications
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "notifications-list", page, limit, typeFilter, priorityFilter, debouncedSearch],
    queryFn: () =>
      adminNotificationService.getNotifications({
        page,
        limit,
        type: typeFilter !== "All" ? typeFilter : undefined,
        priority: priorityFilter !== "All" ? priorityFilter : undefined,
        search: debouncedSearch.trim() || undefined,
      }),
  });

  const notifications = data?.notifications || [];
  const summary = data?.summary || {
    totalNotifications: 0,
    sentCount: 0,
    unreadCount: 0,
    readCount: 0,
    readRate: "0%",
  };
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Broadcast Mutation
  const sendBroadcastMutation = useMutation({
    mutationFn: (payload: any) => adminNotificationService.sendBroadcastNotification(payload),
    onSuccess: (res: any) => {
      toast.success(`تم بث الإشعار بنجاح لـ ${res.recipientsCount} مستخدم 🎉`);
      setBroadcastModalOpen(false);
      setTitle("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء بث الإشعار.");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminNotificationService.deleteNotification(id),
    onSuccess: () => {
      toast.success("تم حذف الإشعار بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الحذف.");
    },
  });

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-black">
            <Bell className="h-4 w-4" />
            <span>نظام الإشعارات والبث اللحظي والتنبيهات</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            مركز البث والإشعارات العامة 📢
          </h1>
          <p className="text-xs text-slate-500">
            إرسال إشعارات جماعية، استهداف الطلاب والمعلمين، وتتبع نسب القراءة والوصول.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setBroadcastModalOpen(true)}
            className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-bold gap-2"
          >
            <Send className="h-4 w-4 text-[#F58220]" />
            <span>بث إشعار عام جديد</span>
          </Button>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 dark:border-white/10"
            title="تحديث البيانات"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Metrics Cards (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي الإشعارات</span>
            <Bell className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {summary.totalNotifications}
          </div>
          <span className="text-[11px] text-indigo-500 font-bold block">إشعارات مرسلة وموثقة</span>
        </div>

        {/* Card 2: Sent */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إشعارات مبثوثة</span>
            <Radio className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {summary.sentCount}
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block">وصول لحظي للمستخدمين</span>
        </div>

        {/* Card 3: Unread */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>في انتظار القراءة</span>
            <Users className="h-4 w-4 text-[#F58220]" />
          </div>
          <div className="text-2xl font-black text-[#F58220] font-mono">
            {summary.unreadCount}
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">بانتظار الاطلاع والتفاعل</span>
        </div>

        {/* Card 4: Read Rate */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>معدل القراءة والاطلاع</span>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {summary.readRate}
          </div>
          <span className="text-[11px] text-purple-500 font-bold block">نسبة قراءة المستخدمين</span>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0F274D] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بعنوان أو نص الإشعار..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
            />
            <Search className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع أنواع الإشعارات</option>
              <option value="Announcement">إعلان عام 📢</option>
              <option value="System">تحديث نظام ⚙️</option>
              <option value="Course">تحديث كورس 📚</option>
              <option value="Payment">عمليات سداد 💳</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1">
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            >
              <option value="All">جميع مستويات الأهمية</option>
              <option value="High">عالي الأهمية 🔴</option>
              <option value="Medium">متوسط 🟡</option>
              <option value="Low">عادي 🔵</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Notifications Data Table */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3 text-rose-500">
            <AlertCircle className="h-8 w-8 mx-auto" />
            <p className="text-xs font-bold">فشل استرجاع سجل الإشعارات</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bell className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-extrabold text-slate-500">لا توجد إشعارات مطابقة لشروط التصفية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-slate-400 font-bold">
                <tr>
                  <th className="py-4 px-4">عنوان ومضمون الإشعار</th>
                  <th className="py-4 px-3">المستلم</th>
                  <th className="py-4 px-3">النوع والأهمية</th>
                  <th className="py-4 px-3">الحالة والقناة</th>
                  <th className="py-4 px-3">التاريخ</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {notifications.map((n) => (
                  <tr
                    key={n._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Title & Body */}
                    <td className="py-4 px-4 space-y-1">
                      <div className="font-extrabold text-[#0B2D5B] dark:text-white text-sm">
                        {n.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                        {n.message}
                      </div>
                    </td>

                    {/* Recipient */}
                    <td className="py-4 px-3 space-y-0.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {n.recipient?.fullName}
                      </div>
                      <div className="text-[10px] text-purple-600 font-bold">
                        {n.recipient?.role || "مستخدم"}
                      </div>
                    </td>

                    {/* Type & Priority */}
                    <td className="py-4 px-3 space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600">
                        {n.type}
                      </span>
                      <div className="text-[10px] font-bold text-slate-400 block">
                        الأولوية: {n.priority}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3 space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          n.isRead
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {n.isRead ? "تمت القراءة ✓" : "غير مقروء ⏳"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-3 text-slate-400 font-semibold">
                      {new Date(n.createdAt).toLocaleDateString("ar-EG")}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("هل أنت تأكد من حذف هذا الإشعار؟")) {
                            deleteMutation.mutate(n._id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                        title="حذف الإشعار"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
            <div>
              عرض الصفحة {pagination.page} من أصل {pagination.totalPages} (إجمالي {pagination.total} إشعار)
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs"
              >
                <ChevronRight className="h-4 w-4" />
                <span>السابق</span>
              </Button>

              <Button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs"
              >
                <span>التالي</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* BROADCAST NOTIFICATION MODAL */}
      <AnimatePresence>
        {broadcastModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <h3 className="text-base font-black text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-3 flex items-center gap-2">
                <Send className="h-5 w-5 text-[#F58220]" />
                <span>بث إشعار عام للمستخدمين</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الفئة المستهدفة *</label>
                  <select
                    value={targetAudience}
                    onChange={(e: any) => setTargetAudience(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  >
                    <option value="ALL">جميع مستخدمي المنصة 👥</option>
                    <option value="STUDENTS">جميع الطلاب والدارسين 🎓</option>
                    <option value="TEACHERS">جميع المعلمين والمحاضرين 👨‍🏫</option>
                    <option value="ADMINS">مشرفي الإدارة 🛡️</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">عنوان الإشعار *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: انطلاق الدورة الصيفية الجديدة..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">نوع الإشعار</label>
                    <select
                      value={notificationType}
                      onChange={(e) => setNotificationType(e.target.value)}
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                    >
                      <option value="Announcement">إعلان عام</option>
                      <option value="System">تحديث نظام</option>
                      <option value="Course">كورس دراسي</option>
                      <option value="Payment">سداد مالي</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">الأولوية</label>
                    <select
                      value={priority}
                      onChange={(e: any) => setPriority(e.target.value)}
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                    >
                      <option value="High">عالي 🔴</option>
                      <option value="Medium">متوسط 🟡</option>
                      <option value="Low">عادي 🔵</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">مضمون نص الإشعار *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب تفاصيل الإشعار ليتم بثها فوريًا على حسابات المستهدفين..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setBroadcastModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!title.trim() || !message.trim()) {
                      toast.error("يرجى كتابة عنوان ومحتوى الإشعار");
                      return;
                    }
                    sendBroadcastMutation.mutate({
                      title: title.trim(),
                      message: message.trim(),
                      targetAudience,
                      type: notificationType,
                      priority,
                    });
                  }}
                  disabled={sendBroadcastMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>تأكيد البث الفوري</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

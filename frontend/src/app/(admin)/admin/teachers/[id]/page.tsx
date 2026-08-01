"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  GraduationCap,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Users,
  Wallet,
  Star,
  Lock,
  CheckCircle2,
  XCircle,
  KeyRound,
  Send,
  Trash2,
  Eye,
  Edit,
  Award,
  Calendar,
  FileText,
  Video,
  ShieldCheck,
  AlertCircle,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminTeacherService, {
  TeacherProfileDetail,
} from "@/services/adminTeacher.service";
import { Button } from "@/components/ui/button";

export default function AdminTeacherProfilePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const teacherId = params?.id as string;

  const [resetPasswordOpen, setResetPasswordOpen] = React.useState(false);
  const [newPasswordInput, setNewPasswordInput] = React.useState("");
  const [notifyModalOpen, setNotifyModalOpen] = React.useState(false);
  const [notifTitle, setNotifTitle] = React.useState("");
  const [notifMessage, setNotifMessage] = React.useState("");

  // Fetch Teacher Details
  const { data: teacher, isLoading, isError, error, refetch } = useQuery<TeacherProfileDetail>({
    queryKey: ["admin", "teacher-profile", teacherId],
    queryFn: () => adminTeacherService.getTeacherById(teacherId),
    enabled: Boolean(teacherId),
  });

  // Fetch Teacher Courses
  const { data: courses = [] } = useQuery({
    queryKey: ["admin", "teacher-courses", teacherId],
    queryFn: () => adminTeacherService.getTeacherCourses(teacherId),
    enabled: Boolean(teacherId),
  });

  // Suspend Mutation
  const suspendMutation = useMutation({
    mutationFn: () => adminTeacherService.suspendTeacher(teacherId),
    onSuccess: () => {
      toast.success("تم تعليق حساب المعلم بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-profile", teacherId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "teachers-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء التجميد.");
    },
  });

  // Activate Mutation
  const activateMutation = useMutation({
    mutationFn: () => adminTeacherService.activateTeacher(teacherId),
    onSuccess: () => {
      toast.success("تم إعادة تفعيل حساب المعلم بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-profile", teacherId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "teachers-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء التفعيل.");
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (pass: string) => adminTeacherService.resetPassword(teacherId, pass),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور للمعلم بنجاح.");
      setResetPasswordOpen(false);
      setNewPasswordInput("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء التغيير.");
    },
  });

  // Send Notification Mutation
  const sendNotifMutation = useMutation({
    mutationFn: ({ title, message }: { title: string; message: string }) =>
      adminTeacherService.sendNotification(teacherId, title, message),
    onSuccess: () => {
      toast.success("تم إرسال الإشعار بنجاح.");
      setNotifyModalOpen(false);
      setNotifTitle("");
      setNotifMessage("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الإرسال.");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => adminTeacherService.deleteTeacher(teacherId),
    onSuccess: () => {
      toast.success("تم نقل المعلم إلى أرشيف المحذوفات بنجاح");
      router.push("/admin/teachers");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الحذف.");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 text-right" dir="rtl">
        <div className="h-24 w-full bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !teacher) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4" dir="rtl">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">لم يتم العثور على ملف المعلم</h3>
        <p className="text-xs text-slate-500">قد يكون الحساب تم حذفه أو أن المعرف غير صحيح.</p>
        <Link href="/admin/teachers">
          <Button className="bg-[#0B2D5B] text-white rounded-xl text-xs font-bold gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>العودة لقائمة المعلمين</span>
          </Button>
        </Link>
      </div>
    );
  }

  const { statistics, financial, application } = teacher;

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Top Banner & Control Cluster */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/teachers"
            className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
            title="العودة"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>

          {teacher.avatar ? (
            <Image
              src={teacher.avatar}
              alt={teacher.fullName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-[#F58220]"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-[#0B2D5B] text-white font-black text-2xl flex items-center justify-center border-2 border-[#F58220]">
              {teacher.fullName.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
                {teacher.fullName}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black ${
                  teacher.isBlocked
                    ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                }`}
              >
                {teacher.isBlocked ? "حساب مجمد" : "معلم نشط"}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span>{teacher.email}</span>
              {teacher.phone && <span>{teacher.phone}</span>}
              <span>انضم بتاريخ: {new Date(teacher.createdAt).toLocaleDateString("ar-EG")}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {teacher.isBlocked ? (
            <Button
              onClick={() => activateMutation.mutate()}
              disabled={activateMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>إعادة تفعيل الحساب</span>
            </Button>
          ) : (
            <Button
              onClick={() => suspendMutation.mutate()}
              disabled={suspendMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <Lock className="h-4 w-4" />
              <span>تجميد الحساب</span>
            </Button>
          )}

          <Button
            onClick={() => setNotifyModalOpen(true)}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5"
          >
            <Send className="h-4 w-4 text-purple-500" />
            <span>إرسال إشعار</span>
          </Button>

          <Button
            onClick={() => setResetPasswordOpen(true)}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5"
          >
            <KeyRound className="h-4 w-4 text-amber-500" />
            <span>تغيير كلمه السر</span>
          </Button>

          <Button
            onClick={() => {
              if (confirm("هل أنت تأكد من نقل حساب المعلم إلى أرشيف المحذوفات؟")) {
                deleteMutation.mutate();
              }
            }}
            variant="ghost"
            size="icon"
            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
            title="حذف الحساب"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Real Statistics Grid (8 Metrics Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Courses */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>عدد الكورسات</span>
            <BookOpen className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {statistics.coursesCount}
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">منشور ومفعل بالمنصة</span>
        </div>

        {/* Card 2: Active Students */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي الطلاب</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {statistics.studentsCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block">اشتراكات نشطة</span>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي الإيرادات</span>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {statistics.totalRevenue.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block">تحصيل مقبول ماليًا</span>
        </div>

        {/* Card 4: Average Rating */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>متوسط تقييم الطلاب</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {statistics.averageRating} / 5.0
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">تقييم عالي الممتازي</span>
        </div>

      </div>

      {/* Main Grid: Details (8 cols) & Financial / Profile Info (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Created Courses & Academic Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Created Courses List */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                <span>الكورسات والمناهج التي تم إنشاؤها ({courses.length})</span>
              </h3>
            </div>

            {courses.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                <p className="text-xs text-slate-400">لم يقم المعلم بإنشاء أية كورسات حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((c: any) => (
                  <div
                    key={c._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-black text-[#0B2D5B] dark:text-white text-sm block">
                        {c.title}
                      </span>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>السعر: <strong className="text-emerald-600 font-bold">{c.price || 0} ج.م</strong></span>
                        <span>المستوى: {c.level || "الكل"}</span>
                        <span>تاريخ الإنشاء: {new Date(c.createdAt).toLocaleDateString("ar-EG")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          c.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {c.status === "Published" ? "منشور" : "مسودة"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Academic & Application Bio */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <Award className="h-5 w-5 text-purple-500" />
              <span>المؤهلات والسيرة الذاتية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">المادة والتخصص الرئيسي</span>
                <span className="font-black text-[#F58220]">
                  {application?.subject || (teacher as any).subject || "علوم حاسب وتطوير برمجيات"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">المرحلة والدرجة العلمية</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {application?.stage || (teacher as any).stage || "جميع المراحل التعليمية"} (
                  {application?.degree || (teacher as any).degree || "بكالوريوس التربية / العلوم"} -{" "}
                  {application?.university || (teacher as any).university || "علوم حاسب"}
                  )
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-xs font-bold text-slate-400 block">نبذة شخصية والسيرة الذاتية:</span>
              <p className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {application?.bio || (teacher as any).bio || "محاضر ومعلم معتمد لمادة الحاسب الآلي وتطوير الويب والبرمجيات بالمنصة التعليمية EduSphere."}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Financial & Account Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Financial Summary */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <span>المعلومات المالية والتحصيل</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/30 space-y-1">
                <span className="text-emerald-800 dark:text-emerald-300 font-bold block">إجمالي المستحقات</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {financial.totalRevenue.toLocaleString()} ج.م
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">طريقة التحصيل المفضلة</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {financial.preferredPaymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Account Audit */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 text-xs">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <ShieldCheck className="h-5 w-5 text-purple-500" />
              <span>سجل الأمان والتراخيص</span>
            </h3>

            <div className="space-y-2 text-slate-600 dark:text-slate-300 font-semibold">
              <div className="flex justify-between">
                <span>تاريخ التفعيل:</span>
                <span className="font-mono text-slate-400">{new Date(teacher.createdAt).toLocaleDateString("ar-EG")}</span>
              </div>
              <div className="flex justify-between">
                <span>نوع الحساب:</span>
                <span className="font-bold text-[#F58220]">معلم معتمد</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RESET PASSWORD MODAL */}
      <AnimatePresence>
        {resetPasswordOpen && (
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
              <div className="flex items-center gap-3 text-amber-500">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    تغيير كلمة المرور للمعلم
                  </h3>
                  <p className="text-xs text-slate-500">{teacher.fullName}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  كلمة المرور الجديدة *
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-amber-500 dir-ltr text-right"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setResetPasswordOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!newPasswordInput || newPasswordInput.length < 6) {
                      toast.error("كلمة المرور يجب أن لا تقل عن 6 أحرف");
                      return;
                    }
                    resetPasswordMutation.mutate(newPasswordInput);
                  }}
                  disabled={resetPasswordMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تعيين كلمة المرور</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFY MODAL */}
      <AnimatePresence>
        {notifyModalOpen && (
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
              <div className="flex items-center gap-3 text-purple-600">
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    إرسال إشعار مباشر المعلم
                  </h3>
                  <p className="text-xs text-slate-500">{teacher.fullName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    عنوان الإشعار *
                  </label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="تنبيه إداري..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    نص الإشعار *
                  </label>
                  <textarea
                    rows={3}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="يرجى تحديث الجدول وتأكيد خطة المواعيد..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setNotifyModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!notifTitle.trim() || !notifMessage.trim()) {
                      toast.error("يرجى كتابة عنوان ورسالة الإشعار");
                      return;
                    }
                    sendNotifMutation.mutate({
                      title: notifTitle.trim(),
                      message: notifMessage.trim(),
                    });
                  }}
                  disabled={sendNotifMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>إرسال الإشعار</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

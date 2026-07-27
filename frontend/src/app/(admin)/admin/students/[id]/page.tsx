"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lock,
  Send,
  KeyRound,
  Trash2,
  Star,
  Award,
  Clock,
  Zap,
  TrendingUp,
  FileText,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminStudentService, {
  StudentProfileDetail,
} from "@/services/adminStudent.service";
import { Button } from "@/components/ui/button";

export default function AdminStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const studentId = params?.id as string;

  const [resetPasswordOpen, setResetPasswordOpen] = React.useState(false);
  const [newPasswordInput, setNewPasswordInput] = React.useState("");
  const [notifyModalOpen, setNotifyModalOpen] = React.useState(false);
  const [notifTitle, setNotifTitle] = React.useState("");
  const [notifMessage, setNotifMessage] = React.useState("");

  // Fetch Student Details
  const { data: student, isLoading, isError, error, refetch } = useQuery<StudentProfileDetail>({
    queryKey: ["admin", "student-profile", studentId],
    queryFn: () => adminStudentService.getStudentById(studentId),
    enabled: Boolean(studentId),
  });

  // Suspend Mutation
  const suspendMutation = useMutation({
    mutationFn: () => adminStudentService.suspendStudent(studentId),
    onSuccess: () => {
      toast.success("تم تجميد حساب الطالب بنجاح 🔒");
      queryClient.invalidateQueries({ queryKey: ["admin", "student-profile", studentId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "students-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء التجميد.");
    },
  });

  // Activate Mutation
  const activateMutation = useMutation({
    mutationFn: () => adminStudentService.activateStudent(studentId),
    onSuccess: () => {
      toast.success("تم إعادة تفعيل حساب الطالب بنجاح 🟢");
      queryClient.invalidateQueries({ queryKey: ["admin", "student-profile", studentId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "students-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء التفعيل.");
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (pass: string) => adminStudentService.resetPassword(studentId, pass),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور للطالب بنجاح 🔑");
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
      adminStudentService.sendNotification(studentId, title, message),
    onSuccess: () => {
      toast.success("تم إرسال الإشعار بنجاح 🔔");
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
    mutationFn: () => adminStudentService.deleteStudent(studentId),
    onSuccess: () => {
      toast.success("تم نقل حساب الطالب إلى أرشيف المحذوفات بنجاح");
      router.push("/admin/students");
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

  if (isError || !student) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4" dir="rtl">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">لم يتم العثور على ملف الطالب</h3>
        <p className="text-xs text-slate-500">قد يكون الحساب تم حذفه أو أن المعرف غير صحيح.</p>
        <Link href="/admin/students">
          <Button className="bg-[#0B2D5B] text-white rounded-xl text-xs font-bold gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>العودة لقائمة الطلاب</span>
          </Button>
        </Link>
      </div>
    );
  }

  const { statistics, enrollments = [], attempts = [], submissions = [], payments = [], guardian } = student;

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Top Banner & Control Cluster */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/students"
            className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
            title="العودة"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>

          {student.avatar ? (
            <Image
              src={student.avatar}
              alt={student.fullName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-[#0B2D5B]"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-[#0B2D5B] text-white font-black text-2xl flex items-center justify-center border-2 border-[#0B2D5B]">
              {student.fullName.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
                {student.fullName}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black ${
                  student.isBlocked
                    ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                }`}
              >
                {student.isBlocked ? "حساب مجمد 🔒" : "طالب نشط 🟢"}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span>📧 {student.email}</span>
              {student.phone && <span>📞 {student.phone}</span>}
              <span>🎓 {student.grade} ({student.educationalSystem})</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {student.isBlocked ? (
            <Button
              onClick={() => activateMutation.mutate()}
              disabled={activateMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>تفعيل الحساب</span>
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
            <span>تغيير كلمة المرور</span>
          </Button>

          <Button
            onClick={() => {
              if (confirm("هل أنت تأكد من نقل حساب الطالب إلى أرشيف المحذوفات؟")) {
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
        
        {/* Card 1: Enrolled Courses */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>الكورسات المسجلة</span>
            <BookOpen className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {statistics.enrolledCoursesCount}
          </div>
          <span className="text-[11px] text-indigo-500 font-bold block">منها {statistics.completedCoursesCount} مكتمل</span>
        </div>

        {/* Card 2: Quiz Average */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>متوسط الاختبارات</span>
            <Award className="h-4 w-4 text-[#F58220]" />
          </div>
          <div className="text-2xl font-black text-[#F58220] font-mono">
            {statistics.averageQuizScore}%
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">نسبة نجاح {statistics.passRate}</span>
        </div>

        {/* Card 3: Level & XP */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>نقاط التنافس (XP)</span>
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {statistics.xp} XP
          </div>
          <span className="text-[11px] text-amber-500 font-bold block">المستوى الدراسي {statistics.level}</span>
        </div>

        {/* Card 4: Study Hours */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>ساعات الدراسة</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {statistics.studyHours} ساعة
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block">تفاعل ودراسة مستمرة</span>
        </div>

      </div>

      {/* Main Grid: Details (8 cols) & Guardian / Payments (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Enrolled Courses & Exam Attempts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Enrolled Courses */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              <span>الكورسات والمناهج المشترك بها ({enrollments.length})</span>
            </h3>

            {enrollments.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                <p className="text-xs text-slate-400">لم يقم الطالب بالتسجيل في أي كورسات حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((e: any) => (
                  <div
                    key={e._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-black text-[#0B2D5B] dark:text-white text-sm block">
                        {(e.courseId as any)?.title || "دورة تعليمية"}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        تاريخ الاشتراك: {new Date(e.createdAt || e.enrolledAt).toLocaleDateString("ar-EG")}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          e.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {e.status === "Completed" ? "مكتمل ✓" : "جاري التعلم ⏳"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Attempts */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>نتائج الاختبارات والتقييمات الأكاديمية ({attempts.length})</span>
            </h3>

            {attempts.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                <p className="text-xs text-slate-400">لا يوجد محاولات اختبارات مسجلة للطالب</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.map((att: any) => (
                  <div
                    key={att._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#0B2D5B] dark:text-white">
                        {(att.quizId as any)?.title || "اختبار شامل"}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        التاريخ: {new Date(att.createdAt).toLocaleDateString("ar-EG")}
                      </div>
                    </div>

                    <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                      {att.percentage || 0}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Guardian & Payments (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Guardian Info */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 text-xs">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <Users className="h-5 w-5 text-purple-500" />
              <span>بيانات ولي الأمر والتواصل</span>
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">اسم ولي الأمر</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{guardian?.name || "غير مدخل"}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">رقم هاتف التواصل</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 dir-ltr text-right block">{guardian?.phone || "غير مدخل"}</span>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 text-xs">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <span>سجل المدفوعات والاشتراكات ({payments.length})</span>
            </h3>

            {payments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">لا توجد عمليات سداد مسجلة</p>
            ) : (
              <div className="space-y-2">
                {payments.map((p: any) => (
                  <div key={p._id} className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold block text-slate-700 dark:text-slate-200">
                        {(p.courseId as any)?.title || "دورة تعليمية"}
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleDateString("ar-EG")}</span>
                    </div>
                    <span className="font-mono font-black text-emerald-600">{p.amount || 0} ج.م</span>
                  </div>
                ))}
              </div>
            )}
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
                    تغيير كلمة المرور للطالب
                  </h3>
                  <p className="text-xs text-slate-500">{student.fullName}</p>
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
                    إرسال إشعار مباشر للطالب
                  </h3>
                  <p className="text-xs text-slate-500">{student.fullName}</p>
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
                    placeholder="تنبيه أكاديمي..."
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
                    placeholder="نتمنى لك التوفيق في اختبارك القادم..."
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

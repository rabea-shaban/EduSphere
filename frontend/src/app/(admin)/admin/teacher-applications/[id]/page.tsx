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
  CreditCard,
  Briefcase,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Video,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  User,
  Globe,
  Share2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import teacherApplicationService, {
  TeacherApplicationItem,
} from "@/services/teacherApplication.service";
import { Button } from "@/components/ui/button";

export default function TeacherApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const applicationId = params?.id as string;

  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [activeMediaPreview, setActiveMediaPreview] = React.useState<{
    title: string;
    url: string;
    type: "image" | "pdf" | "video";
  } | null>(null);

  // Fetch Application Details
  const { data: application, isLoading, isError, error, refetch } = useQuery<TeacherApplicationItem>({
    queryKey: ["admin", "teacher-application", applicationId],
    queryFn: () => teacherApplicationService.getApplicationById(applicationId),
    enabled: Boolean(applicationId),
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => teacherApplicationService.updateStatus(id, "Approved"),
    onSuccess: () => {
      toast.success("تم اعتماد وتفعيل المعلم بنجاح وتفعيل لوحة تحكم المعلم 🎉");
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-application", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء اعتماد المعلم.");
    },
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      teacherApplicationService.updateStatus(id, "Rejected", reason),
    onSuccess: () => {
      toast.success("تم تسجيل رفض الطلب وإبلاغ المعلم بالسبب.");
      setRejectModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-application", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "teacher-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الرفض.");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 text-right" dir="rtl">
        <div className="h-20 w-full bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
          <div className="h-96 bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4" dir="rtl">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">لم يتم العثور على طلب المعلم</h3>
        <p className="text-xs text-slate-500">قد يكون الطلب تم حذفه أو أن الرابط غير صحيح.</p>
        <Link href="/admin/teacher-applications">
          <Button className="bg-[#0B2D5B] text-white rounded-xl text-xs font-bold gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>العودة لقائمة الطلبات</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Top Header & Sticky Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/teacher-applications"
            className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
            title="العودة"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-[#0B2D5B] dark:text-white">
                طلب اعتماد: {application.fullName}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black ${
                  application.status === "Approved"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : application.status === "Rejected"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
              >
                {application.status === "Approved" && "مقبول ومفعل ✓"}
                {application.status === "Rejected" && "مرفوض ❌"}
                {application.status !== "Approved" && application.status !== "Rejected" && "قيد الانتظار ⏳"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              المادة: <strong className="text-[#F58220]">{application.subject}</strong> • قدم بتاريخ:{" "}
              {new Date(application.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {application.status !== "Approved" && (
            <Button
              onClick={() => approveMutation.mutate(application._id)}
              disabled={approveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black gap-2 shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>اعتماد الطلب وتفعيل المعلم</span>
            </Button>
          )}

          {application.status !== "Rejected" && (
            <Button
              onClick={() => setRejectModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black gap-2 shadow-lg shadow-rose-600/20"
            >
              <XCircle className="h-4 w-4" />
              <span>رفض الطلب</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Details (Left 8 cols) & Sidebar Timeline (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal, Professional & Documents (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Personal Info Card */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <User className="h-5 w-5 text-[#F58220]" />
              <span>البيانات الشخصية والأساسية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">الاسم الكامل</span>
                <span className="font-black text-[#0B2D5B] dark:text-white text-sm">{application.fullName}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">البريد الإلكتروني</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 dir-ltr text-right block">{application.email}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">رقم الهاتف</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 dir-ltr text-right block">{application.phone}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">الرقم القومي</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{application.nationalId || "غير مدخل"}</span>
              </div>
            </div>
          </div>

          {/* Professional Info & Qualifications */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <Briefcase className="h-5 w-5 text-purple-500" />
              <span>المؤهلات التعليمية والخبرات التدريسية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">المادة الأساسية</span>
                <span className="font-black text-[#F58220]">{application.subject}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">المرحلة التعليمية</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{application.stage}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">سنوات الخبرة</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{application.experienceYears} سنوات</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">المؤهل الدراسي</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{application.degree}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">الجامعة / الكلية</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{application.university}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">سنة التخرج</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{application.graduationYear}</span>
              </div>
            </div>

            {/* Preferred Grades */}
            {application.grades && application.grades.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-500 block">الصفوف المستهدفة للتدريس:</span>
                <div className="flex flex-wrap gap-2">
                  {application.grades.map((g, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Biography */}
            {application.bio && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-500 block">نبذة شخصية وسيرة ذاتية مختصرة:</span>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {application.bio}
                </div>
              </div>
            )}
          </div>

          {/* Documents & Files Preview Section */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <FileText className="h-5 w-5 text-emerald-500" />
              <span>المستندات والوثائق المرفوقة 📂</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Profile Image Document */}
              {application.profileImage && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">الصورة الشخصية</span>
                    <span className="text-[10px] text-slate-400">صورة</span>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-white/10">
                    <Image src={application.profileImage} alt="Profile" fill className="object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setActiveMediaPreview({
                          title: "الصورة الشخصية",
                          url: application.profileImage!,
                          type: "image",
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold rounded-xl gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>معاينة</span>
                    </Button>
                    <a
                      href={application.profileImage}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-white hover:bg-[#0B2D5B]"
                      title="فتح في نافذة جديدة"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* National ID Front */}
              {application.nationalIdFront && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">بطاقة الرقم القومي (وجه)</span>
                    <span className="text-[10px] text-slate-400">وثيقة هوية</span>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-white/10">
                    <Image src={application.nationalIdFront} alt="ID Front" fill className="object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setActiveMediaPreview({
                          title: "بطاقة الرقم القومي - الوجه الأمني",
                          url: application.nationalIdFront!,
                          type: "image",
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold rounded-xl gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>معاينة</span>
                    </Button>
                    <a
                      href={application.nationalIdFront}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-white hover:bg-[#0B2D5B]"
                      title="فتح في نافذة جديدة"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* National ID Back */}
              {application.nationalIdBack && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">بطاقة الرقم القومي (ظهر)</span>
                    <span className="text-[10px] text-slate-400">وثيقة هوية</span>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-white/10">
                    <Image src={application.nationalIdBack} alt="ID Back" fill className="object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setActiveMediaPreview({
                          title: "بطاقة الرقم القومي - الظهر",
                          url: application.nationalIdBack!,
                          type: "image",
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold rounded-xl gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>معاينة</span>
                    </Button>
                    <a
                      href={application.nationalIdBack}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-white hover:bg-[#0B2D5B]"
                      title="فتح في نافذة جديدة"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Graduation Certificate */}
              {application.certificateDoc && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">شهادة المؤهل الجامعي</span>
                    <span className="text-[10px] text-slate-400">مستند رسمي</span>
                  </div>
                  <div className="h-40 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex flex-col items-center justify-center p-4 space-y-2 text-center">
                    <Award className="h-10 w-10 text-[#F58220]" />
                    <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">شهادة {application.degree}</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={application.certificateDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-9 rounded-xl bg-[#0B2D5B] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>فتح الملف المرفق</span>
                    </a>
                  </div>
                </div>
              )}

              {/* CV File */}
              {application.cvUrl && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">السيرة الذاتية (CV)</span>
                    <span className="text-[10px] text-slate-400">PDF / Word</span>
                  </div>
                  <div className="h-40 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex flex-col items-center justify-center p-4 space-y-2 text-center">
                    <FileText className="h-10 w-10 text-blue-500" />
                    <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">ملف CV المتقدم</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={application.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>تحميل السيرة الذاتية</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Demo Video */}
              {application.demoVideoUrl && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">فيديو الشرح التوضيحي (Demo)</span>
                    <span className="text-[10px] text-slate-400">فيديو</span>
                  </div>
                  <div className="h-40 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex flex-col items-center justify-center p-4 space-y-2 text-center">
                    <Video className="h-10 w-10 text-purple-500" />
                    <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">معاينة أسلوب التدريس</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setActiveMediaPreview({
                          title: "فيديو التجربة التدريسية (Demo)",
                          url: application.demoVideoUrl!,
                          type: "video",
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold rounded-xl gap-1"
                    >
                      <Video className="h-3.5 w-3.5 text-purple-500" />
                      <span>مشاهدة الفيديو</span>
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right Column: Timeline, Reviewer & Audit Trail (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Application Status Timeline */}
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>مراحل فحص الاعتماد (Timeline)</span>
            </h3>

            <div className="relative pr-6 border-r-2 border-slate-200 dark:border-white/10 space-y-6 text-xs">
              
              {/* Step 1: Submitted */}
              <div className="relative">
                <div className="absolute -right-[31px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0F274D]" />
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[#0B2D5B] dark:text-white block">1. تقديم الطلب</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(application.createdAt).toLocaleString("ar-EG")}
                  </span>
                </div>
              </div>

              {/* Step 2: Review Process */}
              <div className="relative">
                <div
                  className={`absolute -right-[31px] top-0 h-4 w-4 rounded-full ${
                    application.reviewedAt ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  } border-2 border-white dark:border-[#0F274D]`}
                />
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[#0B2D5B] dark:text-white block">2. الفحص والمراجعة</span>
                  <span className="text-[11px] text-slate-400">
                    {application.reviewedAt
                      ? new Date(application.reviewedAt).toLocaleString("ar-EG")
                      : "جارية الآن من قبل الإدارة"}
                  </span>
                </div>
              </div>

              {/* Step 3: Decision */}
              <div className="relative">
                <div
                  className={`absolute -right-[31px] top-0 h-4 w-4 rounded-full ${
                    application.status === "Approved"
                      ? "bg-emerald-500"
                      : application.status === "Rejected"
                      ? "bg-rose-500"
                      : "bg-slate-300 dark:bg-white/20"
                  } border-2 border-white dark:border-[#0F274D]`}
                />
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[#0B2D5B] dark:text-white block">3. القرار النهائي</span>
                  <span className="text-[11px] text-slate-400">
                    {application.status === "Approved" && "تم القبول وتفعيل صلاحيات المعلم"}
                    {application.status === "Rejected" && "تم الرفض مع تسجيل السبب"}
                    {application.status !== "Approved" && application.status !== "Rejected" && "بانتظار صدور قرار الاعتماد"}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Audit & Reviewer Info */}
          {application.reviewedBy && (
            <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 text-xs">
              <h4 className="font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>بيانات المراجع (Audit Log)</span>
              </h4>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-200">
                  بواسطة: {application.reviewedBy.firstName} {application.reviewedBy.lastName}
                </div>
                <div className="text-[11px] text-slate-400">{application.reviewedBy.email}</div>
                {application.reviewedAt && (
                  <div className="text-[11px] text-slate-400">
                    التاريخ: {new Date(application.reviewedAt).toLocaleString("ar-EG")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Reason Callout */}
          {application.status === "Rejected" && application.rejectionReason && (
            <div className="bg-rose-50 dark:bg-rose-950/40 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-2 text-xs text-rose-800 dark:text-rose-200">
              <div className="flex items-center gap-2 font-black text-rose-600">
                <XCircle className="h-5 w-5" />
                <span>سبب الرفض المسجل:</span>
              </div>
              <p className="font-medium leading-relaxed bg-white/60 dark:bg-black/20 p-3 rounded-2xl">
                {application.rejectionReason}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* SINGLE REJECT MODAL */}
      <AnimatePresence>
        {rejectModalOpen && (
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
              <div className="flex items-center gap-3 text-rose-600">
                <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                    سبب عدم قبول طلب المعلم
                  </h3>
                  <p className="text-xs text-slate-500">مطلب إلزامي لإيضاح سبب الرفض للمتقدم</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب الرفض المباشر *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="مثال: يرجى رفع صورة أوضح لشهادة التخرج والسيرة الذاتية المفصلة..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setRejectModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      toast.error("يرجى كتابة سبب الرفض إعمالاً بالدقة والمهنية");
                      return;
                    }
                    rejectMutation.mutate({ id: application._id, reason: rejectionReason.trim() });
                  }}
                  disabled={rejectMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تأكيد تسجيل الرفض</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MEDIA PREVIEW MODAL */}
      <AnimatePresence>
        {activeMediaPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveMediaPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0F274D] p-4 sm:p-6 rounded-3xl max-w-3xl w-full border border-white/20 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">
                  {activeMediaPreview.title}
                </h3>
                <Button
                  onClick={() => setActiveMediaPreview(null)}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs"
                >
                  إغلاق ✕
                </Button>
              </div>

              <div className="relative max-h-[70vh] overflow-hidden rounded-2xl flex items-center justify-center bg-black">
                {activeMediaPreview.type === "image" && (
                  <img
                    src={activeMediaPreview.url}
                    alt={activeMediaPreview.title}
                    className="max-h-[65vh] w-auto object-contain rounded-xl"
                  />
                )}
                {activeMediaPreview.type === "video" && (
                  <video
                    src={activeMediaPreview.url}
                    controls
                    autoPlay
                    className="max-h-[65vh] w-full rounded-xl"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

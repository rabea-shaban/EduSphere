"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { User, GraduationCap, Settings, Mail, Phone, BookOpen, Camera, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuthContext } from "@/providers/auth-provider";
import { FileUploader } from "@/components/common";
import api from "@/services/api";
import { toast } from "react-hot-toast";

export default function TeacherProfilePage() {
  const { user } = useAuthContext();

  const displayName = (user?.firstName || user?.lastName)
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : (user?.fullName || user?.username || "المحاضر المعتمِد");

  const avatarSrc = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;

  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatar || "");
  const [bio, setBio] = React.useState(user?.bio || "محاضر ومدرس معتمد في منصة EduSphere التعليمية.");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.avatar) setAvatarUrl(user.avatar);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await api.patch("/users/profile", {
        avatar: avatarUrl || undefined,
        phone: phone || undefined,
        bio,
      });
      toast.success("تم تحديث بيانات ملف المعلم بنجاح 🎉");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-right dir-rtl transition-colors">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B2D5B] dark:text-white">
            الملف الشخصي للمحاضر 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            النبذة التعريفية، المؤهلات العلمية، وتحديث صورة البروفايل المعروضة للطلاب
          </p>
        </div>

        <Link
          href="/teacher/settings"
          className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Settings className="h-4 w-4" />
          <span>إعدادات الأمان والحساب</span>
        </Link>
      </div>

      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        
        {/* Profile Banner Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100 dark:border-white/10">
          <div className="relative h-32 w-32 rounded-3xl overflow-hidden border-4 border-[#0B2D5B] shadow-xl shrink-0 bg-slate-100">
            <Image src={avatarUrl || avatarSrc} alt={displayName} fill className="object-cover" />
          </div>

          <div className="space-y-2 text-center sm:text-right flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>معلم معتمد وموثق Verified Teacher</span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white">
              {displayName}
            </h2>
            <p className="text-xs font-bold text-[#F58220]">@{user?.username || "teacher"}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{user?.email}</span>
              </span>
              {phone && (
                <span className="flex items-center gap-1 dir-ltr">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{phone}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-2xl pt-2">
          <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-[#F58220]" />
            <span>تحديث السيرة الذاتية والصورة الشخصية</span>
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">النبذة التعريفية (Bio)</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="اكتب نبذة مختصرة عن مؤهلاتك ورؤيتك التدريسية..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          <FileUploader
            label="رفع صورة شخصية جديدة للبروفايل"
            helperText="اختر صورة مربعة عالي الجودة"
            category="image"
            folder="edusphere/avatars"
            value={avatarUrl}
            onChange={(url) => setAvatarUrl(url)}
          />

          <button
            type="submit"
            disabled={isUpdating}
            className="h-11 px-6 rounded-2xl bg-[#0B2D5B] hover:bg-[#1E73D8] text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-[#F58220]" />
            <span>{isUpdating ? "جاري الحفظ..." : "حفظ التعديلات في الملف الشخصي"}</span>
          </button>
        </form>

      </div>
    </div>
  );
}

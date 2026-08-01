"use client";

import * as React from "react";
import Link from "next/link";
import { Settings, ShieldCheck, Mail, Phone, UserCheck, Camera } from "lucide-react";
import { useStudent } from "@/hooks/useStudent";
import { useAuthContext } from "@/providers/auth-provider";
import { toast } from "react-hot-toast";

import uploadService from "@/services/upload.service";

export default function ProfilePage() {
  const { user } = useAuthContext();
  const { profile, isLoadingProfile, updateAvatar, isUpdatingAvatar } = useStudent();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const activeUser = profile || user;
  const fullName = activeUser ? `${activeUser.firstName || ""} ${activeUser.lastName || ""}`.trim() || activeUser.username : "طالب EduSphere";
  const avatarSrc = activeUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`;

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالحة (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    try {
      const res = await uploadService.uploadImage(file, "users");
      await updateAvatar({ avatar: res.url });
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء رفع الصورة إلى Cloudflare R2");
    }
  };

  if (isLoadingProfile && !activeUser) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B2D5B] border-t-[#F58220]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            الملف الشخصي للطالب 👤
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            بياناتك الأكاديمية والنظام التعليمي المسجل في منصة EduSphere
          </p>
        </div>

        <Link
          href="/dashboard/settings"
          className="px-4 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span>تعديل الملف والإعدادات</span>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with upload trigger */}
          <div className="relative h-28 w-28 rounded-3xl overflow-hidden border-4 border-[#F58220] shadow-xl shrink-0 bg-[#0B2D5B]/10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={fullName}
              className="h-full w-full object-cover"
              onError={(e) => {
                const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || "User")}`;
                if (e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
            />
            
            {isUpdatingAvatar && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-[#F58220]" />
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFileSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer gap-1"
              title="تعديل الصورة الشخصية"
            >
              <Camera className="h-5 w-5 text-[#F58220]" />
              <span>تغيير الصورة</span>
            </button>
          </div>

          <div className="space-y-2 text-center sm:text-right flex-1">
            <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white">
              {fullName}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold">
              <span className="bg-[#F58220]/15 text-[#F58220] px-3 py-1 rounded-full border border-[#F58220]/30 flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5" />
                <span>حساب طالب مؤكد</span>
              </span>
              <span className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full">
                اسم المستخدم: @{activeUser?.username || "student"}
              </span>
              {activeUser?.isVerified && (
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>موثق بالكامل</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/10 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-[#F58220]" />
              <span>البريد الإلكتروني:</span>
            </span>
            <span className="font-extrabold text-[#0B2D5B] dark:text-white dir-ltr text-right block">
              {activeUser?.email || "غير محدد"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-[#F58220]" />
              <span>رقم الهاتف:</span>
            </span>
            <span className="font-extrabold text-[#0B2D5B] dark:text-white dir-ltr text-right block">
              {activeUser?.phone || "غير محدد"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1">
            <span className="text-slate-400 font-bold block">تاريخ التسجيل:</span>
            <span className="font-extrabold text-[#0B2D5B] dark:text-white">
              {activeUser?.createdAt ? new Date(activeUser.createdAt).toLocaleDateString("ar-EG") : "يناير 2026"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Camera,
  ShieldCheck,
  Key,
  Save,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  UserCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminProfileService, { AdminUserProfile } from "@/services/adminProfile.service";
import uploadService from "@/services/upload.service";
import { Button } from "@/components/ui/button";

export default function AdminProfilePage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState<"info" | "avatar" | "security">("info");

  // Fetch Current Admin Profile
  const { data: profile, isLoading, isError, refetch } = useQuery<AdminUserProfile>({
    queryKey: ["admin", "my-profile"],
    queryFn: () => adminProfileService.getProfile(),
  });

  // Local States for Basic Info Form
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [dateOfBirth, setDateOfBirth] = React.useState("");

  // Local States for Avatar
  const [avatarPreview, setAvatarPreview] = React.useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = React.useState("");

  // Local States for Change Password
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Sync Form when profile loads
  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setPhone(profile.phone || "");
      setGender(profile.gender || "MALE");
      if (profile.dateOfBirth) {
        setDateOfBirth(new Date(profile.dateOfBirth).toISOString().split("T")[0]);
      }
      setAvatarPreview(profile.avatar || "");
    }
  }, [profile]);

  // Handle File Upload for Avatar (Cloudflare R2 via FormData)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    try {
      const res = await uploadService.uploadImage(file, "users");
      setAvatarPreview(res.url);
      updateAvatarMutation.mutate(res.url);
    } catch (err: any) {
      toast.error("تعذر رفع الصورة إلى Cloudflare R2");
    }
  };

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (payload: any) => adminProfileService.updateProfile(payload),
    onSuccess: (updated) => {
      toast.success("تم تحديث بيانات الملف الشخصي بنجاح");
      queryClient.setQueryData(["admin", "my-profile"], updated);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تحديث البيانات.");
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (avatarStr: string) => adminProfileService.updateAvatar(avatarStr),
    onSuccess: (updated) => {
      toast.success("تم تحديث الصورة الشخصية بنجاح");
      queryClient.setQueryData(["admin", "my-profile"], updated);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر حفظ الصورة الشخصية.");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload: any) => adminProfileService.changePassword(payload),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر تغيير كلمة المرور.");
    },
  });

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "المدير العام للنظام (Super Admin)",
    ADMIN: "مشرف النظام (Admin)",
    TEACHER: "معلم ومحاضر (Teacher)",
    STUDENT: "طالب دراسي (Student)",
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          
          {/* Avatar Icon */}
          <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/10 border-2 border-[#F58220] shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Admin Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-black text-xl text-[#0B2D5B] dark:text-white">
                {profile?.firstName?.charAt(0) || "A"}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-blue-400 px-3 py-0.5 rounded-full text-[11px] font-black">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{roleLabels[profile?.role || "SUPER_ADMIN"]}</span>
            </div>
            <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
              {profile?.firstName ? `${profile.firstName} ${profile.lastName || ""}` : "الملف الشخصي للمسؤول"}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              @{profile?.username || "admin"} — {profile?.email || "admin@edusphere.com"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10 text-xs font-black gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "info"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          البيانات الشخصية والأساسية
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("avatar")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "avatar"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          الصورة الشخصية والرمز الأيقوني
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "security"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          أمان الحساب وكلمة المرور
        </button>
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === "info" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <User className="h-5 w-5 text-[#F58220]" />
            <span>تحديث المعلومات والبيانات الشخصية</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">الاسم الأول *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">اسم العائلة *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">اسم المستخدم (غير قابل للتعديل)</label>
                <input
                  type="text"
                  value={profile?.username || ""}
                  disabled
                  className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold opacity-75 cursor-not-allowed font-mono dir-ltr text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني (غير قابل للتعديل)</label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold opacity-75 cursor-not-allowed font-mono dir-ltr text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">رقم الهاتف</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] dir-ltr text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">الجنس</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
                >
                  <option value="MALE">ذكر</option>
                  <option value="FEMALE">أنثى</option>
                  <option value="OTHER">غير محدد</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">تاريخ الميلاد</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {
                if (!firstName.trim() || !lastName.trim()) {
                  toast.error("يرجى كتابة الاسم الأول واسم العائلة");
                  return;
                }
                updateProfileMutation.mutate({
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  phone: phone.trim() || undefined,
                  gender,
                  dateOfBirth: dateOfBirth || undefined,
                });
              }}
              disabled={updateProfileMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Save className="h-4 w-4" />
              <span>حفظ البيانات الشخصية</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: AVATAR UPLOAD */}
      {activeTab === "avatar" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Camera className="h-5 w-5 text-purple-500" />
            <span>رفع وتحديث الصورة الشخصية للبروفايل</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Live Preview Box */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-32 w-32 rounded-3xl overflow-hidden bg-slate-100 dark:bg-white/10 border-4 border-[#F58220] shadow-md">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-black text-3xl text-[#0B2D5B] dark:text-white">
                    {profile?.firstName?.charAt(0) || "A"}
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-400">معاينة الصورة الحالية</span>
            </div>

            {/* Upload & Link Controls */}
            <div className="flex-1 space-y-4 text-xs">
              
              {/* Option 1: File Upload */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20 space-y-2 text-center">
                <Upload className="h-6 w-6 text-[#F58220] mx-auto" />
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                    اختيار صورة من جهازك
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    يدعم صياغات (PNG, JPG, WebP) بحجم أقصى 5 ميجابايت
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="avatarFileInput"
                />
                <label
                  htmlFor="avatarFileInput"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2D5B] text-white font-bold cursor-pointer hover:bg-[#1E73D8] transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <span>تصفح ملفات الكمبيوتر</span>
                </label>
              </div>

              {/* Option 2: Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">أو أدخل رابط صورة مباشر (URL):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAvatarUrl}
                    onChange={(e) => {
                      setCustomAvatarUrl(e.target.value);
                      setAvatarPreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220] dir-ltr text-right"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    if (!avatarPreview) {
                      toast.error("يرجى اختيار صورة أولاً");
                      return;
                    }
                    updateAvatarMutation.mutate(avatarPreview);
                  }}
                  disabled={updateAvatarMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>حفظ وتثبيت الصورة الشخصية</span>
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Lock className="h-5 w-5 text-rose-500" />
            <span>تغيير وتحديث كلمة المرور للمسؤول</span>
          </h3>

          <div className="space-y-4 text-xs max-w-md">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">كلمة المرور الحالية *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="******"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">كلمة المرور الجديدة *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="******"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">تأكيد كلمة المرور الجديدة *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="******"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    toast.error("يرجى ملء جميع الحقول المطلوبة");
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    toast.error("تأكيد كلمة المرور غير مطابق للكلمة الجديدة");
                    return;
                  }
                  changePasswordMutation.mutate({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                  });
                }}
                disabled={changePasswordMutation.isPending}
                className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
              >
                <Key className="h-4 w-4" />
                <span>تحديث كلمة المرور</span>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

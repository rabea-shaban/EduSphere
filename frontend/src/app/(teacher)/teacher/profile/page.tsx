"use client";

import * as React from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Camera,
  GraduationCap,
  ShieldCheck,
  Key,
  Save,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Lock,
  Upload,
  BookOpen,
  Sparkles,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import { useAuthContext } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/common";

export default function TeacherProfilePage() {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuthContext();

  const [activeTab, setActiveTab] = React.useState<"info" | "avatar" | "security">("info");

  // Fetch Current Teacher Profile
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["teacher", "my-profile"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data?.data || res.data;
    },
    initialData: authUser,
  });

  const activeUser = profile || authUser;

  // Local States for Basic Info Form
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [bio, setBio] = React.useState("");

  // Local States for Avatar
  const [avatarPreview, setAvatarPreview] = React.useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = React.useState("");

  // Local States for Change Password
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Sync Form when profile loads
  React.useEffect(() => {
    if (activeUser) {
      setFirstName(activeUser.firstName || "");
      setLastName(activeUser.lastName || "");
      setPhone(activeUser.phone || "");
      setGender((activeUser.gender as any) || "MALE");
      setBio(activeUser.bio || "");
      if (activeUser.dateOfBirth) {
        setDateOfBirth(new Date(activeUser.dateOfBirth).toISOString().split("T")[0]);
      }
      setAvatarPreview(activeUser.avatar || "");
    }
  }, [activeUser]);

  // Handle File Upload for Avatar (converts to Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.patch("/auth/profile", payload);
      return res.data?.data || res.data;
    },
    onSuccess: (updated) => {
      toast.success("تم تحديث بيانات ملف المعلم بنجاح 🎉");
      queryClient.setQueryData(["teacher", "my-profile"], updated);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "حدث خطأ أثناء تحديث البيانات.");
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarStr: string) => {
      const res = await api.patch("/auth/avatar", { avatar: avatarStr });
      return res.data?.data || res.data;
    },
    onSuccess: (updated) => {
      toast.success("تم تحديث الصورة الشخصية للمحاضر بنجاح 🖼️");
      queryClient.setQueryData(["teacher", "my-profile"], updated);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "تعذر حفظ الصورة الشخصية.");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.patch("/auth/change-password", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح 🔒");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "تعذر تغيير كلمة المرور.");
    },
  });

  const displayName = (firstName || lastName)
    ? `${firstName} ${lastName}`.trim()
    : activeUser?.fullName || activeUser?.username || "المعلم الفاضل";

  return (
    <div className="space-y-6 text-right transition-colors dir-rtl" dir="rtl">
      
      {/* Header Banner Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          
          {/* Avatar Icon / Image */}
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/10 border-2 border-[#F58220] shrink-0 shadow-md">
            {avatarPreview ? (
              <img src={avatarPreview} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-black text-2xl text-[#0B2D5B] dark:text-white">
                {displayName.charAt(0)}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-0.5 rounded-full text-[11px] font-black">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>معلم ومحاضر معتمد Verified Instructor</span>
            </div>
            <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
              {displayName}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              @{activeUser?.username || "teacher"} — {activeUser?.email || "teacher@edusphere.com"}
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
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
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
          البيانات الشخصية والنبذة التعريفية
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

      {/* TAB 1: BASIC INFO & BIO */}
      {activeTab === "info" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <User className="h-5 w-5 text-[#F58220]" />
            <span>تحديث البيانات الشخصية والسيرة الذاتية</span>
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
                  value={activeUser?.username || ""}
                  disabled
                  className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold opacity-75 cursor-not-allowed font-mono dir-ltr text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني (غير قابل للتعديل)</label>
                <input
                  type="email"
                  value={activeUser?.email || ""}
                  disabled
                  className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold opacity-75 cursor-not-allowed font-mono dir-ltr text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">رقم الهاتف / الواتساب</label>
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

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">النبذة التعريفية ورؤية المحاضر (Bio)</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="اكتب نبذة مختصرة عن مؤهلاتك ورؤيتك الأكاديمية والمواد التي تقوم بتدريسها..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
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
                  bio: bio.trim() || undefined,
                });
              }}
              disabled={updateProfileMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{updateProfileMutation.isPending ? "جاري الحفظ..." : "حفظ البيانات الشخصية"}</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: AVATAR UPLOAD */}
      {activeTab === "avatar" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Camera className="h-5 w-5 text-purple-500" />
            <span>رفع وتحديث الصورة الشخصية للمحاضر</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Live Preview Box */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-36 w-36 rounded-3xl overflow-hidden bg-slate-100 dark:bg-white/10 border-4 border-[#F58220] shadow-xl">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-black text-4xl text-[#0B2D5B] dark:text-white">
                    {displayName.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-400">معاينة الصورة المعروضة للطلاب</span>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-5 text-xs w-full">
              
              {/* Cloudinary Unified File Uploader */}
              <FileUploader
                label="رفع صورة عالية الجودة عبر السيرفر"
                helperText="صيغ مدعومة: JPG, PNG, WebP حتى 10MB"
                category="image"
                folder="edusphere/teachers"
                value={avatarPreview}
                onChange={(url) => setAvatarPreview(url)}
              />

              {/* Option 2: Direct Local File Input */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20 space-y-2 text-center">
                <Upload className="h-5 w-5 text-[#F58220] mx-auto" />
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                    أو اختر صورة مباشرة من جهازك
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="teacherAvatarFileInput"
                />
                <label
                  htmlFor="teacherAvatarFileInput"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2D5B] text-white font-bold cursor-pointer hover:bg-[#1E73D8] transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <span>تصفح الصور بالكمبيوتر</span>
                </label>
              </div>

              {/* Option 3: Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">رابط صورة مباشر (Direct Image URL):</label>
                <input
                  type="text"
                  value={customAvatarUrl}
                  onChange={(e) => {
                    setCustomAvatarUrl(e.target.value);
                    setAvatarPreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220] dir-ltr text-right"
                />
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
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{updateAvatarMutation.isPending ? "جاري الحفظ..." : "حفظ وتثبيت الصورة الشخصية"}</span>
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD CHANGE */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Lock className="h-5 w-5 text-rose-500" />
            <span>تغيير وتحديث كلمة المرور للمحاضر</span>
          </h3>

          <div className="space-y-4 text-xs max-w-md">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">كلمة المرور الحالية *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">كلمة المرور الجديدة *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">تأكيد كلمة المرور الجديدة *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
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
                className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2 cursor-pointer"
              >
                <Key className="h-4 w-4" />
                <span>{changePasswordMutation.isPending ? "جاري التحديث..." : "تحديث كلمة المرور"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

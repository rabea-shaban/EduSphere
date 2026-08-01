"use client";

import * as React from "react";
import { Camera, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { useStudent } from "@/hooks/useStudent";
import { useAuthContext } from "@/providers/auth-provider";
import uploadService from "@/services/upload.service";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [tab, setTab] = React.useState<"profile" | "security" | "notifications">("profile");

  const { user } = useAuthContext();
  const {
    profile,
    updateProfile,
    isUpdatingProfile,
    changePassword,
    isChangingPassword,
    updateAvatar,
    isUpdatingAvatar,
  } = useStudent();

  const activeUser = profile || user;
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Profile form state
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeUser) {
      setFirstName(activeUser.firstName || "");
      setLastName(activeUser.lastName || "");
      setPhone(activeUser.phone || "");
      if (activeUser.gender) {
        setGender(activeUser.gender as "MALE" | "FEMALE" | "OTHER");
      }
      if (activeUser.dateOfBirth) {
        setDateOfBirth(activeUser.dateOfBirth.split("T")[0]);
      }
      setAvatarPreview(activeUser.avatar || null);
    }
  }, [activeUser]);

  // Security form state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

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

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    try {
      const res = await uploadService.uploadImage(file, "users");
      setAvatarPreview(res.url);
      await updateAvatar({ avatar: res.url });
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء رفع الصورة إلى Cloudflare R2");
    }
  };

  const handleRemoveAvatar = async () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${activeUser?.fullName || "User"}`;
    setAvatarPreview(defaultAvatar);
    await updateAvatar({ avatar: defaultAvatar });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ firstName, lastName, phone, gender, dateOfBirth });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("يرجى إدخال كلمة المرور الحالية والجديدة");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة مع التأكيد");
      return;
    }
    await changePassword({ currentPassword, newPassword, confirmPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const currentAvatarSrc =
    avatarPreview ||
    activeUser?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${activeUser?.fullName || "User"}`;

  return (
    <div className="space-y-8 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إعدادات الحساب والمنصة
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          إدارة تفضيلات الأمان، الإشعارات، والبيانات الشخصية والصورة الشخصية للحساب
        </p>
      </div>

      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => setTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "profile"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            تعديل البيانات والصورة
          </button>
          <button
            type="button"
            onClick={() => setTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "security"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            كلمة المرور والأمان
          </button>
          <button
            type="button"
            onClick={() => setTab("notifications")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "notifications"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            تفضيلات الإشعارات
          </button>
        </div>

        {/* Tab 1: Profile form */}
        {tab === "profile" && (
          <div className="space-y-6 max-w-xl">
            {/* Avatar Upload Section */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative h-24 w-24 rounded-3xl overflow-hidden border-4 border-[#F58220] shadow-md shrink-0 bg-[#0B2D5B]/10 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentAvatarSrc}
                  alt="الصورة الشخصية"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeUser?.fullName || "User")}`;
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="تغيير الصورة"
                >
                  <Camera className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-2 text-center sm:text-right flex-1">
                <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">الصورة الشخصية</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  اختر صورة شخصية بتنسيق PNG أو JPG (حجم أقصى 5MB)
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUpdatingAvatar}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUpdatingAvatar ? "جاري الرفع..." : "رفع صورة جديدة"}</span>
                  </button>

                  {activeUser?.avatar && (
                    <button
                      type="button"
                      disabled={isUpdatingAvatar}
                      onClick={handleRemoveAvatar}
                      className="px-3 py-2 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>حذف الصورة</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم الأول</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="الاسم الأول"
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم الأخير</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="اسم العائلة"
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني (غير قابل للتعديل)</label>
                <input
                  type="email"
                  disabled
                  value={activeUser?.email || ""}
                  className="w-full h-11 px-4 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none opacity-70 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الجنس</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                  >
                    <option value="MALE">ذكر</option>
                    <option value="FEMALE">أنثى</option>
                    <option value="OTHER">غير محدد</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تاريخ الميلاد</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingProfile ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Security */}
        {tab === "security" && (
          <form className="space-y-4 max-w-lg" onSubmit={handleChangePassword}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">كلمة المرور الحالية</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="h-11 px-6 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md hover:bg-[#F58220] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isChangingPassword ? "جاري التعديل..." : "تغيير كلمة المرور"}
            </button>
          </form>
        )}

        {/* Tab 3: Notifications Preferences */}
        {tab === "notifications" && (
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إشعارات الاختبارات والواجبات</span>
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#F58220]" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إشعارات الدروس الجديدة</span>
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#F58220]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

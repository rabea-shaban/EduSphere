"use client";

import * as React from "react";
import { Save, Loader2, User, FileText, Sparkles } from "lucide-react";
import { useUpdateTeacherProfile } from "@/hooks/useTeacherProfile";
import type { TeacherUser, TeacherProfileDetails } from "@/features/teacher/types/profile";

interface ProfileInfoFormProps {
  user: TeacherUser;
  profile: TeacherProfileDetails;
}

export function ProfileInfoForm({ user, profile }: ProfileInfoFormProps) {
  const updateProfile = useUpdateTeacherProfile();

  const [formData, setFormData] = React.useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    displayName: profile.displayName || "",
    headline: profile.headline || "",
    bio: profile.bio || "",
    gender: user.gender || "MALE",
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-5 shadow-sm">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <User className="h-4 w-4 text-[#F58220]" />
          البيانات الشخصية والسيرة الذاتية 👤
        </h3>
        <p className="text-xs text-slate-400">تعديل معلومات الاسم، اسم المعروض، المسمى الوظيفي والسيرة الذاتية</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">الاسم الأول *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">اسم العائلة *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">اسم المعروض على المنصة</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="مثال: أ. أحمد صابر"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">اسم المستخدم (Username) *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-bold text-slate-700 dark:text-slate-200">العنوان الوظيفي المختصر (Headline)</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            placeholder="مثال: خبير تدريس الرياضيات للثانوية العامة بخبرة +10 سنوات"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-bold text-slate-700 dark:text-slate-200">السيرة الذاتية (Bio)</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="اكتب نبذة عن أسلوبك في الشرح وخبرتك التعليمية..."
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold resize-none"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="h-11 px-6 rounded-2xl bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white text-xs font-black flex items-center gap-2 shadow hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>حفظ البيانات الشخصية</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProfileInfoForm;

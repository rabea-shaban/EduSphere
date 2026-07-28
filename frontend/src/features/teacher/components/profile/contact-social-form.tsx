"use client";

import * as React from "react";
import { Save, Loader2, Phone, Mail, Globe, Share2, Video, MessageSquare } from "lucide-react";
import { useUpdateTeacherProfile } from "@/hooks/useTeacherProfile";
import type { TeacherUser, TeacherProfileDetails, SocialLinks } from "@/features/teacher/types/profile";

interface ContactSocialFormProps {
  user: TeacherUser;
  profile: TeacherProfileDetails;
}

export function ContactSocialForm({ user, profile }: ContactSocialFormProps) {
  const updateProfile = useUpdateTeacherProfile();

  const [formData, setFormData] = React.useState({
    phone: user.phone || "",
    location: profile.location || "",
    country: profile.country || "مصر",
    city: profile.city || "",
    website: profile.socialLinks?.website || "",
    linkedIn: profile.socialLinks?.linkedIn || "",
    gitHub: profile.socialLinks?.gitHub || "",
    youTube: profile.socialLinks?.youTube || "",
    facebook: profile.socialLinks?.facebook || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      phone: formData.phone,
      location: formData.location,
      country: formData.country,
      city: formData.city,
      socialLinks: {
        website: formData.website,
        linkedIn: formData.linkedIn,
        gitHub: formData.gitHub,
        youTube: formData.youTube,
        facebook: formData.facebook,
      },
    };
    await updateProfile.mutateAsync(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-5 shadow-sm">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#F58220]" />
          معلومات الاتصال وحسابات التواصل الاجتماعي 🌐
        </h3>
        <p className="text-xs text-slate-400">إدارة رقم الهاتف، الدولة، المدينة ورواق التواصل الاجتماعي</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">البريد الإلكتروني المسجل</label>
          <input
            type="email"
            value={user.email}
            readOnly
            disabled
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 font-semibold outline-none cursor-not-allowed text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">رقم الهاتف التواصل *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">الدولة</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">المدينة / المحافظة</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="مثال: القاهرة"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        {/* Social Links */}
        <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <label className="font-black text-[#0B2D5B] dark:text-white block">روابط وسائل التواصل الاجتماعي:</label>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            الموقع الشخصي (Website)
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://myteacherwebsite.com"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Share2 className="h-3.5 w-3.5 text-blue-500" />
            رابط LinkedIn
          </label>
          <input
            type="url"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-rose-500" />
            قناة YouTube
          </label>
          <input
            type="url"
            name="youTube"
            value={formData.youTube}
            onChange={handleChange}
            placeholder="https://youtube.com/@channel"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
            صفحة Facebook
          </label>
          <input
            type="url"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/page"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
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
              <span>حفظ الاتصال والتواصل الاجتماعي</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ContactSocialForm;

"use client";

import * as React from "react";
import { Camera, CheckCircle2, ShieldCheck, Image as ImageIcon, Loader2 } from "lucide-react";
import { useUploadAvatar, useDeleteAvatar, useUploadCover, useDeleteCover } from "@/hooks/useTeacherProfile";
import type { TeacherUser, TeacherProfileDetails } from "@/features/teacher/types/profile";
import uploadService from "@/services/upload.service";
import { toast } from "react-hot-toast";

interface ProfileHeaderProps {
  user: TeacherUser;
  profile: TeacherProfileDetails;
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();
  const uploadCover = useUploadCover();
  const deleteCover = useDeleteCover();

  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);
  const coverInputRef = React.useRef<HTMLInputElement | null>(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [isUploadingCover, setIsUploadingCover] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالحة (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة الشخصية يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setIsUploadingAvatar(true);

    try {
      const res = await uploadService.uploadImage(file, "teachers");
      setAvatarPreview(res.url);
      uploadAvatar.mutate(res.url);
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء رفع الصورة إلى Cloudflare R2");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالحة (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم صورة الغلاف يجب ألا يتجاوز 10 ميجابايت");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setCoverPreview(localUrl);
    setIsUploadingCover(true);

    try {
      const res = await uploadService.uploadImage(file, "teachers");
      setCoverPreview(res.url);
      uploadCover.mutate(res.url);
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء رفع صورة الغلاف إلى Cloudflare R2");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const currentAvatarSrc = avatarPreview || user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.firstName || "Teacher")}`;
  const currentCoverSrc = coverPreview || profile.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200";

  return (
    <div className="relative rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-sm text-right dir-rtl">
      {/* Hidden File Inputs for Avatar & Cover */}
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/*"
        onChange={handleAvatarFileSelect}
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        accept="image/*"
        onChange={handleCoverFileSelect}
        className="hidden"
      />

      {/* Cover Image */}
      <div className="relative h-44 sm:h-56 w-full bg-slate-800 overflow-hidden">
        <img
          src={currentCoverSrc}
          alt="Cover"
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            const fallback = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200";
            if (e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {isUploadingCover && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#F58220]" />
            <span>جاري رفع الغلاف...</span>
          </div>
        )}

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            className="px-3 h-8 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>تغيير الغلاف</span>
          </button>
        </div>
      </div>

      {/* Profile Details Bar */}
      <div className="p-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-3xl border-4 border-white dark:border-[#0F274D] bg-slate-100 overflow-hidden shadow-xl shrink-0 group">
            <img
              src={currentAvatarSrc}
              alt={user.firstName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.firstName || "Teacher")}`;
                if (e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
            />

            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#F58220]" />
              </div>
            )}

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer text-xs font-bold gap-1 disabled:opacity-50"
            >
              <Camera className="h-5 w-5 text-[#F58220]" />
              <span>تغيير الصورة</span>
            </button>
          </div>

          <div className="space-y-1 sm:pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-white">
                {profile.displayName || `${user.firstName} ${user.lastName}`}
              </h2>
              {user.isVerified && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-500/30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  حساب موثق
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              @{user.username} • {profile.professionalInfo?.specialization || "معلم عام"}
            </p>
            {profile.headline && (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {profile.headline}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;

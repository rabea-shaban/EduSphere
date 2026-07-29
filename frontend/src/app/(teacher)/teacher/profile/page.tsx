"use client";

import * as React from "react";
import { User, Briefcase, Globe, Lock, Sparkles, RefreshCw } from "lucide-react";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { ProfileHeader } from "@/features/teacher/components/profile/profile-header";
import { ProfileCompletionCard } from "@/features/teacher/components/profile/profile-completion-card";
import { ProfileAnalyticsWidget } from "@/features/teacher/components/profile/profile-analytics-widget";
import { ProfileInfoForm } from "@/features/teacher/components/profile/profile-info-form";
import { ProfessionalInfoForm } from "@/features/teacher/components/profile/professional-info-form";
import { ContactSocialForm } from "@/features/teacher/components/profile/contact-social-form";
import { AccountSecurityForm } from "@/features/teacher/components/profile/account-security-form";
import { ProfileSkeleton } from "@/features/teacher/components/profile/profile-skeleton";
import { ProfileEmptyState } from "@/features/teacher/components/profile/profile-empty-state";

export default function InstructorProfilePage() {
  const [activeTab, setActiveTab] = React.useState<"general" | "professional" | "contact" | "security">("general");

  const { data: profileData, isLoading, refetch } = useTeacherProfile();

  if (isLoading) return <ProfileSkeleton />;
  if (!profileData) return <ProfileEmptyState />;

  const { user, profile, completeness, analytics } = profileData;

  return (
    <div className="space-y-6 text-right dir-rtl max-w-5xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              إدارة الملف الشخصي والمهني
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            تحديث البيانات الشخصية، الخبرات الأكاديمية، وسائط الاتصال وإعدادات الحساب
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-200 hover:border-[#F58220] transition-colors cursor-pointer"
          title="تحديث البيانات"
          aria-label="تحديث"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Header Profile Cover & Avatar */}
      <ProfileHeader user={user} profile={profile} />

      {/* Analytics Widget */}
      {analytics && <ProfileAnalyticsWidget analytics={analytics} />}

      {/* Profile Completion Progress Card */}
      {completeness && <ProfileCompletionCard completeness={completeness} />}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-white/10 pb-3 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "general"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow"
              : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          }`}
        >
          <User className="h-4 w-4" />
          <span>البيانات الشخصية والسيرة</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("professional")}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "professional"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow"
              : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>الخبرات والمؤهلات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "contact"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow"
              : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>الاتصال والتواصل الاجتماعي</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow"
              : "bg-white dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>أمان الحساب وكلمة المرور</span>
        </button>
      </div>

      {/* Active Tab Form Content */}
      <div className="pt-2">
        {activeTab === "general" && <ProfileInfoForm user={user} profile={profile} />}
        {activeTab === "professional" && <ProfessionalInfoForm professionalInfo={profile.professionalInfo} />}
        {activeTab === "contact" && <ContactSocialForm user={user} profile={profile} />}
        {activeTab === "security" && <AccountSecurityForm />}
      </div>
    </div>
  );
}

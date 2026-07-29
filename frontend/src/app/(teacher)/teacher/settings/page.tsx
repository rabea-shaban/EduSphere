"use client";

import * as React from "react";
import { Settings, Lock, Bell, Palette, Globe, ShieldCheck, UserX } from "lucide-react";
import {
  useSettings,
  useSessions,
  useUpdateGeneralSettings,
  useUpdateAppearanceSettings,
  useUpdateNotificationSettings,
  useUpdatePrivacySettings,
  useUpdateSecuritySettings,
  useRevokeSession,
  useLogoutAllDevices,
  useExportData,
  useDeactivateAccount,
  useDeleteAccount,
} from "@/hooks/useTeacherSettings";
import { GeneralSettingsForm } from "@/features/teacher/components/settings/GeneralSettingsForm";
import { AppearanceSettingsForm } from "@/features/teacher/components/settings/AppearanceSettingsForm";
import { NotificationSettingsForm } from "@/features/teacher/components/settings/NotificationSettingsForm";
import { PrivacySettingsForm } from "@/features/teacher/components/settings/PrivacySettingsForm";
import { SecuritySettingsForm } from "@/features/teacher/components/settings/SecuritySettingsForm";
import { SessionsListCard } from "@/features/teacher/components/settings/SessionsListCard";
import { AccountManagementCard } from "@/features/teacher/components/settings/AccountManagementCard";
import { SettingsSkeleton } from "@/features/teacher/components/settings/SettingsSkeleton";
import { SettingsEmptyState } from "@/features/teacher/components/settings/SettingsEmptyState";

type TabType = "general" | "appearance" | "notifications" | "privacy" | "security" | "account";

export default function InstructorSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>("general");

  const { data: settings, isLoading, isError, refetch } = useSettings();
  const { data: sessions, isLoading: isLoadingSessions } = useSessions();

  const updateGeneral = useUpdateGeneralSettings();
  const updateAppearance = useUpdateAppearanceSettings();
  const updateNotifications = useUpdateNotificationSettings();
  const updatePrivacy = useUpdatePrivacySettings();
  const updateSecurity = useUpdateSecuritySettings();
  const revokeSession = useRevokeSession();
  const logoutAllDevices = useLogoutAllDevices();
  const exportData = useExportData();
  const deactivateAccount = useDeactivateAccount();
  const deleteAccount = useDeleteAccount();

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  if (isError) {
    return <SettingsEmptyState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-[#F58220]" />
          إعدادات حساب المعلم
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          إدارة البيانات العامة، المظهر البصري، إعدادات الخصوصية، التنبيهات، والأمان والحساب
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-100 dark:border-white/10 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "general"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Globe className="w-4 h-4" />
            الإعدادات العامة
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("appearance")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "appearance"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Palette className="w-4 h-4" />
            المظهر والتنسيق
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "notifications"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Bell className="w-4 h-4" />
            التنبيهات والإشعارات
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "privacy"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            الخصوصية والظهور
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "security"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Lock className="w-4 h-4" />
            كلمة المرور والجلسات
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "account"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <UserX className="w-4 h-4" />
            إدارة وتصدير الحساب
          </button>
        </div>

        {/* Active Tab Content */}
        <div className="pt-2">
          {activeTab === "general" && (
            <GeneralSettingsForm
              initialData={settings?.general}
              onSave={(data) => updateGeneral.mutate(data)}
              isLoading={updateGeneral.isPending}
            />
          )}

          {activeTab === "appearance" && (
            <AppearanceSettingsForm
              initialData={settings?.appearance}
              onSave={(data) => updateAppearance.mutate(data)}
              isLoading={updateAppearance.isPending}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationSettingsForm
              initialData={settings?.notifications}
              onSave={(data) => updateNotifications.mutate(data)}
              isLoading={updateNotifications.isPending}
            />
          )}

          {activeTab === "privacy" && (
            <PrivacySettingsForm
              initialData={settings?.privacy}
              onSave={(data) => updatePrivacy.mutate(data)}
              isLoading={updatePrivacy.isPending}
            />
          )}

          {activeTab === "security" && (
            <div className="space-y-10">
              <SecuritySettingsForm
                initialData={settings?.security}
                onSave={(data) => updateSecurity.mutate(data)}
                isLoading={updateSecurity.isPending}
              />

              <SessionsListCard
                sessions={sessions}
                onRevokeSession={(id) => revokeSession.mutate(id)}
                onLogoutAllDevices={() => logoutAllDevices.mutate()}
                isRevoking={revokeSession.isPending}
                isLoggingOutAll={logoutAllDevices.isPending}
                isLoadingSessions={isLoadingSessions}
              />
            </div>
          )}

          {activeTab === "account" && (
            <AccountManagementCard
              onExportData={() => exportData.mutate()}
              onDeactivateAccount={(password) => deactivateAccount.mutate(password)}
              onDeleteAccount={(password) => deleteAccount.mutate(password)}
              isExporting={exportData.isPending}
              isDeactivating={deactivateAccount.isPending}
              isDeleting={deleteAccount.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}

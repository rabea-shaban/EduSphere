import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherSettingsService from "@/services/teacherSettings.service";
import type {
  TeacherSettings,
  GeneralSettings,
  AppearanceSettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  UpdateSecurityInput,
} from "@/features/teacher/types/settings";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const TEACHER_SETTINGS_KEYS = queryKeys.teacher.settings;

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.teacher.settings.all,
    queryFn: () => teacherSettingsService.getSettings(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TeacherSettings>) => teacherSettingsService.updateSettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.teacher.settings.all, updatedSettings);
      toast.success("تم حفظ الإعدادات بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حفظ الإعدادات");
    },
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<GeneralSettings>) => teacherSettingsService.updateGeneralSettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.teacher.settings.all, updatedSettings);
      toast.success("تم حفظ الإعدادات العامة بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حفظ الإعدادات العامة");
    },
  });
}

export function useUpdateAppearanceSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AppearanceSettings>) => teacherSettingsService.updateAppearanceSettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.teacher.settings.all, updatedSettings);
      toast.success("تم حفظ إعدادات المظهر بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حفظ إعدادات المظهر");
    },
  });
}

export function useNotificationSettings() {
  return useSettings();
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<NotificationSettings>) => teacherSettingsService.updateNotificationSettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.teacher.settings.all, updatedSettings);
      toast.success("تم حفظ إعدادات الإشعارات بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حفظ إعدادات الإشعارات");
    },
  });
}

export function usePrivacySettings() {
  return useSettings();
}

export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PrivacySettings>) => teacherSettingsService.updatePrivacySettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.teacher.settings.all, updatedSettings);
      toast.success("تم حفظ إعدادات الخصوصية بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حفظ إعدادات الخصوصية");
    },
  });
}

export function useSecuritySettings() {
  return useSettings();
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSecurityInput) => teacherSettingsService.updateSecuritySettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.teacher.settings.all, updatedSettings);
      toast.success("تم حفظ الإعدادات الأمنية بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حفظ الإعدادات الأمنية");
    },
  });
}

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.teacher.settings.security(),
    queryFn: () => teacherSettingsService.getSessions(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => teacherSettingsService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.settings.security() });
      toast.success("تم إنهاء الجلسة بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر إنهاء الجلسة");
    },
  });
}

export function useLogoutAllDevices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teacherSettingsService.logoutAllDevices(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.settings.security() });
      toast.success("تم تسجيل الخروج من جميع الأجهزة بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تسجيل الخروج من باقي الأجهزة");
    },
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: () => teacherSettingsService.exportPersonalData(),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `edusphere_account_backup_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("تم تحميل نسخة احتياطية من بيانات حسابك بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تصدير بيانات الحساب");
    },
  });
}

export function useExportUserData() {
  return useExportData();
}

export function useDeactivateAccount() {
  return useMutation({
    mutationFn: (password: string) => teacherSettingsService.deactivateAccount(password),
    onSuccess: () => {
      toast.success("تم تعليق تفعيل الحساب بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تعليق تفعيل الحساب");
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => teacherSettingsService.deleteAccount(password),
    onSuccess: () => {
      toast.success("تم تقديم طلب حذف الحساب بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر طلب حذف الحساب");
    },
  });
}

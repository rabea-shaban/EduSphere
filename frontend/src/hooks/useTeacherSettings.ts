import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherSettingsService from "@/services/teacherSettings.service";
import type {
  TeacherSettings,
  GeneralSettings,
  AppearanceSettings,
  NotificationSettings,
  PrivacySettings,
  ActiveSession,
  UpdateSecurityInput,
} from "@/features/teacher/types/settings";

export const TEACHER_SETTINGS_KEYS = {
  all: ["teacher-settings"] as const,
  details: ["teacher-settings", "details"] as const,
  sessions: ["teacher-settings", "sessions"] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: TEACHER_SETTINGS_KEYS.details,
    queryFn: () => teacherSettingsService.getSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
}

export function useGeneralSettings() {
  const query = useSettings();
  return {
    ...query,
    general: query.data?.general,
  };
}

export function useAppearanceSettings() {
  const query = useSettings();
  return {
    ...query,
    appearance: query.data?.appearance,
  };
}

export function useNotificationSettings() {
  const query = useSettings();
  return {
    ...query,
    notifications: query.data?.notifications,
  };
}

export function usePrivacySettings() {
  const query = useSettings();
  return {
    ...query,
    privacy: query.data?.privacy,
  };
}

export function useSecuritySettings() {
  const query = useSettings();
  return {
    ...query,
    security: query.data?.security,
  };
}

export function useSessions() {
  return useQuery({
    queryKey: TEACHER_SETTINGS_KEYS.sessions,
    queryFn: () => teacherSettingsService.getSessions(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TeacherSettings>) => teacherSettingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_SETTINGS_KEYS.all });
      toast.success("تم حفظ كافة الإعدادات بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حفظ الإعدادات");
    },
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<GeneralSettings>) => teacherSettingsService.updateGeneralSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_SETTINGS_KEYS.all });
      toast.success("تم تحديث الإعدادات العامة بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث الإعدادات العامة");
    },
  });
}

export function useUpdateAppearanceSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AppearanceSettings>) => teacherSettingsService.updateAppearanceSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_SETTINGS_KEYS.all });
      toast.success("تم تحديث مظهر الواجهة بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث تفضيلات المظهر");
    },
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<NotificationSettings>) => teacherSettingsService.updateNotificationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_SETTINGS_KEYS.all });
      toast.success("تم تحديث تفضيلات الإشعارات بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث تفضيلات الإشعارات");
    },
  });
}

export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PrivacySettings>) => teacherSettingsService.updatePrivacySettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_SETTINGS_KEYS.all });
      toast.success("تم تحديث إعدادات الخصوصية بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث إعدادات الخصوصية");
    },
  });
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSecurityInput) => teacherSettingsService.updateSecuritySettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_SETTINGS_KEYS.all });
      toast.success("تم تحديث إعدادات الأمان وكلمة المرور بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث إعدادات الأمان");
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => teacherSettingsService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_SETTINGS_KEYS.sessions });
      toast.success("تم إنهاء الجلسة المحددة بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إنهاء الجلسة");
    },
  });
}

export function useLogoutAllDevices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => teacherSettingsService.logoutAllDevices(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_SETTINGS_KEYS.sessions });
      toast.success("تم تسجيل الخروج من كافة الأجهزة الأخرى بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تسجيل الخروج من كافة الأجهزة");
    },
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: () => teacherSettingsService.exportPersonalData(),
    onSuccess: (data) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `edusphere-teacher-data-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("تم تصدير وتحميل كافة بيانات الحساب بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تصدير بيانات الحساب");
    },
  });
}

export function useDeactivateAccount() {
  return useMutation({
    mutationFn: (password: string) => teacherSettingsService.deactivateAccount(password),
    onSuccess: () => {
      toast.success("تم تعطيل الحساب بنجاح. سيتم توجيهك لصفحة الدخول...");
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تعطيل الحساب، تحقق من كلمة المرور");
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => teacherSettingsService.deleteAccount(password),
    onSuccess: () => {
      toast.success("تم تقديم طلب حذف الحساب بنجاح.");
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تقديم طلب حذف الحساب، تحقق من كلمة المرور");
    },
  });
}

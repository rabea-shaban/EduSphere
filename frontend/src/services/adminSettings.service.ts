import api from "./api";

export interface PlatformSettingsData {
  general: {
    platformName: string;
    platformDescription: string;
    currency: string;
    defaultLanguage: string;
    timezone: string;
  };
  system: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    teacherApplicationsEnabled: boolean;
    courseApprovalRequired: boolean;
    autoPublishCourses: boolean;
  };
  payments: {
    instapayEnabled: boolean;
    vodafoneCashEnabled: boolean;
    fawryEnabled: boolean;
    bankTransferEnabled: boolean;
    stripeEnabled: boolean;
  };
  security: {
    minPasswordLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    sessionTimeoutMinutes: number;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    senderName: string;
    senderEmail: string;
  };
  backup: {
    lastBackupAt?: string;
    databaseSizeMB?: number;
  };
}

export const adminSettingsService = {
  async getSettings(): Promise<PlatformSettingsData> {
    const response = await api.get<{ success: boolean; data: PlatformSettingsData }>("/admin/settings/platform");
    return response.data.data;
  },

  async updateSection(section: string, data: any): Promise<PlatformSettingsData> {
    const response = await api.patch<{ success: boolean; data: PlatformSettingsData }>(
      `/admin/settings/platform/${section}`,
      { [section]: data }
    );
    return response.data.data;
  },

  async testEmail(recipientEmail: string): Promise<any> {
    const response = await api.post<{ success: boolean; data: any }>("/admin/settings/platform/test-email", {
      recipientEmail,
    });
    return response.data.data;
  },

  async triggerBackup(): Promise<any> {
    const response = await api.post<{ success: boolean; data: any }>("/admin/settings/platform/backup");
    return response.data.data;
  },
};

export default adminSettingsService;

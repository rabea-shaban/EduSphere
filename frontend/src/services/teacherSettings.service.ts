import api from './api';
import type {
  TeacherSettings,
  GeneralSettings,
  AppearanceSettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  ActiveSession,
  UpdateSecurityInput,
} from '@/features/teacher/types/settings';

export class TeacherSettingsService {
  /**
   * GET /teacher/settings
   */
  async getSettings(): Promise<TeacherSettings> {
    const res = await api.get<{ data: TeacherSettings }>('/teacher/settings');
    return res.data.data;
  }

  /**
   * PUT /teacher/settings
   */
  async updateSettings(data: Partial<TeacherSettings>): Promise<TeacherSettings> {
    const res = await api.put<{ data: TeacherSettings }>('/teacher/settings', data);
    return res.data.data;
  }

  /**
   * PATCH /teacher/settings/general
   */
  async updateGeneralSettings(data: Partial<GeneralSettings>): Promise<TeacherSettings> {
    const res = await api.patch<{ data: TeacherSettings }>('/teacher/settings/general', data);
    return res.data.data;
  }

  /**
   * PATCH /teacher/settings/appearance
   */
  async updateAppearanceSettings(data: Partial<AppearanceSettings>): Promise<TeacherSettings> {
    const res = await api.patch<{ data: TeacherSettings }>('/teacher/settings/appearance', data);
    return res.data.data;
  }

  /**
   * PATCH /teacher/settings/notifications
   */
  async updateNotificationSettings(data: Partial<NotificationSettings>): Promise<TeacherSettings> {
    const res = await api.patch<{ data: TeacherSettings }>('/teacher/settings/notifications', data);
    return res.data.data;
  }

  /**
   * PATCH /teacher/settings/privacy
   */
  async updatePrivacySettings(data: Partial<PrivacySettings>): Promise<TeacherSettings> {
    const res = await api.patch<{ data: TeacherSettings }>('/teacher/settings/privacy', data);
    return res.data.data;
  }

  /**
   * PATCH /teacher/settings/security
   */
  async updateSecuritySettings(data: UpdateSecurityInput): Promise<TeacherSettings> {
    const res = await api.patch<{ data: TeacherSettings }>('/teacher/settings/security', data);
    return res.data.data;
  }

  /**
   * GET /teacher/settings/sessions
   */
  async getSessions(): Promise<ActiveSession[]> {
    const res = await api.get<{ data: ActiveSession[] }>('/teacher/settings/sessions');
    return res.data.data;
  }

  /**
   * DELETE /teacher/settings/sessions/:id
   */
  async revokeSession(id: string): Promise<void> {
    await api.delete(`/teacher/settings/sessions/${id}`);
  }

  /**
   * DELETE /teacher/settings/sessions
   */
  async logoutAllDevices(): Promise<void> {
    await api.delete('/teacher/settings/sessions');
  }

  /**
   * POST /teacher/settings/export-data
   */
  async exportPersonalData(): Promise<any> {
    const res = await api.post<{ data: any }>('/teacher/settings/export-data');
    return res.data.data;
  }

  /**
   * POST /teacher/settings/deactivate-account
   */
  async deactivateAccount(password: string): Promise<void> {
    await api.post('/teacher/settings/deactivate-account', { password });
  }

  /**
   * POST /teacher/settings/delete-account
   */
  async deleteAccount(password: string): Promise<void> {
    await api.post('/teacher/settings/delete-account', { password });
  }
}

export const teacherSettingsService = new TeacherSettingsService();
export default teacherSettingsService;

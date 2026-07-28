import { Schema, Document } from 'mongoose';

export type LanguageOption = 'ar' | 'en' | 'fr';
export type DateFormatOption = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
export type TimeFormatOption = '12h' | '24h';
export type CurrencyOption = 'EGP' | 'USD' | 'EUR' | 'SAR' | 'AED';
export type DefaultDashboardOption = 'overview' | 'courses' | 'analytics' | 'earnings' | 'students';
export type VisibilityOption = 'public' | 'students_only' | 'private';
export type ThemeOption = 'light' | 'dark' | 'system';
export type TableDensityOption = 'compact' | 'comfortable' | 'spacious';

export interface IGeneralSettings {
  language: LanguageOption;
  timezone: string;
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  currency: CurrencyOption;
  defaultDashboard: DefaultDashboardOption;
  profileVisibility: VisibilityOption;
  autoSavePreferences: boolean;
}

export interface ISidebarPreferences {
  collapsed: boolean;
  position: 'left' | 'right';
}

export interface IAppearanceSettings {
  theme: ThemeOption;
  primaryColor: string;
  sidebarPreferences: ISidebarPreferences;
  tableDensity: TableDensityOption;
}

export interface INotificationSettings {
  inApp: boolean;
  email: boolean;
  push: boolean;
  marketing: boolean;
  assignment: boolean;
  quiz: boolean;
  enrollment: boolean;
  payment: boolean;
  review: boolean;
  systemAnnouncements: boolean;
}

export interface IPrivacySettings {
  publicProfile: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showSocialLinks: boolean;
  showInstructorStats: boolean;
  profileVisibility: VisibilityOption;
  searchEngineVisibility: boolean;
}

export interface ITrustedDevice {
  deviceId: string;
  deviceName: string;
  lastUsed: Date;
  ipAddress?: string;
}

export interface ISecuritySettings {
  twoFactorEnabled: boolean;
  trustedDevices: ITrustedDevice[];
  securityAlerts: boolean;
}

export interface ITeacherSettings {
  userId: Schema.Types.ObjectId;
  general: IGeneralSettings;
  appearance: IAppearanceSettings;
  notifications: INotificationSettings;
  privacy: IPrivacySettings;
  security: ISecuritySettings;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeacherSettingsDocument extends ITeacherSettings, Document {}

export interface ITeacherSession {
  userId: Schema.Types.ObjectId;
  token?: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActive: Date;
  expiresAt?: Date;
}

export interface ITeacherSessionDocument extends ITeacherSession, Document {}

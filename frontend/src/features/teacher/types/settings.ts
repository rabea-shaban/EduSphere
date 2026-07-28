export type LanguageOption = 'ar' | 'en' | 'fr';
export type DateFormatOption = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
export type TimeFormatOption = '12h' | '24h';
export type CurrencyOption = 'EGP' | 'USD' | 'EUR' | 'SAR' | 'AED';
export type DefaultDashboardOption = 'overview' | 'courses' | 'analytics' | 'earnings' | 'students';
export type VisibilityOption = 'public' | 'students_only' | 'private';
export type ThemeOption = 'light' | 'dark' | 'system';
export type TableDensityOption = 'compact' | 'comfortable' | 'spacious';

export interface GeneralSettings {
  language: LanguageOption;
  timezone: string;
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  currency: CurrencyOption;
  defaultDashboard: DefaultDashboardOption;
  profileVisibility: VisibilityOption;
  autoSavePreferences: boolean;
}

export interface SidebarPreferences {
  collapsed: boolean;
  position: 'left' | 'right';
}

export interface AppearanceSettings {
  theme: ThemeOption;
  primaryColor: string;
  sidebarPreferences: SidebarPreferences;
  tableDensity: TableDensityOption;
}

export interface NotificationSettings {
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

export interface PrivacySettings {
  publicProfile: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showSocialLinks: boolean;
  showInstructorStats: boolean;
  profileVisibility: VisibilityOption;
  searchEngineVisibility: boolean;
}

export interface TrustedDevice {
  deviceId: string;
  deviceName: string;
  lastUsed: string;
  ipAddress?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  trustedDevices: TrustedDevice[];
  securityAlerts: boolean;
}

export interface TeacherSettings {
  userId: string;
  general: GeneralSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
}

export interface UpdateSecurityInput {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  twoFactorEnabled?: boolean;
  securityAlerts?: boolean;
}

export interface ConfirmPasswordPayload {
  password: string;
  reason?: string;
}

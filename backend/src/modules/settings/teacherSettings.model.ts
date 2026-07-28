import { Schema, model } from 'mongoose';
import { ITeacherSettingsDocument } from './teacherSettings.interface';

const teacherSettingsSchema = new Schema<ITeacherSettingsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    general: {
      language: {
        type: String,
        enum: ['ar', 'en', 'fr'],
        default: 'ar',
      },
      timezone: {
        type: String,
        default: 'Africa/Cairo',
      },
      dateFormat: {
        type: String,
        enum: ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'],
        default: 'YYYY-MM-DD',
      },
      timeFormat: {
        type: String,
        enum: ['12h', '24h'],
        default: '12h',
      },
      currency: {
        type: String,
        enum: ['EGP', 'USD', 'EUR', 'SAR', 'AED'],
        default: 'EGP',
      },
      defaultDashboard: {
        type: String,
        enum: ['overview', 'courses', 'analytics', 'earnings', 'students'],
        default: 'overview',
      },
      profileVisibility: {
        type: String,
        enum: ['public', 'students_only', 'private'],
        default: 'public',
      },
      autoSavePreferences: {
        type: Boolean,
        default: true,
      },
    },
    appearance: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      primaryColor: {
        type: String,
        default: '#0B2D5B',
      },
      sidebarPreferences: {
        collapsed: { type: Boolean, default: false },
        position: { type: String, enum: ['left', 'right'], default: 'right' },
      },
      tableDensity: {
        type: String,
        enum: ['compact', 'comfortable', 'spacious'],
        default: 'comfortable',
      },
    },
    notifications: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
      assignment: { type: Boolean, default: true },
      quiz: { type: Boolean, default: true },
      enrollment: { type: Boolean, default: true },
      payment: { type: Boolean, default: true },
      review: { type: Boolean, default: true },
      systemAnnouncements: { type: Boolean, default: true },
    },
    privacy: {
      publicProfile: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      showSocialLinks: { type: Boolean, default: true },
      showInstructorStats: { type: Boolean, default: true },
      profileVisibility: {
        type: String,
        enum: ['public', 'students_only', 'private'],
        default: 'public',
      },
      searchEngineVisibility: { type: Boolean, default: true },
    },
    security: {
      twoFactorEnabled: { type: Boolean, default: false },
      trustedDevices: [
        {
          deviceId: { type: String, required: true },
          deviceName: { type: String, required: true },
          lastUsed: { type: Date, default: Date.now },
          ipAddress: { type: String },
        },
      ],
      securityAlerts: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

teacherSettingsSchema.index({ userId: 1 }, { unique: true });

export const TeacherSettings = model<ITeacherSettingsDocument>('TeacherSettings', teacherSettingsSchema);
export default TeacherSettings;

import { Schema, model } from 'mongoose';
import { ISettingsDocument } from './settings.interface';

const settingsSchema = new Schema<ISettingsDocument>(
  {
    organizationName: { type: String, required: [true, 'Organization name is required'], trim: true },
    logo: { type: String },
    favicon: { type: String },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    defaultLanguage: { type: String, default: 'en', trim: true },
    timezone: { type: String, default: 'UTC', trim: true },
    currency: { type: String, default: 'USD', trim: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', unique: true },
  },
  { timestamps: true }
);

export const Settings = model<ISettingsDocument>('Settings', settingsSchema);
export default Settings;

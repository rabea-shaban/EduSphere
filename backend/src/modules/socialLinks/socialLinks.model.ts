import { Schema, model } from 'mongoose';
import { ISocialLinksDocument } from './socialLinks.interface';

const socialLinksSchema = new Schema<ISocialLinksDocument>(
  {
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    youtube: { type: String, trim: true },
    x: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    website: { type: String, trim: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', unique: true },
  },
  { timestamps: true }
);

export const SocialLinks = model<ISocialLinksDocument>('SocialLinks', socialLinksSchema);
export default SocialLinks;

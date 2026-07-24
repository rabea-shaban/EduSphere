import { Schema, model } from 'mongoose';
import { IBannerDocument } from './banner.interface';

const bannerSchema = new Schema<IBannerDocument>(
  {
    title: { type: String, required: [true, 'Banner title is required'], trim: true },
    subtitle: { type: String, trim: true },
    image: { type: String, required: [true, 'Image URL is required'] },
    buttonText: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1 });
bannerSchema.index({ displayOrder: 1 });

export const Banner = model<IBannerDocument>('Banner', bannerSchema);
export default Banner;

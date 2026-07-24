import { Schema, model } from 'mongoose';
import { IPageDocument } from './page.interface';

const pageSchema = new Schema<IPageDocument>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, required: [true, 'Slug is required'], unique: true, trim: true, lowercase: true },
    content: { type: String, required: [true, 'Content is required'] },
    pageType: {
      type: String,
      enum: ['Home', 'About', 'Contact', 'Privacy Policy', 'Terms', 'Custom'],
      required: [true, 'Page type is required'],
      default: 'Custom',
    },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

pageSchema.index({ pageType: 1 });
pageSchema.index({ status: 1 });

export const Page = model<IPageDocument>('Page', pageSchema);
export default Page;

import { Schema, model } from 'mongoose';
import { ISeoDocument } from './seo.interface';

const seoSchema = new Schema<ISeoDocument>(
  {
    page: { type: String, required: [true, 'Page name or route is required'], trim: true },
    metaTitle: { type: String, required: [true, 'Meta title is required'], trim: true },
    metaDescription: { type: String, required: [true, 'Meta description is required'], trim: true },
    keywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, trim: true },
    ogImage: { type: String },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

seoSchema.index({ page: 1 });

export const Seo = model<ISeoDocument>('Seo', seoSchema);
export default Seo;

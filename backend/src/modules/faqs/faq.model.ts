import { Schema, model } from 'mongoose';
import { IFaqDocument } from './faq.interface';

const faqSchema = new Schema<IFaqDocument>(
  {
    question: { type: String, required: [true, 'Question is required'], trim: true },
    answer: { type: String, required: [true, 'Answer is required'], trim: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

faqSchema.index({ isActive: 1 });
faqSchema.index({ displayOrder: 1 });

export const Faq = model<IFaqDocument>('Faq', faqSchema);
export default Faq;

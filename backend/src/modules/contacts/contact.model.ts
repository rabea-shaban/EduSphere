import { Schema, model } from 'mongoose';
import { IContactDocument } from './contact.interface';

const contactSchema = new Schema<IContactDocument>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    message: { type: String, required: [true, 'Message content is required'] },
    status: { type: String, enum: ['New', 'In Progress', 'Closed'], default: 'New' },
  },
  { timestamps: true }
);

contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

export const Contact = model<IContactDocument>('Contact', contactSchema);
export default Contact;

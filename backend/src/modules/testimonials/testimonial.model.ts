import { Schema, model } from 'mongoose';
import { ITestimonialDocument } from './testimonial.interface';

const testimonialSchema = new Schema<ITestimonialDocument>(
  {
    studentName: { type: String, required: [true, 'Student name is required'], trim: true },
    studentImage: { type: String },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: [true, 'Comment is required'], trim: true },
    isApproved: { type: Boolean, default: false },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

testimonialSchema.index({ isApproved: 1 });
testimonialSchema.index({ courseId: 1 });

export const Testimonial = model<ITestimonialDocument>('Testimonial', testimonialSchema);
export default Testimonial;

import { Schema, model } from 'mongoose';
import { ITeacherApplicationDocument } from './teacherApplication.interface';

const teacherApplicationSchema = new Schema<ITeacherApplicationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: [true, 'Full name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    nationalId: { type: String, trim: true },
    subject: { type: String, required: [true, 'Main subject is required'], trim: true },
    stage: { type: String, required: [true, 'Educational stage is required'], trim: true },
    grades: [{ type: String, trim: true }],
    experienceYears: { type: Number, required: [true, 'Years of experience is required'], min: 0 },
    currentJob: { type: String, trim: true },
    bio: { type: String, trim: true },
    degree: { type: String, required: [true, 'Highest degree is required'], trim: true },
    university: { type: String, required: [true, 'University is required'], trim: true },
    graduationYear: { type: Number, required: [true, 'Graduation year is required'] },
    profileImage: { type: String, trim: true },
    nationalIdFront: { type: String, trim: true },
    nationalIdBack: { type: String, trim: true },
    certificateDoc: { type: String, trim: true },
    cvUrl: { type: String, trim: true },
    demoVideoUrl: { type: String, trim: true },
    socialLinks: {
      linkedin: { type: String, trim: true },
      facebook: { type: String, trim: true },
      youtube: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Pending', 'UnderReview', 'Approved', 'Rejected', 'NeedsChanges', 'Suspended'],
      default: 'Pending',
    },
    isDraft: { type: Boolean, default: false },
    submittedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
    changesRequested: { type: String, trim: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

teacherApplicationSchema.index({ email: 1 });
teacherApplicationSchema.index({ status: 1 });
teacherApplicationSchema.index({ userId: 1 });
teacherApplicationSchema.index({ isDraft: 1 });
teacherApplicationSchema.index({ createdAt: -1 });

export const TeacherApplication = model<ITeacherApplicationDocument>(
  'TeacherApplication',
  teacherApplicationSchema
);

export default TeacherApplication;

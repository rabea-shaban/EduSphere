import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import { ISubjectDocument } from './subject.interface';

const subjectSchema = new Schema<ISubjectDocument>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    educationStage: {
      type: String,
      enum: ['Primary', 'Preparatory', 'Secondary'],
      required: [true, 'Education stage is required'],
    },
    grades: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Grade',
      },
    ],
    teacherIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subjectSchema.index({ name: 1 }, { unique: true });
subjectSchema.index({ slug: 1 }, { unique: true });
subjectSchema.index({ educationStage: 1 });
subjectSchema.index({ isActive: 1 });

// Slugify pre-save hook
subjectSchema.pre('save', function (this: ISubjectDocument, next: any) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Subject = model<ISubjectDocument>('Subject', subjectSchema);
export default Subject;

import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import { ILessonDocument } from './lesson.interface';

const lessonSchema = new Schema<ILessonDocument>(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
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
    unitId: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'Unit reference is required'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    lessonType: {
      type: String,
      enum: ['Video', 'PDF', 'Quiz', 'Assignment', 'Text'],
      required: [true, 'Lesson type is required'],
    },
    duration: {
      type: Number,
      default: 0, // in minutes
    },
    order: {
      type: Number,
      required: [true, 'Lesson order is required'],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
lessonSchema.index({ unitId: 1 });
lessonSchema.index({ courseId: 1 });
lessonSchema.index({ order: 1 });
lessonSchema.index({ unitId: 1, order: 1 });

// Slugify pre-save hook
lessonSchema.pre('save', function (this: ILessonDocument, next: any) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Lesson = model<ILessonDocument>('Lesson', lessonSchema);
export default Lesson;

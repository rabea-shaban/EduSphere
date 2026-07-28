import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import { ILessonDocument } from './lesson.interface';

const lessonSchema = new Schema<ILessonDocument>(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [200, 'Lesson title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      trim: true,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      index: true,
    },
    unitId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
      index: true,
    },
    lessonType: {
      type: String,
      enum: ['Video', 'Article', 'Live', 'PDF', 'Resource', 'Interactive', 'Quiz', 'Assignment', 'Text'],
      default: 'Video',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Scheduled', 'Hidden', 'Archived'],
      default: 'Published',
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private', 'Enrolled'],
      default: 'Enrolled',
    },
    duration: {
      type: Number,
      default: 0, // in minutes
      min: [0, 'Duration must be positive'],
    },
    estimatedStudyTime: {
      type: Number,
      default: 0, // in minutes
      min: [0, 'Estimated study time must be positive'],
    },
    order: {
      type: Number,
      required: [true, 'Lesson order is required'],
      min: [1, 'Order must be at least 1'],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    attachmentUrl: {
      type: String,
      trim: true,
    },
    completionRequirement: {
      type: String,
      enum: ['Watch75', 'Watch100', 'PassQuiz', 'SubmitAssignment', 'Manual'],
      default: 'Watch75',
    },
    releaseDate: {
      type: Date,
    },
    prerequisites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
lessonSchema.index({ sectionId: 1, order: 1 });
lessonSchema.index({ unitId: 1, order: 1 });
lessonSchema.index({ courseId: 1, isDeleted: 1 });
lessonSchema.index({ sectionId: 1, status: 1 });
lessonSchema.index({ courseId: 1, order: 1 });

// Soft-delete pre-find hook
// Using $ne: true so documents where isDeleted is undefined are also included
lessonSchema.pre(/^find/, function (this: any) {
  if (!this.getOptions().withDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
});

// Pre-save hook for slug & sectionId/unitId sync
lessonSchema.pre('save', function (this: ILessonDocument) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.floor(1000 + Math.random() * 9000);
  }
  // Sync sectionId and unitId
  if (this.sectionId && !this.unitId) {
    this.unitId = this.sectionId;
  } else if (this.unitId && !this.sectionId) {
    this.sectionId = this.unitId;
  }
});

export const Lesson = model<ILessonDocument>('Lesson', lessonSchema);
export default Lesson;

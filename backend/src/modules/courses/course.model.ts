import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import { ICourseDocument } from './course.interface';

const courseSchema = new Schema<ICourseDocument>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
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
    thumbnail: {
      type: String,
      default: 'https://res.cloudinary.com/dx594/image/upload/v1/defaults/course-thumbnail.png',
    },
    previewVideo: {
      type: String,
      trim: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: false,
    },
    grade: {
      type: Schema.Types.ObjectId,
      ref: 'Grade',
      required: false,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: false,
    },
    term: {
      type: Schema.Types.ObjectId,
      ref: 'Term',
      required: false,
    },
    language: {
      type: String,
      default: 'arabic',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator: function (this: any, value: number) {
          return value <= this.price;
        },
        message: 'Discount price must be less than or equal to original price',
      },
    },
    duration: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    objectives: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
courseSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { default_language: 'none', language_override: 'dummy_language_override_field' }
);
courseSchema.index({ teacher: 1, status: 1 });
courseSchema.index({ academicYear: 1 });
courseSchema.index({ grade: 1 });
courseSchema.index({ subject: 1 });
courseSchema.index({ term: 1 });
courseSchema.index({ status: 1, createdAt: -1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ isFree: 1 });

// Pre-save slugification hook
courseSchema.pre('save', function (this: ICourseDocument) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

export const Course = model<ICourseDocument>('Course', courseSchema);

// Safely drop existing text index if created with old options
Course.collection.dropIndex('title_text_description_text_tags_text').catch(() => {});

export default Course;

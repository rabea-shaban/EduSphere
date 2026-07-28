import { Schema, model, Document, Types } from 'mongoose';

export interface ISocialLinks {
  website?: string;
  linkedIn?: string;
  gitHub?: string;
  facebook?: string;
  instagram?: string;
  youTube?: string;
  xTwitter?: string;
}

export interface IProfessionalInfo {
  yearsOfExperience: number;
  specialization: string;
  skills: string[];
  certifications: string[];
  education: string[];
  portfolio?: string;
  achievements?: string[];
  languages: string[];
}

export interface ITeacherProfile {
  userId: Types.ObjectId;
  displayName?: string;
  headline?: string;
  bio?: string;
  coverImage?: string;
  location?: string;
  country?: string;
  city?: string;
  timezone?: string;
  professionalInfo: IProfessionalInfo;
  socialLinks: ISocialLinks;
  completionPercentage: number;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeacherProfileDocument extends ITeacherProfile, Document {}

const teacherProfileSchema = new Schema<ITeacherProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    headline: {
      type: String,
      trim: true,
      maxLength: [150, 'Headline cannot exceed 150 characters'],
    },
    bio: {
      type: String,
      trim: true,
      maxLength: [3000, 'Bio cannot exceed 3000 characters'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    },
    location: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'مصر',
    },
    city: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: 'Africa/Cairo',
    },
    professionalInfo: {
      yearsOfExperience: {
        type: Number,
        default: 1,
        min: 0,
      },
      specialization: {
        type: String,
        trim: true,
        default: 'معلم عام',
      },
      skills: [
        {
          type: String,
          trim: true,
        },
      ],
      certifications: [
        {
          type: String,
          trim: true,
        },
      ],
      education: [
        {
          type: String,
          trim: true,
        },
      ],
      portfolio: {
        type: String,
        trim: true,
      },
      achievements: [
        {
          type: String,
          trim: true,
        },
      ],
      languages: [
        {
          type: String,
          trim: true,
          default: 'العربية',
        },
      ],
    },
    socialLinks: {
      website: { type: String, trim: true },
      linkedIn: { type: String, trim: true },
      gitHub: { type: String, trim: true },
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      youTube: { type: String, trim: true },
      xTwitter: { type: String, trim: true },
    },
    completionPercentage: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

teacherProfileSchema.index({ 'professionalInfo.specialization': 1 });

export const TeacherProfile = model<ITeacherProfileDocument>('TeacherProfile', teacherProfileSchema);
export default TeacherProfile;

export interface SocialLinks {
  website?: string;
  linkedIn?: string;
  gitHub?: string;
  facebook?: string;
  instagram?: string;
  youTube?: string;
  xTwitter?: string;
}

export interface ProfessionalInfo {
  yearsOfExperience: number;
  specialization: string;
  skills: string[];
  certifications: string[];
  education: string[];
  portfolio?: string;
  achievements?: string[];
  languages: string[];
}

export interface TeacherUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface TeacherProfileDetails {
  displayName: string;
  headline?: string;
  bio?: string;
  coverImage?: string;
  location?: string;
  country?: string;
  city?: string;
  timezone?: string;
  professionalInfo: ProfessionalInfo;
  socialLinks: SocialLinks;
  completionPercentage: number;
  isPublic: boolean;
}

export interface ProfileCompleteness {
  completionPercentage: number;
  completedFields: string[];
  missingFields: string[];
  recommendedImprovements: string[];
}

export interface ProfileAnalyticsData {
  coursesPublished: number;
  studentsEnrolled: number;
  averageRating: number;
  totalReviews: number;
  totalRevenue: number;
}

export interface FullTeacherProfileResponse {
  user: TeacherUser;
  profile: TeacherProfileDetails;
  completeness: ProfileCompleteness;
  analytics: ProfileAnalyticsData;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword?: string;
}

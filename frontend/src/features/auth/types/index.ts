export type EducationalStage =
  | "primary"
  | "prep"
  | "secondary1"
  | "secondary2"
  | "secondary3"
  | "baccalaureate"     // نظام البكالوريا الجديد
  | "cs_track";          // مسار علوم الحاسب وتكنولوجيا المعلومات

export type EducationSystem =
  | "general"            // تعليم عام
  | "azhari"             // تعليم أزهري
  | "baccalaureate";     // نظام البكالوريا

export type AcademicStream =
  | "general"
  | "scientific_science" // علمي علوم
  | "scientific_math"    // علمي رياضة
  | "literary"           // أدبي
  | "computer_science"   // مسار علوم الحاسب والبرمجة
  | "azhari_sharia";     // شرعي وأصول دين - أزهري

export type UserRole = "student" | "parent" | "teacher";

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface ProfileSetupData {
  avatarUrl?: string;
  role: UserRole;
  system: EducationSystem;
  stage: EducationalStage;
  stream?: AcademicStream;
  subjects: string[];
  dailyStudyHours: number;
  targetPercentage: number;
  notificationsEnabled: boolean;
}

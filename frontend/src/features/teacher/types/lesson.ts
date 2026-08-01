export type LessonType =
  | 'Video'
  | 'Audio'
  | 'Article'
  | 'Live'
  | 'PDF'
  | 'Resource'
  | 'Interactive'
  | 'Quiz'
  | 'Assignment'
  | 'Text';

export type LessonStatus = 'Draft' | 'Published' | 'Scheduled' | 'Hidden' | 'Archived';
export type LessonVisibility = 'Public' | 'Private' | 'Enrolled';
export type CompletionRequirement = 'Watch75' | 'Watch100' | 'PassQuiz' | 'SubmitAssignment' | 'Manual';

export interface ApiLesson {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  content?: string;
  sectionId?: string | { _id: string; title: string; order: number };
  unitId?: string | { _id: string; title: string; order: number };
  courseId: string | { _id: string; title: string; slug: string };
  lessonType: LessonType;
  status: LessonStatus;
  visibility: LessonVisibility;
  duration: number; // in minutes
  estimatedStudyTime?: number;
  order: number;
  isPreview: boolean;
  isPublished: boolean;
  videoUrl?: string;
  audioUrl?: string;
  attachmentUrl?: string;
  completionRequirement?: CompletionRequirement;
  releaseDate?: string;
  prerequisites?: string[];
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonInput {
  title: string;
  description?: string;
  shortDescription?: string;
  content?: string;
  sectionId?: string;
  unitId?: string;
  courseId?: string;
  lessonType?: LessonType;
  status?: LessonStatus;
  visibility?: LessonVisibility;
  duration?: number;
  estimatedStudyTime?: number;
  order?: number;
  isPreview?: boolean;
  isPublished?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  attachmentUrl?: string;
  completionRequirement?: CompletionRequirement;
  releaseDate?: string;
  prerequisites?: string[];
}

export interface UpdateLessonInput extends Partial<CreateLessonInput> {}

export interface ReorderLessonItem {
  id: string;
  order: number;
}

export interface ReorderLessonsInput {
  sectionId: string;
  items: ReorderLessonItem[];
}

export interface MoveLessonInput {
  targetSectionId: string;
  order?: number;
}

export interface LessonFilters {
  search?: string;
  lessonType?: LessonType | 'ALL' | '';
  status?: LessonStatus | 'ALL' | '';
  sectionId?: string;
  courseId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// ─── Section Types ────────────────────────────────────────────────────────────
export type SectionStatus = 'Draft' | 'Published' | 'Hidden' | 'Archived';
export type SectionVisibility = 'Public' | 'Private' | 'Enrolled';
export type CompletionRule = 'AllLessons' | 'MinimumLessons' | 'AnyLesson';

export interface ApiSection {
  _id: string;
  title: string;
  description?: string;
  courseId: string | { _id: string; title: string; slug: string };
  order: number;
  status: SectionStatus;
  visibility: SectionVisibility;
  isPublished: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  estimatedDuration: number;
  totalLessons: number;
  completionRule: CompletionRule;
  minimumLessonsRequired: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionInput {
  title: string;
  description?: string;
  order?: number;
  status?: SectionStatus;
  visibility?: SectionVisibility;
  isPublished?: boolean;
  estimatedDuration?: number;
  completionRule?: CompletionRule;
  minimumLessonsRequired?: number;
}

export interface UpdateSectionInput extends Partial<CreateSectionInput> {}

export interface ReorderSectionItem {
  id: string;
  order: number;
}

export interface ReorderSectionsInput {
  courseId: string;
  items: ReorderSectionItem[];
}

export interface SectionFilters {
  search?: string;
  status?: SectionStatus | '';
  sort?: string;
  page?: number;
  limit?: number;
}

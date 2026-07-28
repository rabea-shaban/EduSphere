export interface SearchQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  status?: string;
  category?: string;
  folder?: string;
  level?: string;
  sort?: string;
  dateFrom?: string;
  dateTo?: string;
  dateShortcut?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth';
  deleted?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  thumbnail?: string;
  url: string;
  type: 'course' | 'lesson' | 'quiz' | 'assignment' | 'student' | 'file' | 'review';
}

export interface GlobalSearchResponse {
  courses: SearchResultItem[];
  lessons: SearchResultItem[];
  quizzes: SearchResultItem[];
  assignments: SearchResultItem[];
  files: SearchResultItem[];
  reviews: SearchResultItem[];
  totalMatches: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

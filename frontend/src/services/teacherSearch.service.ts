import api from './api';
import type { GlobalSearchResponse } from '@/features/teacher/types/search';

export class TeacherSearchService {
  /**
   * Perform Global Search across all teacher dashboard modules
   */
  async globalSearch(q: string): Promise<GlobalSearchResponse> {
    if (!q || q.trim().length === 0) {
      return {
        courses: [],
        lessons: [],
        quizzes: [],
        assignments: [],
        files: [],
        reviews: [],
        totalMatches: 0,
      };
    }

    const res = await api.get<{ data: GlobalSearchResponse }>(`/teacher/search/global?q=${encodeURIComponent(q)}`);
    return res.data.data;
  }

  /**
   * Get live search autocomplete suggestions
   */
  async getSuggestions(q: string): Promise<string[]> {
    if (!q || q.trim().length < 2) return [];

    const res = await api.get<{ data: string[] }>(`/teacher/search/suggestions?q=${encodeURIComponent(q)}`);
    return res.data.data;
  }
}

export const teacherSearchService = new TeacherSearchService();
export default teacherSearchService;

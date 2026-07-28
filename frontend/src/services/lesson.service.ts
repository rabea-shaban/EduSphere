import api from "./api";
import type {
  ApiLesson,
  CreateLessonInput,
  UpdateLessonInput,
  ReorderLessonsInput,
  MoveLessonInput,
  LessonFilters,
} from "@/features/teacher/types/lesson";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface LessonsListResponse {
  lessons: ApiLesson[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const lessonService = {
  /**
   * Get all lessons inside a section.
   */
  async getLessonsBySection(
    sectionId: string,
    filters?: LessonFilters
  ): Promise<LessonsListResponse> {
    const response = await api.get<ApiResponse<LessonsListResponse>>(
      `/teacher/sections/${sectionId}/lessons`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get a single lesson by ID.
   */
  async getLessonById(id: string): Promise<ApiLesson> {
    const response = await api.get<ApiResponse<ApiLesson>>(
      `/teacher/lessons/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new lesson under a section.
   */
  async createLesson(
    sectionId: string,
    data: CreateLessonInput
  ): Promise<ApiLesson> {
    const response = await api.post<ApiResponse<ApiLesson>>(
      `/teacher/sections/${sectionId}/lessons`,
      data
    );
    return response.data.data;
  },

  /**
   * Update a lesson (full or partial).
   */
  async updateLesson(
    id: string,
    data: UpdateLessonInput
  ): Promise<ApiLesson> {
    const response = await api.patch<ApiResponse<ApiLesson>>(
      `/teacher/lessons/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Soft-delete a lesson.
   */
  async deleteLesson(id: string): Promise<void> {
    await api.delete(`/teacher/lessons/${id}`);
  },

  /**
   * Archive a lesson.
   */
  async archiveLesson(id: string): Promise<ApiLesson> {
    const response = await api.patch<ApiResponse<ApiLesson>>(
      `/teacher/lessons/${id}/archive`
    );
    return response.data.data;
  },

  /**
   * Restore a soft-deleted or archived lesson.
   */
  async restoreLesson(id: string): Promise<ApiLesson> {
    const response = await api.patch<ApiResponse<ApiLesson>>(
      `/teacher/lessons/${id}/restore`
    );
    return response.data.data;
  },

  /**
   * Duplicate a lesson inside the same section.
   */
  async duplicateLesson(id: string): Promise<ApiLesson> {
    const response = await api.post<ApiResponse<ApiLesson>>(
      `/teacher/lessons/${id}/duplicate`
    );
    return response.data.data;
  },

  /**
   * Bulk reorder lessons in a section.
   */
  async reorderLessons(data: ReorderLessonsInput): Promise<void> {
    await api.patch(`/teacher/lessons/reorder`, data);
  },

  /**
   * Move a lesson to another section.
   */
  async moveLesson(id: string, data: MoveLessonInput): Promise<ApiLesson> {
    const response = await api.patch<ApiResponse<ApiLesson>>(
      `/teacher/lessons/${id}/move`,
      data
    );
    return response.data.data;
  },

  /**
   * Search lessons across all courses/sections belonging to teacher.
   */
  async searchLessons(filters?: LessonFilters): Promise<LessonsListResponse> {
    const response = await api.get<ApiResponse<LessonsListResponse>>(
      `/teacher/lessons`,
      { params: filters }
    );
    return response.data.data;
  },
};

export default lessonService;

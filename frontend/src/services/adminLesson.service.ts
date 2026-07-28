import api from "./api";

export interface AdminLessonItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  lessonType: "Video" | "Article" | "Live" | "PDF" | "Resource" | "Interactive" | "Quiz" | "Assignment" | "Text";
  status: "Draft" | "Published" | "Scheduled" | "Hidden" | "Archived";
  visibility: "Public" | "Private" | "Enrolled";
  duration: number;
  order: number;
  isPreview: boolean;
  isPublished: boolean;
  isDeleted: boolean;
  videoUrl?: string;
  attachmentUrl?: string;
  courseId: { _id: string; title: string; slug: string } | string;
  sectionId?: { _id: string; title: string; order: number } | string;
  unitId?: { _id: string; title: string; order: number } | string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLessonFilters {
  page?: number;
  limit?: number;
  search?: string;
  lessonType?: string;
  status?: string;
  courseId?: string;
  sectionId?: string;
  sort?: string;
}

export interface AdminLessonsListResponse {
  lessons: AdminLessonItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminLessonService = {
  async getLessons(params: AdminLessonFilters = {}): Promise<AdminLessonsListResponse> {
    const response = await api.get<{ success: boolean; data: AdminLessonsListResponse }>("/lessons", {
      params,
    });
    return response.data.data;
  },

  async getLessonById(id: string): Promise<AdminLessonItem> {
    const response = await api.get<{ success: boolean; data: AdminLessonItem }>(`/lessons/${id}`);
    return response.data.data;
  },

  async updateLesson(id: string, data: Partial<AdminLessonItem>): Promise<AdminLessonItem> {
    const response = await api.patch<{ success: boolean; data: AdminLessonItem }>(`/lessons/${id}`, data);
    return response.data.data;
  },

  async deleteLesson(id: string): Promise<void> {
    await api.delete(`/lessons/${id}`);
  },

  async archiveLesson(id: string): Promise<AdminLessonItem> {
    const response = await api.patch<{ success: boolean; data: AdminLessonItem }>(`/lessons/${id}/archive`);
    return response.data.data;
  },

  async restoreLesson(id: string): Promise<AdminLessonItem> {
    const response = await api.patch<{ success: boolean; data: AdminLessonItem }>(`/lessons/${id}/restore`);
    return response.data.data;
  },
};

export default adminLessonService;

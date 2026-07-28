import api from "./api";
import type {
  ApiSection,
  CreateSectionInput,
  UpdateSectionInput,
  ReorderSectionsInput,
  SectionFilters,
} from "@/features/teacher/types/section";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface SectionsListResponse {
  sections: ApiSection[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const sectionService = {
  /**
   * Get all sections for a specific course.
   */
  async getSectionsByCourse(
    courseId: string,
    filters?: SectionFilters
  ): Promise<SectionsListResponse> {
    const response = await api.get<ApiResponse<SectionsListResponse>>(
      `/teacher/courses/${courseId}/sections`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get a single section by ID.
   */
  async getSectionById(id: string): Promise<ApiSection> {
    const response = await api.get<ApiResponse<ApiSection>>(
      `/teacher/sections/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new section under a course.
   */
  async createSection(
    courseId: string,
    data: CreateSectionInput
  ): Promise<ApiSection> {
    const response = await api.post<ApiResponse<ApiSection>>(
      `/teacher/courses/${courseId}/sections`,
      data
    );
    return response.data.data;
  },

  /**
   * Update a section (full or partial).
   */
  async updateSection(
    id: string,
    data: UpdateSectionInput
  ): Promise<ApiSection> {
    const response = await api.patch<ApiResponse<ApiSection>>(
      `/teacher/sections/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Soft-delete a section.
   */
  async deleteSection(id: string): Promise<void> {
    await api.delete(`/teacher/sections/${id}`);
  },

  /**
   * Archive a section.
   */
  async archiveSection(id: string): Promise<ApiSection> {
    const response = await api.patch<ApiResponse<ApiSection>>(
      `/teacher/sections/${id}/archive`
    );
    return response.data.data;
  },

  /**
   * Restore a soft-deleted or archived section.
   */
  async restoreSection(id: string): Promise<ApiSection> {
    const response = await api.patch<ApiResponse<ApiSection>>(
      `/teacher/sections/${id}/restore`
    );
    return response.data.data;
  },

  /**
   * Duplicate a section (clones section + all its lessons).
   */
  async duplicateSection(id: string): Promise<ApiSection> {
    const response = await api.post<ApiResponse<ApiSection>>(
      `/teacher/sections/${id}/duplicate`
    );
    return response.data.data;
  },

  /**
   * Bulk reorder sections.
   */
  async reorderSections(data: ReorderSectionsInput): Promise<void> {
    await api.patch(`/teacher/sections/reorder`, data);
  },

  /**
   * Search sections across all teacher courses.
   */
  async searchSections(filters?: SectionFilters & { courseId?: string }): Promise<SectionsListResponse> {
    const response = await api.get<ApiResponse<SectionsListResponse>>(
      `/teacher/sections`,
      { params: filters }
    );
    return response.data.data;
  },
};

export default sectionService;

import api from "./api";
import type {
  ApiAssignment,
  ApiSubmission,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  GradeSubmissionInput,
  AssignmentAnalytics,
  AssignmentFilters,
} from "@/features/teacher/types/assignment";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface AssignmentsListResponse {
  assignments: ApiAssignment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SubmissionsListResponse {
  submissions: ApiSubmission[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const assignmentService = {
  /**
   * Get all teacher assignments with filters and pagination.
   */
  async getAssignments(filters?: AssignmentFilters): Promise<AssignmentsListResponse> {
    const response = await api.get<ApiResponse<AssignmentsListResponse>>(
      `/teacher/assignments`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get single assignment by ID.
   */
  async getAssignmentById(id: string): Promise<ApiAssignment> {
    const response = await api.get<ApiResponse<ApiAssignment>>(
      `/teacher/assignments/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new assignment.
   */
  async createAssignment(data: CreateAssignmentInput): Promise<ApiAssignment> {
    const response = await api.post<ApiResponse<ApiAssignment>>(
      `/teacher/assignments`,
      data
    );
    return response.data.data;
  },

  /**
   * Update assignment settings.
   */
  async updateAssignment(id: string, data: UpdateAssignmentInput): Promise<ApiAssignment> {
    const response = await api.patch<ApiResponse<ApiAssignment>>(
      `/teacher/assignments/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Soft-delete an assignment.
   */
  async deleteAssignment(id: string): Promise<void> {
    await api.delete(`/teacher/assignments/${id}`);
  },

  /**
   * Publish an assignment.
   */
  async publishAssignment(id: string): Promise<ApiAssignment> {
    const response = await api.patch<ApiResponse<ApiAssignment>>(
      `/teacher/assignments/${id}/publish`
    );
    return response.data.data;
  },

  /**
   * Unpublish an assignment (Draft).
   */
  async unpublishAssignment(id: string): Promise<ApiAssignment> {
    const response = await api.patch<ApiResponse<ApiAssignment>>(
      `/teacher/assignments/${id}/unpublish`
    );
    return response.data.data;
  },

  /**
   * Archive an assignment.
   */
  async archiveAssignment(id: string): Promise<ApiAssignment> {
    const response = await api.patch<ApiResponse<ApiAssignment>>(
      `/teacher/assignments/${id}/archive`
    );
    return response.data.data;
  },

  /**
   * Restore an archived/soft-deleted assignment.
   */
  async restoreAssignment(id: string): Promise<ApiAssignment> {
    const response = await api.patch<ApiResponse<ApiAssignment>>(
      `/teacher/assignments/${id}/restore`
    );
    return response.data.data;
  },

  /**
   * Duplicate an assignment.
   */
  async duplicateAssignment(id: string): Promise<ApiAssignment> {
    const response = await api.post<ApiResponse<ApiAssignment>>(
      `/teacher/assignments/${id}/duplicate`
    );
    return response.data.data;
  },

  /**
   * Get submissions under an assignment.
   */
  async getAssignmentSubmissions(
    id: string,
    params?: { page?: number; limit?: number; status?: string }
  ): Promise<SubmissionsListResponse> {
    const response = await api.get<ApiResponse<SubmissionsListResponse>>(
      `/teacher/assignments/${id}/submissions`,
      { params }
    );
    return response.data.data;
  },

  /**
   * Get single submission details.
   */
  async getSubmissionById(id: string): Promise<ApiSubmission> {
    const response = await api.get<ApiResponse<ApiSubmission>>(
      `/teacher/submissions/${id}`
    );
    return response.data.data;
  },

  /**
   * Grade a submission.
   */
  async gradeSubmission(id: string, data: GradeSubmissionInput): Promise<ApiSubmission> {
    const response = await api.patch<ApiResponse<ApiSubmission>>(
      `/teacher/submissions/${id}/grade`,
      data
    );
    return response.data.data;
  },

  /**
   * Add feedback to submission.
   */
  async addFeedback(
    id: string,
    data: { feedback?: string; privateNotes?: string }
  ): Promise<ApiSubmission> {
    const response = await api.patch<ApiResponse<ApiSubmission>>(
      `/teacher/submissions/${id}/feedback`,
      data
    );
    return response.data.data;
  },

  /**
   * Get assignment analytics.
   */
  async getAssignmentAnalytics(id: string): Promise<AssignmentAnalytics> {
    const response = await api.get<ApiResponse<AssignmentAnalytics>>(
      `/teacher/assignments/${id}/analytics`
    );
    return response.data.data;
  },
};

export default assignmentService;

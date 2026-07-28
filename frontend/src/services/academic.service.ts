import api from "./api";
import { ApiResponse } from "@/features/dashboard/types/api";

export type EducationStageType =
  | "Primary"
  | "Preparatory"
  | "Secondary"
  | "Azhar"
  | "Baccalaureate"
  | "ComputerScience";

export interface AcademicGrade {
  _id: string;
  name: {
    ar: string;
    en: string;
  };
  order: number;
  educationStage: EducationStageType;
  description?: string;
  isActive: boolean;
  subjectsCount?: number;
  coursesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicTerm {
  _id: string;
  name: string;
  order: number;
  isActive: boolean;
}

export interface AcademicSubject {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  educationStage: EducationStageType;
  grades?: string[];
  isActive: boolean;
}

export interface GetGradesParams {
  page?: number;
  limit?: number;
  search?: string;
  educationStage?: string;
  isActive?: boolean;
  sort?: string;
}

export interface CreateGradeDTO {
  name: {
    ar: string;
    en: string;
  };
  order: number;
  educationStage: EducationStageType;
  description?: string;
  isActive?: boolean;
}

export interface UpdateGradeDTO {
  name?: {
    ar?: string;
    en?: string;
  };
  order?: number;
  educationStage?: EducationStageType;
  description?: string;
  isActive?: boolean;
}

export const academicService = {
  /**
   * Fetch all academic grades with filters
   */
  async getGrades(params?: GetGradesParams): Promise<{
    grades: AcademicGrade[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const response = await api.get<ApiResponse<{ grades: AcademicGrade[]; pagination: any }>>(
      "/grades",
      { params }
    );
    return response.data.data;
  },

  /**
   * Create a new Grade / Track
   */
  async createGrade(data: CreateGradeDTO): Promise<AcademicGrade> {
    const response = await api.post<ApiResponse<AcademicGrade>>("/grades", data);
    return response.data.data;
  },

  /**
   * Update an existing Grade / Track
   */
  async updateGrade(id: string, data: UpdateGradeDTO): Promise<AcademicGrade> {
    const response = await api.patch<ApiResponse<AcademicGrade>>(`/grades/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a Grade
   */
  async deleteGrade(id: string): Promise<void> {
    await api.delete(`/grades/${id}`);
  },

  /**
   * Toggle Grade Active Status
   */
  async toggleGradeStatus(id: string, isActive: boolean): Promise<AcademicGrade> {
    const endpoint = isActive ? `/grades/${id}/activate` : `/grades/${id}/deactivate`;
    const response = await api.patch<ApiResponse<AcademicGrade>>(endpoint);
    return response.data.data;
  },

  /**
   * Fetch Terms
   */
  async getTerms(): Promise<AcademicTerm[]> {
    const response = await api.get<ApiResponse<any>>("/terms");
    const data = response.data.data;
    return Array.isArray(data) ? data : data?.terms || [];
  },

  /**
   * Fetch Subjects
   */
  async getSubjects(params?: { educationStage?: string }): Promise<AcademicSubject[]> {
    const response = await api.get<ApiResponse<any>>("/subjects", { params });
    const data = response.data.data;
    return Array.isArray(data) ? data : data?.subjects || [];
  },
};

export default academicService;

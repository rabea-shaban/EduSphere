import api from "./api";
import { ApiResponse } from "@/features/dashboard/types/api";

export interface TeacherApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  nationalId?: string;
  subject: string;
  stage: string;
  grades?: string[];
  experienceYears: number;
  currentJob?: string;
  bio?: string;
  degree: string;
  university: string;
  graduationYear: number;
  profileImage?: string;
  nationalIdFront?: string;
  nationalIdBack?: string;
  certificateDoc?: string;
  cvUrl?: string;
  demoVideoUrl?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
  };
}

export interface ApiTeacherApplication extends TeacherApplicationInput {
  _id: string;
  status: "Pending" | "UnderReview" | "Approved" | "Rejected";
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const teacherService = {
  /**
   * Submit a new teacher application.
   */
  async submitApplication(data: TeacherApplicationInput): Promise<ApiTeacherApplication> {
    const response = await api.post<ApiResponse<ApiTeacherApplication>>("/teacher-applications", data);
    return response.data.data;
  },

  /**
   * Fetch current user's teacher application status.
   */
  async getMyApplicationStatus(): Promise<ApiTeacherApplication | null> {
    const response = await api.get<ApiResponse<ApiTeacherApplication | null>>("/teacher-applications/my-status");
    return response.data.data;
  },

  /**
   * Public search status by Email, National ID, or Phone.
   */
  async checkStatusByQuery(query: string): Promise<ApiTeacherApplication> {
    const response = await api.post<ApiResponse<ApiTeacherApplication>>("/teacher-applications/check-status", { query });
    return response.data.data;
  },

  /**
   * Fetch all applications for Admin review.
   */
  async getAllApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ applications: ApiTeacherApplication[]; pagination: any }> {
    const response = await api.get<ApiResponse<{ applications: ApiTeacherApplication[]; pagination: any }>>("/teacher-applications", {
      params,
    });
    return response.data.data;
  },

  /**
   * Fetch application details by ID (Admin).
   */
  async getApplicationById(id: string): Promise<ApiTeacherApplication> {
    const response = await api.get<ApiResponse<ApiTeacherApplication>>(`/teacher-applications/${id}`);
    return response.data.data;
  },

  /**
   * Approve or Reject an application (Admin).
   */
  async updateApplicationStatus(
    id: string,
    status: "Approved" | "Rejected" | "UnderReview" | "Pending",
    rejectionReason?: string
  ): Promise<ApiTeacherApplication> {
    const response = await api.patch<ApiResponse<ApiTeacherApplication>>(`/teacher-applications/${id}/status`, {
      status,
      rejectionReason,
    });
    return response.data.data;
  },

  /**
   * Fetch Teacher Dashboard Analytics Data.
   */
  async getDashboardData(): Promise<any> {
    const response = await api.get<ApiResponse<any>>("/dashboard/teacher");
    return response.data.data;
  },

  /**
   * Create a new Course.
   */
  async createCourse(courseData: any): Promise<any> {
    const response = await api.post<ApiResponse<any>>("/courses", courseData);
    return response.data.data;
  },

  /**
   * Request earnings withdrawal.
   */
  async requestWithdrawal(data: { amount: number; payoutMethod: string; accountDetails: string }): Promise<any> {
    const response = await api.post<ApiResponse<any>>("/payments/withdraw", data);
    return response.data.data;
  },
};

export default teacherService;

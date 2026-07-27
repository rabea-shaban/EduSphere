import api from "./api";

export interface TeacherApplicationItem {
  _id: string;
  userId?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    phone?: string;
  };
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
  status: "Pending" | "UnderReview" | "Approved" | "Rejected";
  rejectionReason?: string;
  reviewedBy?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetApplicationsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  stage?: string;
  subject?: string;
  experienceYears?: number;
  startDate?: string;
  endDate?: string;
}

export interface GetApplicationsResponse {
  applications: TeacherApplicationItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const teacherApplicationService = {
  async getApplications(params: GetApplicationsQueryParams = {}): Promise<GetApplicationsResponse> {
    const response = await api.get<{ success: boolean; data: GetApplicationsResponse }>("/teacher-applications", {
      params,
    });
    return response.data.data;
  },

  async getApplicationById(id: string): Promise<TeacherApplicationItem> {
    const response = await api.get<{ success: boolean; data: TeacherApplicationItem }>(`/teacher-applications/${id}`);
    return response.data.data;
  },

  async updateStatus(
    id: string,
    status: "Pending" | "UnderReview" | "Approved" | "Rejected",
    rejectionReason?: string
  ): Promise<TeacherApplicationItem> {
    const response = await api.patch<{ success: boolean; data: TeacherApplicationItem }>(
      `/teacher-applications/${id}/status`,
      { status, rejectionReason }
    );
    return response.data.data;
  },

  async deleteApplication(id: string): Promise<void> {
    await api.delete(`/teacher-applications/${id}`);
  },

  async bulkApprove(ids: string[]): Promise<{ approvedCount: number }> {
    const response = await api.post<{ success: boolean; data: { approvedCount: number } }>(
      "/teacher-applications/bulk-approve",
      { ids }
    );
    return response.data.data;
  },

  async bulkReject(ids: string[], rejectionReason?: string): Promise<{ rejectedCount: number }> {
    const response = await api.post<{ success: boolean; data: { rejectedCount: number } }>(
      "/teacher-applications/bulk-reject",
      { ids, rejectionReason }
    );
    return response.data.data;
  },
};

export default teacherApplicationService;

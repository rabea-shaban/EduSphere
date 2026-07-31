import api from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "Draft"
  | "Submitted"
  | "Pending"
  | "UnderReview"
  | "Approved"
  | "Rejected"
  | "NeedsChanges"
  | "Suspended";

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
  status: ApplicationStatus;
  isDraft: boolean;
  submittedAt?: string;
  rejectionReason?: string;
  changesRequested?: string;
  reviewedBy?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
  reviewedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TeacherApplicationInput = Omit<
  TeacherApplicationItem,
  "_id" | "userId" | "status" | "isDraft" | "reviewedBy" | "reviewedAt" | "approvedAt" | "submittedAt" | "createdAt" | "updatedAt"
> & {
  isDraft?: boolean;
  password?: string;
};

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
  isDraft?: boolean;
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

// ─── Service ──────────────────────────────────────────────────────────────────

export const teacherApplicationService = {
  // ── TEACHER-FACING ──────────────────────────────────────────────────────────

  /** Submit a full application (POST /teacher-applications) */
  async submitApplication(data: TeacherApplicationInput): Promise<TeacherApplicationItem> {
    const response = await api.post<{ success: boolean; data: TeacherApplicationItem }>(
      "/teacher-applications",
      { ...data, isDraft: false }
    );
    return response.data.data;
  },

  /** Save application as draft (POST /teacher-applications/draft) */
  async saveDraft(data: Partial<TeacherApplicationInput>): Promise<TeacherApplicationItem> {
    const response = await api.post<{ success: boolean; data: TeacherApplicationItem }>(
      "/teacher-applications/draft",
      { ...data, isDraft: true }
    );
    return response.data.data;
  },

  /** Get own application status (GET /teacher-applications/my-application) */
  async getMyApplication(): Promise<TeacherApplicationItem | null> {
    const response = await api.get<{ success: boolean; data: TeacherApplicationItem | null }>(
      "/teacher-applications/my-application"
    );
    return response.data.data;
  },

  /** Update own application (PUT /teacher-applications/my-application) */
  async updateMyApplication(
    data: Partial<TeacherApplicationInput> & { isDraft?: boolean }
  ): Promise<TeacherApplicationItem> {
    const response = await api.put<{ success: boolean; data: TeacherApplicationItem }>(
      "/teacher-applications/my-application",
      data
    );
    return response.data.data;
  },

  /** Delete own draft (DELETE /teacher-applications/my-application) */
  async deleteMyApplication(): Promise<void> {
    await api.delete("/teacher-applications/my-application");
  },

  /** Check status by email/nationalId (public) */
  async checkStatus(query: string): Promise<Partial<TeacherApplicationItem>> {
    const response = await api.post<{ success: boolean; data: Partial<TeacherApplicationItem> }>(
      "/teacher-applications/check-status",
      { query }
    );
    return response.data.data;
  },

  // ── ADMIN ───────────────────────────────────────────────────────────────────

  /** List all applications (admin) */
  async getApplications(params: GetApplicationsQueryParams = {}): Promise<GetApplicationsResponse> {
    const response = await api.get<{ success: boolean; data: GetApplicationsResponse }>(
      "/teacher-applications",
      { params }
    );
    return response.data.data;
  },

  /** Get single application by ID (admin) */
  async getApplicationById(id: string): Promise<TeacherApplicationItem> {
    const response = await api.get<{ success: boolean; data: TeacherApplicationItem }>(
      `/teacher-applications/${id}`
    );
    return response.data.data;
  },

  /** Approve application (admin) */
  async approveApplication(id: string, notes?: string): Promise<TeacherApplicationItem> {
    const response = await api.patch<{ success: boolean; data: TeacherApplicationItem }>(
      `/teacher-applications/${id}/approve`,
      { notes }
    );
    return response.data.data;
  },

  /** Reject application (admin) */
  async rejectApplication(id: string, rejectionReason: string): Promise<TeacherApplicationItem> {
    const response = await api.patch<{ success: boolean; data: TeacherApplicationItem }>(
      `/teacher-applications/${id}/reject`,
      { rejectionReason }
    );
    return response.data.data;
  },

  /** Request changes from applicant (admin) */
  async requestChanges(id: string, changesRequested: string): Promise<TeacherApplicationItem> {
    const response = await api.patch<{ success: boolean; data: TeacherApplicationItem }>(
      `/teacher-applications/${id}/request-changes`,
      { changesRequested }
    );
    return response.data.data;
  },

  /** Generic status update (backward compat) */
  async updateStatus(
    id: string,
    status: ApplicationStatus,
    rejectionReason?: string,
    changesRequested?: string
  ): Promise<TeacherApplicationItem> {
    const response = await api.patch<{ success: boolean; data: TeacherApplicationItem }>(
      `/teacher-applications/${id}/status`,
      { status, rejectionReason, changesRequested }
    );
    return response.data.data;
  },

  /** Delete application (admin) */
  async deleteApplication(id: string): Promise<void> {
    await api.delete(`/teacher-applications/${id}`);
  },

  /** Bulk approve */
  async bulkApprove(ids: string[]): Promise<{ approvedCount: number }> {
    const response = await api.post<{ success: boolean; data: { approvedCount: number } }>(
      "/teacher-applications/bulk-approve",
      { ids }
    );
    return response.data.data;
  },

  /** Bulk reject */
  async bulkReject(ids: string[], rejectionReason?: string): Promise<{ rejectedCount: number }> {
    const response = await api.post<{ success: boolean; data: { rejectedCount: number } }>(
      "/teacher-applications/bulk-reject",
      { ids, rejectionReason }
    );
    return response.data.data;
  },
};

export default teacherApplicationService;

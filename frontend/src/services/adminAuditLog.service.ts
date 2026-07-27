import api from "./api";

export interface AuditLogItem {
  _id: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  userName?: string;
  userRole?: string;
  action: string;
  category: "Login" | "Course" | "Payment" | "Security" | "Admin" | "Settings" | "CMS" | "Roles";
  module: string;
  status: "SUCCESS" | "FAILED" | "WARNING";
  details?: {
    endpoint?: string;
    method?: string;
    oldData?: any;
    newData?: any;
    executionTimeMs?: number;
    errorMessage?: string;
  };
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogStatistics {
  totalLogs: number;
  todayCount: number;
  securityCount: number;
  settingsCount: number;
  failedCount: number;
}

export interface AuditLogsResponse {
  logs: AuditLogItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminAuditLogService = {
  async getStatistics(): Promise<AuditLogStatistics> {
    const response = await api.get<{ success: boolean; data: AuditLogStatistics }>("/admin/audit-logs/statistics");
    return response.data.data;
  },

  async getLogs(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    module?: string;
  }): Promise<AuditLogsResponse> {
    const response = await api.get<{ success: boolean; data: AuditLogsResponse }>("/admin/audit-logs", {
      params,
    });
    return response.data.data;
  },

  async getLogById(id: string): Promise<AuditLogItem> {
    const response = await api.get<{ success: boolean; data: AuditLogItem }>(`/admin/audit-logs/${id}`);
    return response.data.data;
  },
};

export default adminAuditLogService;

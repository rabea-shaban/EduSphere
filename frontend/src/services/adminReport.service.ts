import api from "./api";

export interface ReportSummary {
  totalRevenue: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  completedEnrollments: number;
  completionRate: string;
  pendingPaymentsCount: number;
  completedWithdrawals: number;
  certificatesIssued: number;
}

export interface MonthlyRevenueTrendItem {
  month: string;
  revenue: number;
  sales: number;
}

export interface PaymentMethodDistributionItem {
  method: string;
  total: number;
  count: number;
}

export interface TopCourseItem {
  _id: string;
  title: string;
  price: number;
  studentsCount: number;
  rating: number;
  teacherName: string;
}

export interface TopTeacherItem {
  _id: string;
  fullName: string;
  email: string;
  coursesCount: number;
  studentsCount: number;
}

export interface ReportsDashboardData {
  summary: ReportSummary;
  monthlyRevenueTrend: MonthlyRevenueTrendItem[];
  paymentMethodsDistribution: PaymentMethodDistributionItem[];
  topCourses: TopCourseItem[];
  topTeachers: TopTeacherItem[];
}

export const adminReportService = {
  async getReportsDashboard(): Promise<ReportsDashboardData> {
    const response = await api.get<{ success: boolean; data: ReportsDashboardData }>("/admin/reports/dashboard");
    return response.data.data;
  },

  async getRevenueReport(): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>("/admin/reports/revenue");
    return response.data.data;
  },

  async getStudentReport(): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>("/admin/reports/students");
    return response.data.data;
  },

  async getTeacherReport(): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>("/admin/reports/teachers");
    return response.data.data;
  },
};

export default adminReportService;

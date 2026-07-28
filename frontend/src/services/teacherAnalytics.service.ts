import api from "./api";
import type {
  DashboardAnalyticsData,
  CourseAnalyticsItem,
  StudentAnalyticsData,
  LessonAnalyticsItem,
  QuizAnalyticsData,
  AssignmentAnalyticsData,
  RevenueAnalyticsData,
  EngagementAnalyticsData,
  CertificateAnalyticsData,
  ChartMonthSeries,
  AnalyticsFilters,
} from "@/features/teacher/types/analytics";
import type { ApiResponse } from "@/features/dashboard/types/api";

export const teacherAnalyticsService = {
  /**
   * Get teacher dashboard overview analytics.
   */
  async getDashboardAnalytics(filters?: AnalyticsFilters): Promise<DashboardAnalyticsData> {
    const response = await api.get<ApiResponse<DashboardAnalyticsData>>(
      `/teacher/analytics/dashboard`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get course analytics list.
   */
  async getCourseAnalytics(filters?: AnalyticsFilters): Promise<CourseAnalyticsItem[]> {
    const response = await api.get<ApiResponse<CourseAnalyticsItem[]>>(
      `/teacher/analytics/courses`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get student growth and retention analytics.
   */
  async getStudentAnalytics(filters?: AnalyticsFilters): Promise<StudentAnalyticsData> {
    const response = await api.get<ApiResponse<StudentAnalyticsData>>(
      `/teacher/analytics/students`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get lesson views and completion analytics.
   */
  async getLessonAnalytics(filters?: AnalyticsFilters): Promise<LessonAnalyticsItem[]> {
    const response = await api.get<ApiResponse<LessonAnalyticsItem[]>>(
      `/teacher/analytics/lessons`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get quiz performance analytics.
   */
  async getQuizAnalytics(filters?: AnalyticsFilters): Promise<QuizAnalyticsData> {
    const response = await api.get<ApiResponse<QuizAnalyticsData>>(
      `/teacher/analytics/quizzes`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get assignment submission and grading analytics.
   */
  async getAssignmentAnalytics(filters?: AnalyticsFilters): Promise<AssignmentAnalyticsData> {
    const response = await api.get<ApiResponse<AssignmentAnalyticsData>>(
      `/teacher/analytics/assignments`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get revenue and earnings analytics.
   */
  async getRevenueAnalytics(filters?: AnalyticsFilters): Promise<RevenueAnalyticsData> {
    const response = await api.get<ApiResponse<RevenueAnalyticsData>>(
      `/teacher/analytics/revenue`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get student engagement analytics.
   */
  async getEngagementAnalytics(filters?: AnalyticsFilters): Promise<EngagementAnalyticsData> {
    const response = await api.get<ApiResponse<EngagementAnalyticsData>>(
      `/teacher/analytics/engagement`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get certificate completion analytics.
   */
  async getCertificateAnalytics(filters?: AnalyticsFilters): Promise<CertificateAnalyticsData> {
    const response = await api.get<ApiResponse<CertificateAnalyticsData>>(
      `/teacher/analytics/certificates`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get chart time series analytics.
   */
  async getChartAnalytics(filters?: AnalyticsFilters): Promise<ChartMonthSeries[]> {
    const response = await api.get<ApiResponse<ChartMonthSeries[]>>(
      `/teacher/analytics/charts`,
      { params: filters }
    );
    return response.data.data;
  },
};

export default teacherAnalyticsService;

import { useQuery } from "@tanstack/react-query";
import teacherAnalyticsService from "@/services/teacherAnalytics.service";
import type { AnalyticsFilters } from "@/features/teacher/types/analytics";

export const TEACHER_ANALYTICS_KEYS = {
  all: ["teacher-analytics"] as const,
  dashboard: (filters?: AnalyticsFilters) => ["teacher-analytics", "dashboard", filters] as const,
  courses: (filters?: AnalyticsFilters) => ["teacher-analytics", "courses", filters] as const,
  students: (filters?: AnalyticsFilters) => ["teacher-analytics", "students", filters] as const,
  lessons: (filters?: AnalyticsFilters) => ["teacher-analytics", "lessons", filters] as const,
  quizzes: (filters?: AnalyticsFilters) => ["teacher-analytics", "quizzes", filters] as const,
  assignments: (filters?: AnalyticsFilters) => ["teacher-analytics", "assignments", filters] as const,
  revenue: (filters?: AnalyticsFilters) => ["teacher-analytics", "revenue", filters] as const,
  engagement: (filters?: AnalyticsFilters) => ["teacher-analytics", "engagement", filters] as const,
  certificates: (filters?: AnalyticsFilters) => ["teacher-analytics", "certificates", filters] as const,
  charts: (filters?: AnalyticsFilters) => ["teacher-analytics", "charts", filters] as const,
};

export function useDashboardAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.dashboard(filters),
    queryFn: () => teacherAnalyticsService.getDashboardAnalytics(filters),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
  });
}

export function useCourseAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.courses(filters),
    queryFn: () => teacherAnalyticsService.getCourseAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useStudentAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.students(filters),
    queryFn: () => teacherAnalyticsService.getStudentAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useLessonAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.lessons(filters),
    queryFn: () => teacherAnalyticsService.getLessonAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useTeacherQuizAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.quizzes(filters),
    queryFn: () => teacherAnalyticsService.getQuizAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useTeacherAssignmentAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.assignments(filters),
    queryFn: () => teacherAnalyticsService.getAssignmentAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useRevenueAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.revenue(filters),
    queryFn: () => teacherAnalyticsService.getRevenueAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useEngagementAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.engagement(filters),
    queryFn: () => teacherAnalyticsService.getEngagementAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useCertificateAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.certificates(filters),
    queryFn: () => teacherAnalyticsService.getCertificateAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useChartAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: TEACHER_ANALYTICS_KEYS.charts(filters),
    queryFn: () => teacherAnalyticsService.getChartAnalytics(filters),
    staleTime: 1000 * 60 * 3,
  });
}

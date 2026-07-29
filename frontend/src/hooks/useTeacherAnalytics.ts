import { useQuery } from "@tanstack/react-query";
import teacherAnalyticsService from "@/services/teacherAnalytics.service";
import type { AnalyticsFilters } from "@/features/teacher/types/analytics";
import { queryKeys } from "@/lib/react-query";

export const TEACHER_ANALYTICS_KEYS = queryKeys.teacher.analytics;

export function useDashboardAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: queryKeys.teacher.analytics.overview(JSON.stringify(filters ?? {})),
    queryFn: () => teacherAnalyticsService.getDashboardAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourseAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: queryKeys.teacher.analytics.courses(),
    queryFn: () => teacherAnalyticsService.getCourseAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStudentAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: queryKeys.teacher.analytics.students(),
    queryFn: () => teacherAnalyticsService.getStudentAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLessonAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ["teacher-analytics", "lessons", filters],
    queryFn: () => teacherAnalyticsService.getLessonAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTeacherQuizAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ["teacher-analytics", "quizzes", filters],
    queryFn: () => teacherAnalyticsService.getQuizAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTeacherAssignmentAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ["teacher-analytics", "assignments", filters],
    queryFn: () => teacherAnalyticsService.getAssignmentAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRevenueAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ["teacher-analytics", "revenue", filters],
    queryFn: () => teacherAnalyticsService.getRevenueAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useEngagementAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ["teacher-analytics", "engagement", filters],
    queryFn: () => teacherAnalyticsService.getEngagementAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCertificateAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ["teacher-analytics", "certificates", filters],
    queryFn: () => teacherAnalyticsService.getCertificateAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useChartAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ["teacher-analytics", "charts", filters],
    queryFn: () => teacherAnalyticsService.getChartAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
}

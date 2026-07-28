import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import lessonService from "@/services/lesson.service";
import type {
  CreateLessonInput,
  UpdateLessonInput,
  ReorderLessonsInput,
  MoveLessonInput,
  LessonFilters,
} from "@/features/teacher/types/lesson";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const LESSON_KEYS = {
  all: ["lessons"] as const,
  bySection: (sectionId: string) => ["lessons", "section", sectionId] as const,
  byId: (id: string) => ["lessons", "id", id] as const,
  search: (filters?: LessonFilters) => ["lessons", "search", filters] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch all lessons for a section.
 */
export function useLessons(sectionId: string, filters?: LessonFilters) {
  return useQuery({
    queryKey: LESSON_KEYS.bySection(sectionId),
    queryFn: () => lessonService.getLessonsBySection(sectionId, filters),
    enabled: !!sectionId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Search all lessons belonging to teacher across sections/courses.
 */
export function useTeacherLessons(filters?: LessonFilters) {
  return useQuery({
    queryKey: LESSON_KEYS.search(filters),
    queryFn: () => lessonService.searchLessons(filters),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch a single lesson by ID.
 */
export function useLesson(id: string) {
  return useQuery({
    queryKey: LESSON_KEYS.byId(id),
    queryFn: () => lessonService.getLessonById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create a new lesson inside a section.
 */
export function useCreateLesson(sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonInput) =>
      lessonService.createLesson(sectionId, data),
    onSuccess: (newLesson) => {
      // Optimistically update section cache
      queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          lessons: [...(old.lessons || []), newLesson].sort(
            (a, b) => a.order - b.order
          ),
          pagination: {
            ...old.pagination,
            total: (old.pagination?.total || 0) + 1,
          },
        };
      });
      // Invalidate global lessons query
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
      toast.success("تم إنشاء الدرس بنجاح ✅");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إنشاء الدرس");
    },
  });
}

/**
 * Update a lesson.
 */
export function useUpdateLesson(sectionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonInput }) =>
      lessonService.updateLesson(id, data),
    onSuccess: (updatedLesson) => {
      queryClient.setQueryData(
        LESSON_KEYS.byId(updatedLesson._id),
        updatedLesson
      );
      if (sectionId) {
        queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), (old: any) => {
          if (!old) return old;
          return {
            ...old,
            lessons: (old.lessons || []).map((l: any) =>
              l._id === updatedLesson._id ? updatedLesson : l
            ),
          };
        });
      }
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
      toast.success("تم تحديث الدرس بنجاح ✅");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث الدرس");
    },
  });
}

/**
 * Soft-delete a lesson.
 */
export function useDeleteLesson(sectionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lessonService.deleteLesson(id),
    onMutate: async (id) => {
      if (sectionId) {
        await queryClient.cancelQueries({ queryKey: LESSON_KEYS.bySection(sectionId) });
        const previous = queryClient.getQueryData(LESSON_KEYS.bySection(sectionId));
        queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), (old: any) => {
          if (!old) return old;
          return {
            ...old,
            lessons: (old.lessons || []).filter((l: any) => l._id !== id),
            pagination: {
              ...old.pagination,
              total: Math.max(0, (old.pagination?.total || 1) - 1),
            },
          };
        });
        return { previous };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
      toast.success("تم حذف الدرس بنجاح 🗑️");
    },
    onError: (error: any, _id, context: any) => {
      if (sectionId && context?.previous) {
        queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), context.previous);
      }
      toast.error(error?.message || "تعذر حذف الدرس");
    },
  });
}

/**
 * Archive a lesson.
 */
export function useArchiveLesson(sectionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lessonService.archiveLesson(id),
    onSuccess: (updatedLesson) => {
      if (sectionId) {
        queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), (old: any) => {
          if (!old) return old;
          return {
            ...old,
            lessons: (old.lessons || []).map((l: any) =>
              l._id === updatedLesson._id ? updatedLesson : l
            ),
          };
        });
      }
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
      toast.success("تم أرشفة الدرس بنجاح 📦");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر أرشفة الدرس");
    },
  });
}

/**
 * Restore a lesson.
 */
export function useRestoreLesson(sectionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lessonService.restoreLesson(id),
    onSuccess: (restoredLesson) => {
      if (sectionId) {
        queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), (old: any) => {
          if (!old) return old;
          return {
            ...old,
            lessons: (old.lessons || []).map((l: any) =>
              l._id === restoredLesson._id ? restoredLesson : l
            ),
          };
        });
      }
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
      toast.success("تم استعادة الدرس بنجاح ✅");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر استعادة الدرس");
    },
  });
}

/**
 * Duplicate a lesson.
 */
export function useDuplicateLesson(sectionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lessonService.duplicateLesson(id),
    onSuccess: (newLesson) => {
      if (sectionId) {
        queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), (old: any) => {
          if (!old) return old;
          return {
            ...old,
            lessons: [...(old.lessons || []), newLesson].sort(
              (a, b) => a.order - b.order
            ),
            pagination: {
              ...old.pagination,
              total: (old.pagination?.total || 0) + 1,
            },
          };
        });
      }
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
      toast.success("تم تكرار الدرس بنجاح 📋");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تكرار الدرس");
    },
  });
}

/**
 * Reorder lessons inside a section.
 */
export function useReorderLessons(sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderLessonsInput) => lessonService.reorderLessons(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: LESSON_KEYS.bySection(sectionId) });
      const previous = queryClient.getQueryData(LESSON_KEYS.bySection(sectionId));
      queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), (old: any) => {
        if (!old) return old;
        const orderMap = new Map(data.items.map((i) => [i.id, i.order]));
        const reordered = (old.lessons || [])
          .map((l: any) => ({
            ...l,
            order: orderMap.has(l._id) ? orderMap.get(l._id) : l.order,
          }))
          .sort((a: any, b: any) => a.order - b.order);
        return { ...old, lessons: reordered };
      });
      return { previous };
    },
    onError: (_error, _data, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(LESSON_KEYS.bySection(sectionId), context.previous);
      }
      toast.error("تعذر إعادة ترتيب الدروس");
    },
    onSuccess: () => {
      toast.success("تم حفظ ترتيب الدروس بنجاح 🔄");
    },
  });
}

/**
 * Move a lesson to another section.
 */
export function useMoveLesson(sectionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveLessonInput }) =>
      lessonService.moveLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
      toast.success("تم نقل الدرس إلى القسم الجديد بنجاح 🚚");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر نقل الدرس");
    },
  });
}

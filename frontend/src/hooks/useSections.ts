import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import sectionService from "@/services/section.service";
import type {
  CreateSectionInput,
  UpdateSectionInput,
  ReorderSectionsInput,
  SectionFilters,
} from "@/features/teacher/types/section";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const SECTION_KEYS = {
  all: ["sections"] as const,
  byCourse: (courseId: string) => ["sections", "course", courseId] as const,
  byId: (id: string) => ["sections", "id", id] as const,
  search: (filters?: SectionFilters) => ["sections", "search", filters] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch all sections for a course.
 */
export function useSections(courseId: string, filters?: SectionFilters) {
  return useQuery({
    queryKey: SECTION_KEYS.byCourse(courseId),
    queryFn: () => sectionService.getSectionsByCourse(courseId, filters),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch a single section by ID.
 */
export function useSection(id: string) {
  return useQuery({
    queryKey: SECTION_KEYS.byId(id),
    queryFn: () => sectionService.getSectionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create a new section under a course.
 */
export function useCreateSection(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSectionInput) =>
      sectionService.createSection(courseId, data),
    onSuccess: (newSection) => {
      // Optimistically update the list cache
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sections: [...(old.sections || []), newSection].sort(
            (a, b) => a.order - b.order
          ),
          pagination: {
            ...old.pagination,
            total: (old.pagination?.total || 0) + 1,
          },
        };
      });
      toast.success("تم إنشاء القسم بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إنشاء القسم");
    },
  });
}

/**
 * Update a section.
 */
export function useUpdateSection(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSectionInput }) =>
      sectionService.updateSection(id, data),
    onSuccess: (updatedSection) => {
      // Update individual section cache
      queryClient.setQueryData(
        SECTION_KEYS.byId(updatedSection._id),
        updatedSection
      );
      // Update list cache
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sections: (old.sections || []).map((s: any) =>
            s._id === updatedSection._id ? updatedSection : s
          ),
        };
      });
      toast.success("تم تحديث القسم بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث القسم");
    },
  });
}

/**
 * Soft-delete a section.
 */
export function useDeleteSection(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sectionService.deleteSection(id),
    onMutate: async (id) => {
      // Cancel pending fetches
      await queryClient.cancelQueries({ queryKey: SECTION_KEYS.byCourse(courseId) });
      // Snapshot previous state
      const previous = queryClient.getQueryData(SECTION_KEYS.byCourse(courseId));
      // Optimistic update
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sections: (old.sections || []).filter((s: any) => s._id !== id),
          pagination: {
            ...old.pagination,
            total: Math.max(0, (old.pagination?.total || 1) - 1),
          },
        };
      });
      return { previous };
    },
    onSuccess: () => {
      toast.success("تم حذف القسم بنجاح.");
    },
    onError: (error: any, _id, context: any) => {
      // Rollback on error
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), context?.previous);
      toast.error(error?.message || "تعذر حذف القسم");
    },
  });
}

/**
 * Archive a section.
 */
export function useArchiveSection(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sectionService.archiveSection(id),
    onSuccess: (updatedSection) => {
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sections: (old.sections || []).map((s: any) =>
            s._id === updatedSection._id ? updatedSection : s
          ),
        };
      });
      toast.success("تم أرشفة القسم بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر أرشفة القسم");
    },
  });
}

/**
 * Restore a soft-deleted or archived section.
 */
export function useRestoreSection(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sectionService.restoreSection(id),
    onSuccess: (restoredSection) => {
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sections: (old.sections || []).map((s: any) =>
            s._id === restoredSection._id ? restoredSection : s
          ),
        };
      });
      toast.success("تم استعادة القسم بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر استعادة القسم");
    },
  });
}

/**
 * Duplicate a section.
 */
export function useDuplicateSection(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sectionService.duplicateSection(id),
    onSuccess: (newSection) => {
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          sections: [...(old.sections || []), newSection].sort(
            (a, b) => a.order - b.order
          ),
          pagination: {
            ...old.pagination,
            total: (old.pagination?.total || 0) + 1,
          },
        };
      });
      toast.success("تم تكرار القسم بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تكرار القسم");
    },
  });
}

/**
 * Reorder sections (bulk update order with optimistic UI).
 */
export function useReorderSections(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderSectionsInput) => sectionService.reorderSections(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: SECTION_KEYS.byCourse(courseId) });
      const previous = queryClient.getQueryData(SECTION_KEYS.byCourse(courseId));
      // Optimistically apply new order
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), (old: any) => {
        if (!old) return old;
        const orderMap = new Map(data.items.map((i) => [i.id, i.order]));
        const reordered = (old.sections || [])
          .map((s: any) => ({
            ...s,
            order: orderMap.has(s._id) ? orderMap.get(s._id) : s.order,
          }))
          .sort((a: any, b: any) => a.order - b.order);
        return { ...old, sections: reordered };
      });
      return { previous };
    },
    onError: (_error, _data, context: any) => {
      queryClient.setQueryData(SECTION_KEYS.byCourse(courseId), context?.previous);
      toast.error("تعذر إعادة ترتيب الأقسام");
    },
    onSuccess: () => {
      toast.success("تم حفظ الترتيب الجديد بنجاح.");
    },
  });
}

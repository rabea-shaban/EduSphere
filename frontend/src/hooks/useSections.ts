import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import sectionService from "@/services/section.service";
import type {
  CreateSectionInput,
  UpdateSectionInput,
  ReorderSectionsInput,
  SectionFilters,
} from "@/features/teacher/types/section";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const SECTION_KEYS = queryKeys.sections;

/**
 * Fetch all sections for a course.
 */
export function useSections(courseId: string, filters?: SectionFilters) {
  return useQuery({
    queryKey: queryKeys.sections.byCourse(courseId),
    queryFn: () => sectionService.getSectionsByCourse(courseId, filters),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch a single section by ID.
 */
export function useSection(id: string) {
  return useQuery({
    queryKey: queryKeys.sections.byId(id),
    queryFn: () => sectionService.getSectionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
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
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), (old: any) => {
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
      handleApiError(error, "تعذر إنشاء القسم");
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
      queryClient.setQueryData(
        queryKeys.sections.byId(updatedSection._id),
        updatedSection
      );
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), (old: any) => {
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
      handleApiError(error, "تعذر تحديث القسم");
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
      await queryClient.cancelQueries({ queryKey: queryKeys.sections.byCourse(courseId) });
      const previous = queryClient.getQueryData(queryKeys.sections.byCourse(courseId));
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), (old: any) => {
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
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), context?.previous);
      handleApiError(error, "تعذر حذف القسم");
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
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), (old: any) => {
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
      handleApiError(error, "تعذر أرشفة القسم");
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
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), (old: any) => {
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
      handleApiError(error, "تعذر استعادة القسم");
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
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), (old: any) => {
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
      handleApiError(error, "تعذر تكرار القسم");
    },
  });
}

/**
 * Reorder sections.
 */
export function useReorderSections(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderSectionsInput) => sectionService.reorderSections(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.sections.byCourse(courseId) });
      const previous = queryClient.getQueryData(queryKeys.sections.byCourse(courseId));
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), (old: any) => {
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
    onError: (error: any, _data, context: any) => {
      queryClient.setQueryData(queryKeys.sections.byCourse(courseId), context?.previous);
      handleApiError(error, "تعذر إعادة ترتيب الأقسام");
    },
    onSuccess: () => {
      toast.success("تم حفظ الترتيب الجديد بنجاح.");
    },
  });
}

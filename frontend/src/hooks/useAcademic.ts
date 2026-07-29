import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import academicService, {
  GetGradesParams,
  CreateGradeDTO,
  UpdateGradeDTO,
} from "@/services/academic.service";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const ACADEMIC_QUERY_KEYS = queryKeys.academic;

export function useGrades(params?: GetGradesParams) {
  return useQuery({
    queryKey: queryKeys.academic.grades(),
    queryFn: () => academicService.getGrades(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useTerms() {
  return useQuery({
    queryKey: ["academic", "terms"],
    queryFn: () => academicService.getTerms(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubjects(educationStage?: string) {
  return useQuery({
    queryKey: queryKeys.academic.subjects(educationStage),
    queryFn: () => academicService.getSubjects(educationStage ? { educationStage } : undefined),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGradeDTO) => academicService.createGrade(data),
    onSuccess: () => {
      toast.success("تم إضافة المسار الأكاديمي بنجاح");
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.all });
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء إضافة المسار الأكاديمي.");
    },
  });
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGradeDTO }) =>
      academicService.updateGrade(id, data),
    onSuccess: () => {
      toast.success("تم تحديث بيانات المسار الأكاديمي بنجاح");
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.all });
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء تحديث المسار الأكاديمي.");
    },
  });
}

export function useDeleteGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => academicService.deleteGrade(id),
    onSuccess: () => {
      toast.success("تم حذف المسار الأكاديمي بنجاح");
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.all });
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء عملية الحذف.");
    },
  });
}

export function useToggleGradeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      academicService.toggleGradeStatus(id, isActive),
    onSuccess: (_, variables) => {
      toast.success(
        variables.isActive ? "تم تفعيل المسار الأكاديمي بنجاح" : "تم تعليق تفعيل المسار الأكاديمي"
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.all });
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء تغيير حالة التفعيل.");
    },
  });
}

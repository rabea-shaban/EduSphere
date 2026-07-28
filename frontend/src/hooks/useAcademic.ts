import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import academicService, {
  GetGradesParams,
  CreateGradeDTO,
  UpdateGradeDTO,
} from "@/services/academic.service";

export const ACADEMIC_QUERY_KEYS = {
  grades: (params?: GetGradesParams) => ["academic", "grades", params],
  terms: () => ["academic", "terms"],
  subjects: (stage?: string) => ["academic", "subjects", stage],
};

export function useGrades(params?: GetGradesParams) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.grades(params),
    queryFn: () => academicService.getGrades(params),
    staleTime: 60 * 1000,
  });
}

export function useTerms() {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.terms(),
    queryFn: () => academicService.getTerms(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubjects(educationStage?: string) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.subjects(educationStage),
    queryFn: () => academicService.getSubjects(educationStage ? { educationStage } : undefined),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGradeDTO) => academicService.createGrade(data),
    onSuccess: () => {
      toast.success("تم إضافة المسار الأكاديمي بنجاح");
      queryClient.invalidateQueries({ queryKey: ["academic"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء إضافة المسار الأكاديمي.");
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
      queryClient.invalidateQueries({ queryKey: ["academic"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تحديث المسار الأكاديمي.");
    },
  });
}

export function useDeleteGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => academicService.deleteGrade(id),
    onSuccess: () => {
      toast.success("تم حذف المسار الأكاديمي بنجاح");
      queryClient.invalidateQueries({ queryKey: ["academic"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء عملية الحذف.");
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
      queryClient.invalidateQueries({ queryKey: ["academic"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تغيير حالة التفعيل.");
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import quizService from "@/services/quiz.service";
import type {
  CreateQuizInput,
  UpdateQuizInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  ReorderQuestionItem,
  QuizFilters,
} from "@/features/teacher/types/quiz";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const QUIZ_KEYS = {
  all: ["quizzes"] as const,
  search: (filters?: QuizFilters) => ["quizzes", "search", filters] as const,
  byId: (id: string) => ["quizzes", "id", id] as const,
  questions: (quizId: string) => ["quizzes", quizId, "questions"] as const,
  analytics: (quizId: string) => ["quizzes", quizId, "analytics"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch quizzes list.
 */
export function useQuizzes(filters?: QuizFilters) {
  return useQuery({
    queryKey: QUIZ_KEYS.search(filters),
    queryFn: () => quizService.getQuizzes(filters),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch single quiz by ID.
 */
export function useQuiz(id: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.byId(id),
    queryFn: () => quizService.getQuizById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create a new quiz.
 */
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizInput) => quizService.createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      toast.success("تم إنشاء الاختبار بنجاح 📝");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إنشاء الاختبار");
    },
  });
}

/**
 * Update a quiz.
 */
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuizInput }) =>
      quizService.updateQuiz(id, data),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(updatedQuiz._id), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      toast.success("تم تحديث إعدادات الاختبار بنجاح ✅");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث الاختبار");
    },
  });
}

/**
 * Soft-delete a quiz.
 */
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      toast.success("تم حذف الاختبار بنجاح 🗑️");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حذف الاختبار");
    },
  });
}

/**
 * Publish a quiz.
 */
export function usePublishQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizService.publishQuiz(id),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(updatedQuiz._id), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      toast.success("تم نشر الاختبار للطلاب بنجاح 🚀");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر نشر الاختبار");
    },
  });
}

/**
 * Unpublish a quiz.
 */
export function useUnpublishQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizService.unpublishQuiz(id),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(updatedQuiz._id), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      toast.success("تم تحويل الاختبار إلى مسودة ✏️");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إلغاء النشر");
    },
  });
}

/**
 * Archive a quiz.
 */
export function useArchiveQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizService.archiveQuiz(id),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(updatedQuiz._id), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      toast.success("تم أرشفة الاختبار بنجاح 📦");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر أرشفة الاختبار");
    },
  });
}

/**
 * Restore an archived quiz.
 */
export function useRestoreQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizService.restoreQuiz(id),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(updatedQuiz._id), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      toast.success("تم استعادة الاختبار بنجاح ✅");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر استعادة الاختبار");
    },
  });
}

/**
 * Duplicate a quiz.
 */
export function useDuplicateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizService.duplicateQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      toast.success("تم تكرار الاختبار بنجاح 📋");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تكرار الاختبار");
    },
  });
}

/**
 * Fetch quiz questions.
 */
export function useQuizQuestions(quizId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.questions(quizId),
    queryFn: () => quizService.getQuizQuestions(quizId),
    enabled: !!quizId,
  });
}

/**
 * Add a question to quiz.
 */
export function useAddQuestion(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionInput) => quizService.addQuestion(quizId, data),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(quizId), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.questions(quizId) });
      toast.success("تم إضافة السؤال بنجاح ➕");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إضافة السؤال");
    },
  });
}

/**
 * Update a question inside quiz.
 */
export function useUpdateQuestion(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: UpdateQuestionInput }) =>
      quizService.updateQuestion(questionId, data),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(quizId), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.questions(quizId) });
      toast.success("تم تحديث السؤال بنجاح ✅");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث السؤال");
    },
  });
}

/**
 * Delete a question from quiz.
 */
export function useDeleteQuestion(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => quizService.deleteQuestion(questionId),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(quizId), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.questions(quizId) });
      toast.success("تم حذف السؤال بنجاح 🗑️");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حذف السؤال");
    },
  });
}

/**
 * Reorder questions inside quiz.
 */
export function useReorderQuestions(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderQuestionItem[]) => quizService.reorderQuestions(quizId, items),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUIZ_KEYS.byId(quizId), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.questions(quizId) });
      toast.success("تم إعادة ترتيب الأسئلة بنجاح 🔄");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إعادة ترتيب الأسئلة");
    },
  });
}

/**
 * Fetch quiz analytics.
 */
export function useQuizAnalytics(quizId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.analytics(quizId),
    queryFn: () => quizService.getQuizAnalytics(quizId),
    enabled: !!quizId,
  });
}

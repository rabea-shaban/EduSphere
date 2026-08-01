import api from "./api";
import type {
  ApiQuiz,
  ApiQuestion,
  CreateQuizInput,
  UpdateQuizInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  ReorderQuestionItem,
  QuizAnalytics,
  QuizFilters,
} from "@/features/teacher/types/quiz";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface QuizzesListResponse {
  quizzes: ApiQuiz[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const quizService = {
  /**
   * Get all teacher quizzes with filters and pagination.
   */
  async getQuizzes(filters?: QuizFilters): Promise<QuizzesListResponse> {
    const response = await api.get<ApiResponse<QuizzesListResponse>>(
      `/teacher/quizzes`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get single quiz by ID.
   */
  async getQuizById(id: string): Promise<ApiQuiz> {
    const response = await api.get<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new quiz.
   */
  async createQuiz(data: CreateQuizInput): Promise<ApiQuiz> {
    const response = await api.post<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes`,
      data
    );
    return response.data.data;
  },

  /**
   * Update quiz settings.
   */
  async updateQuiz(id: string, data: UpdateQuizInput): Promise<ApiQuiz> {
    const response = await api.patch<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Soft-delete a quiz.
   */
  async deleteQuiz(id: string): Promise<void> {
    await api.delete(`/teacher/quizzes/${id}`);
  },

  /**
   * Publish a quiz.
   */
  async publishQuiz(id: string): Promise<ApiQuiz> {
    const response = await api.patch<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes/${id}/publish`
    );
    return response.data.data;
  },

  /**
   * Unpublish a quiz (Draft).
   */
  async unpublishQuiz(id: string): Promise<ApiQuiz> {
    const response = await api.patch<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes/${id}/unpublish`
    );
    return response.data.data;
  },

  /**
   * Archive a quiz.
   */
  async archiveQuiz(id: string): Promise<ApiQuiz> {
    const response = await api.patch<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes/${id}/archive`
    );
    return response.data.data;
  },

  /**
   * Restore an archived/soft-deleted quiz.
   */
  async restoreQuiz(id: string): Promise<ApiQuiz> {
    const response = await api.patch<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes/${id}/restore`
    );
    return response.data.data;
  },

  /**
   * Duplicate a quiz.
   */
  async duplicateQuiz(id: string): Promise<ApiQuiz> {
    const response = await api.post<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes/${id}/duplicate`
    );
    return response.data.data;
  },

  /**
   * Get questions for a quiz.
   */
  async getQuizQuestions(id: string): Promise<ApiQuestion[]> {
    const response = await api.get<ApiResponse<ApiQuestion[]>>(
      `/teacher/quizzes/${id}/questions`
    );
    return response.data.data;
  },

  /**
   * Add a question to quiz.
   */
  async addQuestion(quizId: string, data: CreateQuestionInput): Promise<ApiQuiz> {
    const response = await api.post<ApiResponse<ApiQuiz>>(
      `/teacher/quizzes/${quizId}/questions`,
      data
    );
    return response.data.data;
  },

  /**
   * Update a question inside quiz.
   */
  async updateQuestion(questionId: string, data: UpdateQuestionInput): Promise<ApiQuiz> {
    const response = await api.put<ApiResponse<ApiQuiz>>(
      `/teacher/questions/${questionId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a question from quiz.
   */
  async deleteQuestion(questionId: string): Promise<ApiQuiz> {
    const response = await api.delete<ApiResponse<ApiQuiz>>(
      `/teacher/questions/${questionId}`
    );
    return response.data.data;
  },

  /**
   * Reorder questions inside quiz.
   */
  async reorderQuestions(quizId: string, items: ReorderQuestionItem[]): Promise<ApiQuiz> {
    const response = await api.patch<ApiResponse<ApiQuiz>>(
      `/teacher/questions/reorder`,
      { quizId, items }
    );
    return response.data.data;
  },

  /**
   * Get quiz analytics.
   */
  async getQuizAnalytics(id: string): Promise<QuizAnalytics> {
    const response = await api.get<ApiResponse<QuizAnalytics>>(
      `/teacher/quizzes/${id}/analytics`
    );
    return response.data.data;
  },

  /**
   * Get quiz leaderboard (top students sorted by highest score & fastest time).
   */
  async getQuizLeaderboard(id: string): Promise<LeaderboardEntry[]> {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>(
      `/teacher/quizzes/${id}/leaderboard`
    );
    return response.data.data;
  },
};

export interface LeaderboardEntry {
  rank: number;
  student: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    avatar?: string;
  };
  score: number;
  percentage: number;
  timeTaken: number;
  passed: boolean;
}

export default quizService;

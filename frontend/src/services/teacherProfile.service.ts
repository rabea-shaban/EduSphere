import api from "./api";
import type {
  FullTeacherProfileResponse,
  ProfileCompleteness,
  ProfileAnalyticsData,
  ChangePasswordInput,
} from "@/features/teacher/types/profile";
import type { ApiResponse } from "@/features/dashboard/types/api";

export const teacherProfileService = {
  /**
   * Get full teacher profile (User, Profile, Completeness, Analytics).
   */
  async getProfile(): Promise<FullTeacherProfileResponse> {
    const response = await api.get<ApiResponse<FullTeacherProfileResponse>>(
      `/teacher/profile`
    );
    return response.data.data;
  },

  /**
   * Update teacher profile details.
   */
  async updateProfile(data: any): Promise<FullTeacherProfileResponse> {
    const response = await api.put<ApiResponse<FullTeacherProfileResponse>>(
      `/teacher/profile`,
      data
    );
    return response.data.data;
  },

  /**
   * Update avatar image URL.
   */
  async updateAvatar(avatar: string): Promise<{ avatar: string }> {
    const response = await api.patch<ApiResponse<{ avatar: string }>>(
      `/teacher/profile/avatar`,
      { avatar }
    );
    return response.data.data;
  },

  /**
   * Delete custom avatar and reset to default.
   */
  async deleteAvatar(): Promise<{ avatar: string }> {
    const response = await api.delete<ApiResponse<{ avatar: string }>>(
      `/teacher/profile/avatar`
    );
    return response.data.data;
  },

  /**
   * Update cover image URL.
   */
  async updateCover(coverImage: string): Promise<{ coverImage: string }> {
    const response = await api.patch<ApiResponse<{ coverImage: string }>>(
      `/teacher/profile/cover`,
      { coverImage }
    );
    return response.data.data;
  },

  /**
   * Delete cover image and reset to default.
   */
  async deleteCover(): Promise<{ coverImage: string }> {
    const response = await api.delete<ApiResponse<{ coverImage: string }>>(
      `/teacher/profile/cover`
    );
    return response.data.data;
  },

  /**
   * Change teacher password.
   */
  async changePassword(data: ChangePasswordInput): Promise<void> {
    await api.patch(`/teacher/profile/password`, data);
  },

  /**
   * Update teacher email address.
   */
  async updateEmail(email: string): Promise<{ email: string }> {
    const response = await api.patch<ApiResponse<{ email: string }>>(
      `/teacher/profile/email`,
      { email }
    );
    return response.data.data;
  },

  /**
   * Get profile completeness percentage and missing fields.
   */
  async getCompleteness(): Promise<ProfileCompleteness> {
    const response = await api.get<ApiResponse<ProfileCompleteness>>(
      `/teacher/profile/completeness`
    );
    return response.data.data;
  },

  /**
   * Get teacher profile analytics.
   */
  async getAnalytics(): Promise<ProfileAnalyticsData> {
    const response = await api.get<ApiResponse<ProfileAnalyticsData>>(
      `/teacher/profile/analytics`
    );
    return response.data.data;
  },
};

export default teacherProfileService;

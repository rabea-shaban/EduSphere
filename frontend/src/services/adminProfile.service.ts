import api from "./api";

export interface AdminUserProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export const adminProfileService = {
  // Get current logged in user profile
  getProfile: async (): Promise<AdminUserProfile> => {
    const response = await api.get("/auth/me");
    return response.data?.data;
  },

  // Update profile basic info
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
  }): Promise<AdminUserProfile> => {
    const response = await api.patch("/auth/profile", data);
    return response.data?.data;
  },

  // Update avatar (Base64 or image URL)
  updateAvatar: async (avatar: string): Promise<AdminUserProfile> => {
    const response = await api.patch("/auth/avatar", { avatar });
    return response.data?.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<any> => {
    const response = await api.patch("/auth/change-password", passwordData);
    return response.data;
  },
};

export default adminProfileService;

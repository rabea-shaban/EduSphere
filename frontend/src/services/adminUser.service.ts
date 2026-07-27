import api from "./api";

export interface SystemUserItem {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  phone?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  isBlocked: boolean;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface GetUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isBlocked?: boolean;
}

export interface GetUsersResponse {
  users: SystemUserItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const adminUserService = {
  // Fetch users with filters
  getUsers: async (params?: GetUsersQueryParams): Promise<GetUsersResponse> => {
    const response = await api.get("/users", { params });
    return response.data?.data || { users: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  },

  // Toggle freeze/block status
  toggleUserBlockStatus: async (userId: string, isBlocked: boolean): Promise<any> => {
    if (isBlocked) {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } else {
      const response = await api.patch(`/users/${userId}/restore`);
      return response.data;
    }
  },

  // Change User Role
  updateUserRole: async (userId: string, roleName: string): Promise<any> => {
    const response = await api.patch(`/admin/users/${userId}/roles`, { roleName });
    return response.data;
  },

  // Create User
  createUser: async (userData: any): Promise<any> => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  // Delete User Permanently
  deleteUserPermanent: async (userId: string): Promise<any> => {
    const response = await api.delete(`/users/${userId}/permanent`);
    return response.data;
  },
};

export default adminUserService;

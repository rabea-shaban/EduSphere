import api from "./api";

export interface PermissionItem {
  module: string;
  actions: string[];
}

export interface AdminRoleItem {
  _id: string;
  name: string;
  displayNameAr: string;
  displayNameEn: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  permissionsCount: number;
  usersCount: number;
  permissions: PermissionItem[];
  createdAt: string;
}

export interface SystemPermissionsSchema {
  modules: { key: string; nameAr: string }[];
  actions: { key: string; nameAr: string }[];
}

export const adminRoleService = {
  async getRoles(): Promise<AdminRoleItem[]> {
    const response = await api.get<{ success: boolean; data: AdminRoleItem[] }>("/admin/roles");
    return response.data.data;
  },

  async getPermissionsSchema(): Promise<SystemPermissionsSchema> {
    const response = await api.get<{ success: boolean; data: SystemPermissionsSchema }>("/admin/permissions");
    return response.data.data;
  },

  async createRole(data: {
    name: string;
    displayNameAr: string;
    displayNameEn?: string;
    description?: string;
    permissions?: PermissionItem[];
  }): Promise<AdminRoleItem> {
    const response = await api.post<{ success: boolean; data: AdminRoleItem }>("/admin/roles", data);
    return response.data.data;
  },

  async updateRole(id: string, data: Partial<AdminRoleItem>): Promise<AdminRoleItem> {
    const response = await api.patch<{ success: boolean; data: AdminRoleItem }>(`/admin/roles/${id}`, data);
    return response.data.data;
  },

  async deleteRole(id: string): Promise<void> {
    await api.delete(`/admin/roles/${id}`);
  },

  async assignUserRole(userId: string, roleName: string): Promise<void> {
    await api.patch(`/admin/users/${userId}/roles`, { roleName });
  },
};

export default adminRoleService;

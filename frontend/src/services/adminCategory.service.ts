import api from "./api";

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  coursesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  educationStage: string;
  grades?: any[];
  isActive: boolean;
  coursesCount: number;
  teachersCount: number;
  createdAt: string;
}

export interface GradeItem {
  _id: string;
  nameAr: string;
  nameEn: string;
  order: number;
  educationStage: string;
  description?: string;
  isActive: boolean;
  coursesCount: number;
  studentsCount: number;
}

export const adminCategoryService = {
  // Categories
  async getCategories(type?: string): Promise<CategoryItem[]> {
    const response = await api.get<{ success: boolean; data: CategoryItem[] }>("/admin/categories", {
      params: { type },
    });
    return response.data.data;
  },

  async createCategory(data: { name: string; description?: string; type?: string }): Promise<CategoryItem> {
    const response = await api.post<{ success: boolean; data: CategoryItem }>("/admin/categories", data);
    return response.data.data;
  },

  async updateCategory(id: string, data: { name?: string; description?: string; type?: string }): Promise<CategoryItem> {
    const response = await api.patch<{ success: boolean; data: CategoryItem }>(`/admin/categories/${id}`, data);
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  },

  // Subjects
  async getSubjects(): Promise<SubjectItem[]> {
    const response = await api.get<{ success: boolean; data: SubjectItem[] }>("/admin/subjects");
    return response.data.data;
  },

  async createSubject(data: {
    name: string;
    description?: string;
    educationStage?: string;
    icon?: string;
    color?: string;
  }): Promise<SubjectItem> {
    const response = await api.post<{ success: boolean; data: SubjectItem }>("/admin/subjects", data);
    return response.data.data;
  },

  async updateSubject(id: string, data: Partial<SubjectItem>): Promise<SubjectItem> {
    const response = await api.patch<{ success: boolean; data: SubjectItem }>(`/admin/subjects/${id}`, data);
    return response.data.data;
  },

  async deleteSubject(id: string): Promise<void> {
    await api.delete(`/admin/subjects/${id}`);
  },

  // Grades
  async getGrades(): Promise<GradeItem[]> {
    const response = await api.get<{ success: boolean; data: GradeItem[] }>("/admin/grades");
    return response.data.data;
  },

  async createGrade(data: {
    nameAr: string;
    nameEn: string;
    order: number;
    educationStage?: string;
    description?: string;
  }): Promise<GradeItem> {
    const response = await api.post<{ success: boolean; data: GradeItem }>("/admin/grades", data);
    return response.data.data;
  },

  async updateGrade(id: string, data: Partial<GradeItem>): Promise<GradeItem> {
    const response = await api.patch<{ success: boolean; data: GradeItem }>(`/admin/grades/${id}`, data);
    return response.data.data;
  },

  async deleteGrade(id: string): Promise<void> {
    await api.delete(`/admin/grades/${id}`);
  },
};

export default adminCategoryService;

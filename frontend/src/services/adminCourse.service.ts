import api from "./api";

export interface AdminCourseItem {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  price: number;
  discountPrice?: number;
  isFree: boolean;
  isFeatured: boolean;
  status: "Draft" | "Published" | "Archived" | "Pending";
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  teacher: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  subjectName: string;
  gradeName: string;
  enrollmentCount: number;
  revenue: number;
  unitsCount: number;
  lessonsCount: number;
}

export interface AdminCourseDetails {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  previewVideo?: string;
  price: number;
  discountPrice?: number;
  isFree: boolean;
  isFeatured: boolean;
  status: "Draft" | "Published" | "Archived" | "Pending";
  level: string;
  language: string;
  objectives: string[];
  requirements: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  teacher: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  subject?: any;
  grade?: any;
  academicYear?: any;
  term?: any;
  curriculum: any[];
  statistics: {
    enrollmentsCount: number;
    completedEnrollmentsCount: number;
    completionRate: string;
    quizzesCount: number;
    totalRevenue: number;
    rating: number;
    reviewCount: number;
  };
}

export interface GetCoursesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isFree?: string;
  isFeatured?: string;
  teacher?: string;
  subject?: string;
  grade?: string;
  sort?: string;
}

export interface GetCoursesResponse {
  courses: AdminCourseItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminCourseService = {
  async getCourses(params: GetCoursesQueryParams = {}): Promise<GetCoursesResponse> {
    const response = await api.get<{ success: boolean; data: GetCoursesResponse }>("/admin/courses", {
      params,
    });
    return response.data.data;
  },

  async getCourseById(id: string): Promise<AdminCourseDetails> {
    const response = await api.get<{ success: boolean; data: AdminCourseDetails }>(`/admin/courses/${id}`);
    return response.data.data;
  },

  async getCourseEnrollments(id: string): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: any[] }>(`/admin/courses/${id}/enrollments`);
    return response.data.data;
  },

  async updateCourse(id: string, data: Partial<AdminCourseDetails>): Promise<AdminCourseDetails> {
    const response = await api.patch<{ success: boolean; data: AdminCourseDetails }>(`/admin/courses/${id}`, data);
    return response.data.data;
  },

  async approveCourse(id: string): Promise<void> {
    await api.patch(`/admin/courses/${id}/approve`);
  },

  async rejectCourse(id: string, reason: string): Promise<void> {
    await api.patch(`/admin/courses/${id}/reject`, { reason });
  },

  async toggleFeature(id: string): Promise<void> {
    await api.patch(`/admin/courses/${id}/feature`);
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await api.patch(`/admin/courses/${id}/status`, { status });
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/admin/courses/${id}`);
  },
};

export default adminCourseService;

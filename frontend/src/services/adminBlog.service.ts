import api from "./api";

export interface BlogPostItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  authorId?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
  categoryId?: {
    _id: string;
    name: string;
    slug?: string;
  };
  tags?: string[];
  status: "Draft" | "Published";
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  blogs: BlogPostItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminBlogService = {
  async getBlogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }): Promise<BlogsResponse> {
    const response = await api.get<{ success: boolean; data: BlogsResponse }>("/admin/blog", {
      params,
    });
    return response.data.data;
  },

  async getBlogById(id: string): Promise<BlogPostItem> {
    const response = await api.get<{ success: boolean; data: BlogPostItem }>(`/admin/blog/${id}`);
    return response.data.data;
  },

  async createBlog(data: {
    title: string;
    excerpt?: string;
    content: string;
    status?: "Draft" | "Published";
    categoryId?: string;
    thumbnail?: string;
    tags?: string[];
  }): Promise<BlogPostItem> {
    const response = await api.post<{ success: boolean; data: BlogPostItem }>("/admin/blog", data);
    return response.data.data;
  },

  async updateBlog(id: string, data: Partial<BlogPostItem>): Promise<BlogPostItem> {
    const response = await api.patch<{ success: boolean; data: BlogPostItem }>(`/admin/blog/${id}`, data);
    return response.data.data;
  },

  async deleteBlog(id: string): Promise<void> {
    await api.delete(`/admin/blog/${id}`);
  },
};

export default adminBlogService;

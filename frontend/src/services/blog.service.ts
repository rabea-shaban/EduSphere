import api from "./api";

export interface PublicBlogPost {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  status: "Published" | "Draft" | "Archived";
  views: number;
  likes?: number;
  coverImage?: string;
  thumbnail?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  authorId?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role?: string;
  };
  categoryId?: {
    _id: string;
    name?: string;
    slug?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const blogService = {
  /**
   * Get single blog post by ID or Slug (Public Endpoint)
   */
  async getPublicBlogById(idOrSlug: string): Promise<PublicBlogPost> {
    const response = await api.get<{ success: boolean; data: PublicBlogPost }>(`/blogs/${idOrSlug}`);
    return response.data.data;
  },

  /**
   * Get list of published public blog posts
   */
  async getPublicBlogs(params?: { page?: number; limit?: number; search?: string }): Promise<{ blogs: PublicBlogPost[]; total: number }> {
    const response = await api.get<{ success: boolean; data: { blogs: PublicBlogPost[]; pagination: { total: number } } }>("/blogs", { params });
    return {
      blogs: response.data.data.blogs || [],
      total: response.data.data.pagination?.total || 0,
    };
  },
};

export default blogService;

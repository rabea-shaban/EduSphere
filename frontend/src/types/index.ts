export type UserRole = "admin" | "instructor" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  instructorId: string;
  instructorName: string;
  price: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}

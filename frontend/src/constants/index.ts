export const SITE_METADATA = {
  title: "EduSphere | Modern SaaS Learning Management Platform",
  description:
    "EduSphere is an enterprise-grade learning management SaaS designed to deliver premium course experiences, monitor learner analytics, and scale education seamlessly.",
  url: "https://edusphere.example.com",
  ogImage: "/assets/images/og-image.png",
  keywords: [
    "LMS",
    "SaaS LMS",
    "EduSphere",
    "E-Learning",
    "Education Platform",
    "Course Management",
    "Modern Classroom",
  ],
  author: "EduSphere Engineering Team",
} as const;

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFILE_SETUP: "/profile/setup",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  SETTINGS: "/dashboard/settings",
  PROFILE: "/dashboard/profile",
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh-token",
  },
  COURSES: {
    LIST: "/courses",
    DETAIL: (id: string) => `/courses/${id}`,
    CREATE: "/courses",
    UPDATE: (id: string) => `/courses/${id}`,
    DELETE: (id: string) => `/courses/${id}`,
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  THEME: "theme",
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds default timeout
});

// Request Interceptor: Attach bearer token if present
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unified error handling and authorization checks
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: "An unexpected error occurred. Please try again.",
    };

    if (error.response) {
      apiError.statusCode = error.response.status;
      apiError.message = error.response.data?.message || error.message;
      apiError.errors = error.response.data?.errors;

      // Handle session expiration
      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          window.dispatchEvent(new Event("auth:unauthorized"));
        }
      }
    } else if (error.request) {
      apiError.message = "Unable to connect to the server. Please check your internet connection.";
    } else {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

export default api;
export { AxiosError };

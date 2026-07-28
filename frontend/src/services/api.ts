import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { toast } from "react-hot-toast";

export interface ApiErrorPayload {
  success: boolean;
  message: string;
  errorCode?: string;
  details?: any[];
  timestamp?: string;
  path?: string;
  requestId?: string;
  statusCode?: number;
}

const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 20000, // 20 seconds timeout
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

// Response Interceptor: Centralized Error handling with session protection
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const errorPayload: ApiErrorPayload = {
      success: false,
      message: "حدث خطأ غير متوقع في الاتصال بالخادم",
    };

    if (error.response) {
      const status = error.response.status;
      errorPayload.statusCode = status;
      errorPayload.message = error.response.data?.message || "حدث خطأ أثناء معالجة الطلب";
      errorPayload.errorCode = error.response.data?.errorCode;
      errorPayload.details = error.response.data?.details;

      // Handle session expiration silently (dispatch event for auth context to handle redirect)
      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          window.dispatchEvent(new Event("auth:unauthorized"));
        }
      } else if (status === 429) {
        toast.error("تم تجاوز عدد الطلبات المسموح بها، يرجى الانتظار دقيقة وإعادة المحاولة.");
      }
    } else if (error.request) {
      errorPayload.message = "تعذر الاتصال بالخادم، يرجى التحقق من اتصال شبكة الإنترنت.";
    } else {
      errorPayload.message = error.message || "حدث خطأ غير متوقع في معالجة البيانات";
    }

    const apiError = new Error(errorPayload.message);
    Object.assign(apiError, errorPayload);

    return Promise.reject(apiError);
  }
);

export default api;
export { AxiosError };

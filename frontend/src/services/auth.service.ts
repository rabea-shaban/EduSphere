import api from "./api";
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput, AuthUser } from "@/features/auth";

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: AuthUser;
    accessToken?: string;
    refreshToken?: string;
  };
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    const rawUser = data.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") || "user";
    const username = (rawUser + Math.floor(1000 + Math.random() * 9000)).slice(0, 30);

    const parts = data.fullName.trim().split(" ");
    const firstName = parts[0] || "User";
    const lastName = parts.slice(1).join(" ").trim() || "Member";

    const payload = {
      firstName,
      lastName,
      username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "STUDENT",
    };
    const response = await api.post<AuthResponse>("/auth/register", payload);
    if (response.data.data?.accessToken) {
      localStorage.setItem("auth_token", response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
      emailOrUsername: data.identifier,
      password: data.password,
    });
    if (response.data.data?.accessToken) {
      localStorage.setItem("auth_token", response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("auth_token");
    }
  },

  /**
   * Request password reset code
   */
  async forgotPassword(data: ForgotPasswordInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/forgot-password", {
      email: data.identifier,
    });
    return response.data;
  },

  /**
   * Reset password with OTP / token
   */
  async resetPassword(data: ResetPasswordInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/reset-password", {
      token: data.code,
      password: data.newPassword,
    });
    return response.data;
  },

  /**
   * Get current authenticated user session
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
      return null;
    }
    try {
      const response = await api.get<{ success: boolean; data: { user: AuthUser } | AuthUser }>("/auth/me");
      const userData = (response.data.data as any)?.user || response.data.data;
      return userData || null;
    } catch {
      return null;
    }
  },
};

export default authService;

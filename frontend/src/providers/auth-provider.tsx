"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthUser, LoginInput, RegisterInput } from "@/features/auth";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoadingUser, isLoggedIn, login: loginApi, register: registerApi, logout: logoutApi } = useAuth();

  const role = user?.role ? user.role.toLowerCase() : null;

  // Role-based Redirection helper
  const redirectByRole = React.useCallback(
    (userRole?: string) => {
      const normalizedRole = (userRole || role || "student").toLowerCase();
      if (normalizedRole.includes("admin") || normalizedRole === "super_admin") {
        router.push("/admin/dashboard");
      } else if (normalizedRole === "teacher") {
        router.push("/teacher/dashboard");
      } else {
        router.push("/dashboard");
      }
    },
    [role, router]
  );

  // Protected Route Route Guard
  React.useEffect(() => {
    if (isLoadingUser) return;

    const isAuthRoute = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/admin/login",
    ].some((path) => pathname.startsWith(path));

    // Public pages like /teacher/apply, /teacher/register, /teacher/status, and /admin/login must NOT be treated as protected routes
    const isPublicUnprotectedRoute =
      pathname.startsWith("/teacher/apply") ||
      pathname.startsWith("/teacher/register") ||
      pathname.startsWith("/teacher/status") ||
      pathname.startsWith("/admin/login");

    const isProtectedRoute = !isPublicUnprotectedRoute && ["/dashboard", "/teacher", "/admin"].some((path) =>
      pathname.startsWith(path)
    );

    // If authenticated user tries to access auth routes, redirect to their role dashboard
    if (isLoggedIn && isAuthRoute) {
      redirectByRole();
    }

    // If unauthenticated guest tries to access protected routes, redirect to login
    if (!isLoggedIn && isProtectedRoute) {
      toast.error("يرجى تسجيل الدخول أولاً للوصول إلى هذه الصفحة 🔒");
      router.push("/login");
    }
  }, [isLoggedIn, isLoadingUser, pathname, redirectByRole, router]);

  const handleLogin = async (data: LoginInput) => {
    try {
      const res = await loginApi(data);
      toast.success("مرحباً بعودتك! تم تسجيل الدخول بنجاح 🎉");
      const userRole = res?.data?.user?.role || "student";
      redirectByRole(userRole);
    } catch (err: any) {
      const errorMessage = err?.message || "بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleRegister = async (data: RegisterInput) => {
    try {
      const res = await registerApi(data);
      toast.success("تم إنشاء حسابك بنجاح! مرحباً بك في EduSphere 🎉");
      const userRole = res?.data?.user?.role || "student";
      router.push("/profile/setup");
    } catch (err: any) {
      const errorMessage = err?.message || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        role,
        isAuthenticated: isLoggedIn,
        isLoading: isLoadingUser,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

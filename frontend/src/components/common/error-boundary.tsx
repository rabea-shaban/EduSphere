"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught application exception:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen py-16 px-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-right dir-rtl transition-colors">
          <div className="max-w-md w-full bg-white dark:bg-[#0F274D] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-center">
            <div className="h-20 w-20 rounded-full bg-rose-500/10 text-rose-500 border-2 border-rose-500/20 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10 animate-pulse">
              <AlertTriangle className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
                عذراً، حدث خطأ غير متوقع 🛠️
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                تم مواجهة مشكلة برمجية أثناء تشغيل هذه الصفحة. تم تسجيل الخطأ تلقائياً لتصحيحه فوراً.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-[11px] text-rose-700 dark:text-rose-300 font-mono text-right overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 h-11 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>إعادة تحميل الصفحة</span>
              </button>

              <Link
                href="/"
                className="flex-1 h-11 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>الصفحة الرئيسية</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  BookOpen,
  FileText,
  HelpCircle,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import api from "@/services/api";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type?: string;
  category?: string;
}

export function NotificationDropdown() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["header-notifications"],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<any>>("/teacher/notifications", {
          params: { limit: 8 },
        });
        return res.data.data;
      } catch {
        const res = await api.get<ApiResponse<any>>("/notifications", {
          params: { limit: 8 },
        });
        return res.data.data;
      }
    },
    staleTime: 30_000,
  });

  const markAllReadM = useMutation({
    mutationFn: async () => {
      try {
        await api.patch("/teacher/notifications/read-all");
      } catch {
        await api.patch("/notifications/mark-all-read");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["header-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-notifications"] });
    },
  });

  const notifications: NotificationItem[] = data?.notifications || [];
  const unreadCount =
    data?.unreadCount ?? notifications.filter((n) => !n.isRead).length;

  const getIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "course":
        return <BookOpen className="h-4 w-4 text-indigo-500 shrink-0" />;
      case "assignment":
        return <FileText className="h-4 w-4 text-[#F58220] shrink-0" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-[#0B2D5B] shrink-0" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl h-10 w-10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          aria-label={`التنبيهات، ${unreadCount} غير مقروء`}
        >
          <Bell className="h-5 w-5 shrink-0" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full bg-[#F58220] ring-2 ring-white dark:ring-[#0B2D5B] rtl:left-2 rtl:right-auto" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2 text-right dir-rtl">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-xs font-black text-[#0B2D5B] dark:text-white">
            الإشعارات والتنبيهات
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadM.mutate()}
              disabled={markAllReadM.isPending}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <CheckCheck className="h-3 w-3 shrink-0" />
              تحديد الكل كمقروء
            </button>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-72 overflow-y-auto space-y-1 py-1">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-slate-400 font-bold">
              جاري تحميل الإشعارات...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-xs text-slate-400 py-6">
              لا توجد إشعارات جديدة حالياً.
            </div>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item._id}
                className={cn(
                  "flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer text-right dir-rtl",
                  !item.isRead
                    ? "bg-indigo-50/60 dark:bg-white/5 font-bold"
                    : "opacity-75"
                )}
              >
                <div className="rounded-xl bg-slate-100 dark:bg-white/10 p-2 shrink-0 mt-0.5">
                  {getIcon(item.type || item.category)}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="text-xs text-[#0B2D5B] dark:text-white font-bold truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="block text-[9px] text-slate-400 font-mono mt-1">
                    {new Date(item.createdAt).toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="p-1 text-center">
          <Link
            href="/teacher/notifications"
            className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline block py-1"
          >
            عرض كافة الإشعارات
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationDropdown;

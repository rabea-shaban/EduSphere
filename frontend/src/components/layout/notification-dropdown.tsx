"use client";

import * as React from "react";
import { Bell, CheckCheck, BookOpen, UserCheck, ShieldAlert } from "lucide-react";
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

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "course" | "enroll" | "alert";
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Course Enrolled",
    description: "You have been enrolled in Next.js Advanced.",
    time: "2 mins ago",
    read: false,
    type: "course",
  },
  {
    id: "2",
    title: "Instructor Review Complete",
    description: "Your assignment for Chapter 2 was approved.",
    time: "1 hour ago",
    read: false,
    type: "enroll",
  },
  {
    id: "3",
    title: "Server Update Completed",
    description: "Database maintenance finished successfully.",
    time: "1 day ago",
    read: true,
    type: "alert",
  },
];

export function NotificationDropdown() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-4 w-4 text-secondary shrink-0" />;
      case "enroll":
        return <UserCheck className="h-4 w-4 text-success shrink-0" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-warning shrink-0" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label={`Notifications, ${unreadCount} unread`}
        >
          <Bell className="h-4.5 w-4.5 shrink-0" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-accent ring-2 ring-card rtl:left-2 rtl:right-auto" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <CheckCheck className="h-3 w-3 shrink-0" />
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto space-y-1 py-1">
          {notifications.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-6">
              No new notifications.
            </div>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className={cn(
                  "flex items-start gap-3 p-2.5 rounded-lg transition-colors cursor-pointer text-left rtl:text-right",
                  !item.read ? "bg-muted/40 font-bold" : "opacity-80"
                )}
              >
                <div className="rounded-lg bg-muted p-1.5 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs text-foreground truncate">{item.title}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="block text-[8px] text-muted-foreground/80">{item.time}</span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default NotificationDropdown;

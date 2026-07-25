"use client";

import * as React from "react";
import { User as UserIcon, Settings, CreditCard, LogOut } from "lucide-react";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";

export function ProfileDropdown() {
  const handleLogout = () => {
    toast.success("Signed out successfully.");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0">
        <Avatar status="online" className="h-9 w-9">
          <AvatarImage src="https://github.com/shadcn.png" alt="User Profile" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User Profile" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-xs font-bold text-foreground truncate">Admin User</h4>
            <p className="text-[10px] text-muted-foreground truncate">admin@edusphere.com</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard/profile" className="flex items-center gap-2 w-full">
              <UserIcon className="h-4 w-4 shrink-0" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard/settings" className="flex items-center gap-2 w-full">
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard/billing" className="flex items-center gap-2 w-full">
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-danger focus:bg-danger/15 focus:text-danger cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ProfileDropdown;

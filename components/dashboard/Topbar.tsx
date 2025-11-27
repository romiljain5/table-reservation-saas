"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";
import RestaurantSwitcher from "./RestaurantSwitcher";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Topbar({ user }: { user: any }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "h-16 border-b flex items-center justify-between px-4 lg:px-6 backdrop-blur-sm",
        "border-slate-200 bg-white/70 dark:bg-neutral-900/80 dark:border-neutral-800"
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          TableFlow Admin
        </span>
        <span className="hidden md:inline text-xs text-slate-400">
          Manage across all restaurants
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Restaurant Switcher */}
        <RestaurantSwitcher />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          {/* Notification Dot */}
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border dark:border-neutral-700">
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <ChevronsUpDown size={16} className="text-slate-500 dark:text-slate-300" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <div className="px-3 py-2 text-xs">
              <div className="font-medium">{user?.name || "User"}</div>
              <div className="text-slate-500">{user?.email}</div>
            </div>

            <DropdownMenuSeparator />

            {/* Theme Toggle */}
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "dark" ? (
                <>
                  <Sun size={16} className="mr-2" /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={16} className="mr-2" /> Dark Mode
                </>
              )}
            </DropdownMenuItem>

            {/* Logout */}
            <DropdownMenuItem asChild>
              <LogoutButton icon={<LogOut size={16} />} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

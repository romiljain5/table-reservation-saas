"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Utensils,
  Users,
  Store,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Reservations", href: "/dashboard/reservations", icon: CalendarDays },
  { label: "Tables", href: "/dashboard/tables", icon: Utensils },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Restaurants", href: "/dashboard/restaurants", icon: Store },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col
      border-r border-slate-200 dark:border-neutral-800
      bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm"
    >
      {/* Brand */}
      <div className="h-16 px-6 flex items-center border-b 
        border-slate-200 dark:border-neutral-800"
      >
        <span className="text-lg font-semibold tracking-tight">
          Table<span className="text-slate-500 dark:text-slate-300">Flow</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white dark:bg-slate-700"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="border-t border-slate-200 dark:border-neutral-800 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=JL"
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-slate-300 dark:border-neutral-700"
          />

          {/* Name */}
          <div className="flex-1 text-sm text-slate-700 dark:text-slate-300">
            John Manager
          </div>

          {/* Logout */}
          <button
            className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} TableFlow
        </p>
      </div>
    </aside>
  );
}

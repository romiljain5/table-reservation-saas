"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // if you don't have this, I’ll paste it below

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Reservations", href: "/dashboard/reservations" },
  { label: "Tables", href: "/dashboard/tables" },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Restaurants", href: "/dashboard/restaurants" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-slate-200 bg-white/80 backdrop-blur-sm lg:flex lg:w-64 xl:w-72 flex-col">
      {/* Brand */}
      <div className="h-16 px-6 flex items-center border-b border-slate-200">
        <span className="text-lg font-semibold tracking-tight">
          Table<span className="text-slate-500">Flow</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-400">
        © {new Date().getFullYear()} TableFlow · Admin
      </div>
    </aside>
  );
}

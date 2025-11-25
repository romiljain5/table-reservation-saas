import { ReactNode } from "react";
import LogoutButton from "./LogoutButton";
import RestaurantSwitcher from "./RestaurantSwitcher";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Topbar({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  if (!session) redirect("/login");

  const user = session.user;

  return (
    <header className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">
          Multi-tenant Dashboard
        </span>
        <span className="hidden text-xs text-slate-400 md:inline">
          Manage reservations across all restaurants.
        </span>
      </div>

      <div className="flex items-center gap-3">

        <RestaurantSwitcher />

        {/* Logout */}
        {user && <LogoutButton />}

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-l font-semibold text-slate-600">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>

          <div className="text-xs leading-tight">
            <div className="font-medium text-slate-700">
              {user.name || "User"}
            </div>
            <div className="text-slate-400">{user.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

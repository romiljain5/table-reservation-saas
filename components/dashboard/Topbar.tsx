"use client";

export default function Topbar() {
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

      {/* Right side – we’ll hook this into auth later */}
      <div className="flex items-center gap-3">
        <button className="hidden md:inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">
          Switch restaurant
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="text-xs leading-tight">
            <div className="font-medium text-slate-700">Admin User</div>
            <div className="text-slate-400">admin@yourapp.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}

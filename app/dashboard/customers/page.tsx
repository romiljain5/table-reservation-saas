"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/customers");
      return res.json();
    },
  });

  if (isLoading) return "Loading...";

  return (
    <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6">
      <h1 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Customers
      </h1>

      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No customers found.</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
            <tr className="border-b border-slate-200 dark:border-neutral-700">
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Tags</th>
              <th className="px-4 py-2 text-left">Visits</th>
              <th className="px-4 py-2 text-left">Last Visit</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((c: any) => (
              <tr
                key={c.id}
                className="border-b border-slate-100 dark:border-neutral-800 hover:bg-slate-50/60 dark:hover:bg-neutral-800 transition"
              >
                {/* Avatar + Name + Email */}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-neutral-700 text-xs font-medium">
                      {(c.name || "U")[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {c.name}
                      </span>
                      {c.email && (
                        <span className="text-xs text-slate-500">
                          {c.email}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2 text-slate-600 dark:text-slate-300">
                  {c.phone}
                </td>

                {/* Tags */}
                <td className="px-4 py-2">
                  {c.tags?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[11px] bg-slate-100 dark:bg-neutral-700 text-slate-700 dark:text-neutral-300 rounded-full border border-slate-200 dark:border-neutral-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">No Tags</span>
                  )}
                </td>

                {/* Visits */}
                <td
                  className={cn(
                    "px-4 py-2 font-medium",
                    c.visits > 5
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300"
                  )}
                >
                  {c.visits}
                </td>

                {/* Last Visit */}
                <td className="px-4 py-2 text-slate-500 dark:text-neutral-400">
                  {c.lastVisit
                    ? new Date(c.lastVisit).toLocaleDateString()
                    : "—"}
                </td>

                {/* Action */}
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/dashboard/customers/${c.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

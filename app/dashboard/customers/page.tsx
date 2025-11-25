"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function CustomersPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/customers");
      return res.json();
    }
  });

  if (isLoading) return "Loading...";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <h1 className="text-xl font-semibold mb-4">Customers</h1>

      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Visits</th>
            <th className="px-4 py-2">Last Visit</th>
            <th className="px-4 py-2">Profile</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c: any) => (
            <tr
              key={c.id}
              className="border-b border-slate-100 last:border-none hover:bg-slate-50/60"
            >
              <td className="px-4 py-2 font-medium">{c.name}</td>

              <td className="px-4 py-2 text-slate-600">{c.phone}</td>

              <td className="px-4 py-2 text-slate-600">{c.visits}</td>

              <td className="px-4 py-2 text-slate-500">
                {c.lastVisit
                  ? new Date(c.lastVisit).toLocaleDateString()
                  : "—"}
              </td>

              <td className="px-4 py-2">
                <Link
                  className="text-blue-600 hover:underline"
                  href={`/dashboard/customers/${c.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

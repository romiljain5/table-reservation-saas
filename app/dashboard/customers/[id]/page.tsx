"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const res = await fetch(`/api/customers/${id}`);
      return res.json();
    },
  });

  if (isLoading) return "Loading...";

  const customer = data;

  return (
    <div className="space-y-8 p-6">
            {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="rounded-xl border bg-white shadow-sm p-3 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header Card */}
      <div className="rounded-xl border bg-white shadow-sm p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {customer.name}
        </h1>

        <div className="mt-1 text-slate-600 text-sm">{customer.phone}</div>
        {customer.email && (
          <div className="text-slate-600 text-sm">{customer.email}</div>
        )}

        <div className="mt-2 text-xs text-slate-400">
          {customer.visits} visits • Last visit:{" "}
          {customer.lastVisit
            ? new Date(customer.lastVisit).toLocaleDateString()
            : "—"}
        </div>

        {/* Tags */}
        {customer.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {customer.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 text-[11px] rounded-full border bg-slate-50 text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visit History */}
      <div className="rounded-xl border bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Visit History</h2>

        {customer.reservations.length === 0 ? (
          <div className="text-sm text-slate-500">
            No past reservations found.
          </div>
        ) : (
          <table className="min-w-full text-sm table-fixed">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-2 w-36 text-left font-medium text-slate-600">
                  Date
                </th>
                <th className="px-4 py-2 w-24 text-left font-medium text-slate-600">
                  Time
                </th>
                <th className="px-4 py-2 w-32 text-left font-medium text-slate-600">
                  Party Size
                </th>
                <th className="px-4 py-2 w-32 text-left font-medium text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {customer.reservations.map((r: any) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-100 last:border-none hover:bg-slate-50/60"
                >
                  <td className="px-4 py-2 w-36">
                    {new Date(r.date).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-2 w-24">{r.time}</td>

                  <td className="px-4 py-2 w-32">Party of {r.partySize}</td>

                  <td className="px-4 py-2 w-32">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

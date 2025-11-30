"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function PublicRestaurants() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-restaurants"],
    queryFn: async () => {
      const res = await fetch("/api/restaurants/public");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((r: any) => (
        <Link
          key={r.id}
          href={`/restaurants/${r.slug}`}
          className="border rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition p-4 space-y-2"
        >
          <div className="h-40 bg-slate-100 dark:bg-neutral-700 rounded-lg" />
          <h2 className="font-semibold text-lg">{r.name}</h2>
          <p className="text-slate-500 text-sm">{r.city}</p>
        </Link>
      ))}
    </div>
  );
}

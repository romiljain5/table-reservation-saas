"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function PublicRestaurantPage() {
  const { slug } = useParams();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant-public", slug],
    queryFn: async () => {
      const res = await fetch(`/api/restaurants/public/${slug}`);
      return res.json();
    },
  });

  if (isLoading) return "Loading...";

  return (
    <div className="p-6 space-y-8">
      {/* Hero image */}
      <div className="w-full h-64 rounded-xl bg-slate-200" />

      {/* Basic Info */}
      <div>
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-slate-500">{restaurant.city}</p>
        <p className="text-sm text-slate-400">{restaurant.phone}</p>
      </div>

      {/* CTA */}
      <Link href={`/reserve/${restaurant.slug}`}>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800">
          Reserve a Table
        </button>
      </Link>

      {/* Sections: Description, Menu, Hours */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <h2 className="font-semibold mb-2">About</h2>
          <p>{restaurant.about || "Modern dining experience in the heart of the city."}</p>
        </div>

        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Hours</h2>
          <pre className="text-xs">{JSON.stringify(restaurant.hoursJson, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

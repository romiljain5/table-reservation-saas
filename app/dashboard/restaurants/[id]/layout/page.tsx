"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RestaurantLayoutSetup() {
  const { id } = useParams();

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Setup Floor Layout
          </h1>
          <p className="text-sm text-slate-500">
            Add & arrange tables to match your real restaurant layout.
          </p>
        </div>

        <Link href={`/dashboard/restaurants/${id}`}>
          <Button variant="outline">← Back to Restaurant</Button>
        </Link>
      </div>

      {/* Placeholder for upcoming drag & drop */}
      <div className="rounded-xl border bg-slate-50 p-10 text-center text-slate-500">
        🏗️ Floor Layout Builder Coming Soon  
        <br />
        (Drag & Drop tables visually)
      </div>

      {/* Continue Setup Button */}
      <div className="flex justify-end">
        <Button
          onClick={() =>
            (window.location.href = `/dashboard/restaurants/${id}/hours`)
          }
          className="bg-slate-900 text-white hover:bg-slate-800"
        >
          Next: Set Hours →
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const steps = [
  { key: 1, label: "Basic Info" },
  { key: 2, label: "Floor Layout" },
  { key: 3, label: "Business Hours" },
  { key: 4, label: "Staff & Roles" },
];

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const res = await fetch(`/api/restaurants/${id}`);
      return res.json();
    },
  });

  if (isLoading) return "Loading...";

  const restaurant = data;
  const progress = (restaurant.setupStep / steps.length) * 100;
  const nextStep =
    steps.find((s) => s.key === restaurant.setupStep)?.label || "Setup Complete";

  const goToNext = () => {
    switch (restaurant.setupStep) {
      case 1:
        router.push(`/dashboard/restaurants/${id}/layout`);
        break;
      case 2:
        router.push(`/dashboard/restaurants/${id}/hours`);
        break;
      case 3:
        router.push(`/dashboard/restaurants/${id}/staff`);
        break;
      default:
        router.push(`/dashboard/restaurants`);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
          <p className="text-sm text-slate-500">
            Setup Status:{" "}
            <span className="font-medium">
              {restaurant.setupStep >= 4 ? "Active" : "Onboarding"}
            </span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600 mb-2 font-medium">
          {Math.round(progress)}% Complete — Next: {nextStep}
        </p>
        <div className="w-full h-3 bg-slate-200 rounded-full">
          <div
            className="h-3 bg-slate-900 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Button
          onClick={goToNext}
          className="mt-4 bg-slate-900 text-white hover:bg-slate-800"
        >
          {restaurant.setupStep >= 4 ? "View Dashboard" : `Continue Setup`}
        </Button>
      </div>

      {/* Checklist */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Setup Checklist</h2>

        <ul className="space-y-3">
          {steps.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className={`h-4 w-4 rounded-full border ${
                  restaurant.setupStep > s.key - 1
                    ? "bg-emerald-500 border-emerald-600"
                    : "border-slate-300"
                }`}
              />
              <span
                className={
                  restaurant.setupStep > s.key - 1
                    ? "text-slate-700 font-medium"
                    : "text-slate-500"
                }
              >
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
    
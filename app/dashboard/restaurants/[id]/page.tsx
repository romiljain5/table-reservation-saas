"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";

const steps = [
  { key: 1, label: "Basic Info" },
  { key: 2, label: "Floor Layout" },
  { key: 3, label: "Business Hours" },
  { key: 4, label: "Staff & Roles" },
];

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const res = await fetch(`/api/restaurants/${id}`);
      return res.json();
    },
  });

  if (isLoading || !restaurant)
    return <div className="p-6">Loading restaurant...</div>;

  const progress = (restaurant.setupStep / steps.length) * 100;
  const nextStep = steps.find((s) => s.key === restaurant.setupStep)?.label;
  const isComplete = restaurant.setupStep >= 4;

  const goToNext = () => {
    if (restaurant.setupStep === 1)
      router.push(`/dashboard/restaurants/${id}/layout`);
    else if (restaurant.setupStep === 2)
      router.push(`/dashboard/restaurants/${id}/hours`);
    else if (restaurant.setupStep === 3)
      router.push(`/dashboard/restaurants/${id}/staff`);
    else router.push(`/dashboard/restaurants`);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard/restaurants")}
        className="text-sm text-slate-600 dark:text-slate-300 flex items-center hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Restaurants
      </button>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Status:{" "}
            <span className="font-medium">
              {isComplete ? "Active ✓" : "Onboarding"}
            </span>
          </p>

          {restaurant.phone && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {restaurant.phone}
            </p>
          )}
          {restaurant.city && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {restaurant.city}, {restaurant.state}
            </p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-6 space-y-4">
        <div className="flex justify-between text-sm font-medium">
          <span
            className={`${
              isComplete ? "text-emerald-600" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {Math.round(progress)}% Complete
          </span>
          {!isComplete && (
            <span className="text-indigo-600 dark:text-indigo-400">
              Next: {nextStep}
            </span>
          )}
        </div>

        <div className="w-full h-3 bg-slate-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-3 bg-indigo-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Button
          onClick={goToNext}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white"
        >
          {isComplete ? "View Dashboard" : "Continue Setup →"}
        </Button>
      </div>

      {/* Checklist */}
      <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-6">
        <h2 className="font-semibold text-lg mb-4">Setup Checklist</h2>

        <ul className="space-y-3">
          {steps.map((s) => {
            const done = restaurant.setupStep >= s.key;
            return (
              <li
                key={s.key}
                className="flex items-center gap-3 text-sm"
              >
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}

                <span
                  className={
                    done
                      ? "text-slate-700 dark:text-slate-200 font-medium"
                      : "text-slate-500 dark:text-slate-400"
                  }
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

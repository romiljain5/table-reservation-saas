"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Store,
  Clock,
  Ban,
} from "lucide-react";
import EditRestaurantModal from "@/components/dashboard/EditRestaurantModal";

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
    return (
      <div className="p-6 text-slate-600 dark:text-slate-400">
        Loading restaurant...
      </div>
    );

  const progress = (restaurant.setupStep / steps.length) * 100;
  const nextStep = steps.find((s) => s.key === restaurant.setupStep)?.label;
  const isComplete = restaurant.setupStep >= steps.length;

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
    <div className="max-w-7xl mx-auto p-6 space-y-10 text-slate-900 dark:text-slate-100">
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard/restaurants")}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Restaurants
      </button>

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 
        bg-gradient-to-br from-white to-slate-50 
        dark:from-neutral-900 dark:to-neutral-800 
        shadow-md p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex gap-5">
            <div className="relative h-24 w-24 rounded-xl 
              bg-slate-100 dark:bg-neutral-800 
              ring-1 ring-slate-200 dark:ring-neutral-700 
              shadow-inner overflow-hidden flex items-center justify-center">
              {restaurant.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Store className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {restaurant.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Restaurant Overview & Setup
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium
                    ${
                      restaurant.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                    }`}
                >
                  {restaurant.status}
                </span>

                {restaurant.isPublished && (
                  <span className="text-xs px-2 py-0.5 rounded-full 
                    bg-indigo-50 text-indigo-700 
                    dark:bg-indigo-500/10 dark:text-indigo-400">
                    Published
                  </span>
                )}
              </div>

              {restaurant.cuisines?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {restaurant.cuisines.map((c: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full 
                        bg-slate-100 text-slate-700 
                        dark:bg-neutral-800 dark:text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="flex gap-2 flex-wrap">
              <EditRestaurantModal restaurant={restaurant} />
              <Button
                variant="outline"
                className="dark:border-neutral-700 dark:text-slate-300"
                onClick={() =>
                  router.push(`/dashboard/restaurants/${id}/hours`)
                }
              >
                Edit Hours
              </Button>
              <Button
                variant="ghost"
                className="dark:text-slate-400 dark:hover:text-white"
                onClick={() =>
                  document
                    .getElementById("holidays-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Manage Holidays
              </Button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
              <div>
                Setup:{" "}
                <span className="font-medium">
                  {restaurant.setupStep}/{steps.length}
                </span>
              </div>
              <div>
                Created:{" "}
                <span className="font-medium">
                  {new Date(restaurant.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 
        bg-white dark:bg-neutral-900 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{Math.round(progress)}% Complete</span>
          </div>
          {!isComplete && (
            <span className="text-indigo-600 dark:text-indigo-400">
              Next: {nextStep}
            </span>
          )}
        </div>

        <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-3 bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all
              shadow-[0_0_12px_rgba(79,70,229,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Button
          onClick={goToNext}
          className="w-full text-base py-6 
            bg-slate-900 hover:bg-slate-800 text-white
            dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          {isComplete ? "Go to Dashboard →" : "Continue Setup →"}
        </Button>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 
        bg-white dark:bg-neutral-900 shadow-sm p-6">
        <h2 className="font-semibold text-lg mb-4">Setup Checklist</h2>

        <ul className="space-y-4">
          {steps.map((s) => {
            const done = restaurant.setupStep >= s.key;
            return (
              <li key={s.key} className="flex items-center gap-3 text-sm">
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                )}
                <span
                  className={
                    done
                      ? "font-medium text-slate-700 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500"
                  }
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Hours & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 
          bg-white dark:bg-neutral-900 shadow-sm p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Business Hours
          </h3>

          {restaurant.hoursJson?.length ? (
            <div className="grid grid-cols-2 gap-3">
              {restaurant.hoursJson.map((h: any) => (
                <div
                  key={h.day}
                  className="p-3 rounded-lg border 
                    bg-slate-50 dark:bg-neutral-800 
                    border-slate-200 dark:border-neutral-700"
                >
                  <div className="font-medium">{h.label}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {h.closed ? (
                      <span className="text-red-600 dark:text-red-400">
                        Closed
                      </span>
                    ) : (
                      `${h.open} – ${h.close}`
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No hours set.
            </p>
          )}
        </div>

        <div
          id="holidays-section"
          className="rounded-2xl border border-slate-200 dark:border-neutral-800 
            bg-white dark:bg-neutral-900 shadow-sm p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Ban className="w-4 h-4" />
            Blocked Dates
          </h3>

          {restaurant.holidaysJson?.length ? (
            <div className="space-y-3">
              {restaurant.holidaysJson.map((h: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg border 
                    border-slate-200 dark:border-neutral-700"
                >
                  <div>
                    <div className="font-medium">
                      {new Date(h.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {h.reason}
                    </div>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Blocked
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No blocked dates.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

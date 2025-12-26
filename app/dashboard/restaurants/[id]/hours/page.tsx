// app/dashboard/restaurants/[id]/hours/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import HolidaysManager from "@/components/dashboard/HolidaysManager";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type DayHours = {
  day: DayKey;
  label: string;
  open: string | null;
  close: string | null;
  closed: boolean;
};

const DAYS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

// 30-min slots from 06:00 to 23:30
const TIME_OPTIONS: string[] = (() => {
  const times: string[] = [];
  for (let h = 6; h <= 23; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
})();

const DEFAULT_DAY_HOURS: DayHours[] = DAYS.map((d) => ({
  day: d.key,
  label: d.label,
  open: "11:00",
  close: "22:00",
  closed: false,
}));

export default function RestaurantHoursPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hours, setHours] = useState<DayHours[]>(DEFAULT_DAY_HOURS);

  // Load restaurant (to get existing hoursJson + name + setupStep)
  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const res = await fetch(`/api/restaurants/${id}`);
      if (!res.ok) throw new Error("Failed to load restaurant");
      return res.json();
    },
  });

  // When restaurant loads, hydrate hours from hoursJson if present
  useEffect(() => {
    if (!restaurant) return;

    if (restaurant.hoursJson) {
      // Be defensive about shape
      try {
        const stored = restaurant.hoursJson as DayHours[];

        if (Array.isArray(stored) && stored.length === 7) {
          setHours(
            stored.map((h, i) => ({
              ...DEFAULT_DAY_HOURS[i],
              ...h,
            }))
          );
        }
      } catch {
        // fallback to defaults
        setHours(DEFAULT_DAY_HOURS);
      }
    } else {
      setHours(DEFAULT_DAY_HOURS);
    }
  }, [restaurant]);

  const saveMutation = useMutation({
    mutationFn: async (payload: { finish?: boolean }) => {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          hoursJson: hours,
          // bump setupStep to at least 3 when saving hours
          setupStep: Math.max(restaurant?.setupStep ?? 1, 3),
          // if finishing from here, you can also mark published/active
          ...(payload.finish
            ? {
                setupStep: 4,
                isPublished: true,
                status: "ACTIVE",
              }
            : {}),
        }),
      });

      if (!res.ok) throw new Error("Failed to save hours");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["restaurant", id]);
      toast.success(
        variables.finish
          ? "Hours saved and restaurant published!"
          : "Business hours saved."
      );
      if (variables.finish) {
        router.push("/dashboard/restaurants");
      }
    },
    onError: () => {
      toast.error("Unable to save hours. Please try again.");
    },
  });

  const handleChangeDay = (
    dayKey: DayKey,
    updates: Partial<Pick<DayHours, "open" | "close" | "closed">>
  ) => {
    setHours((current) =>
      current.map((d) =>
        d.day === dayKey
          ? {
              ...d,
              ...updates,
              // If marking closed, wipe times
              ...(updates.closed
                ? { open: null, close: null }
                : {}),
            }
          : d
      )
    );
  };

  const copyWeekdayToAll = () => {
    const monday = hours.find((d) => d.day === "monday");
    if (!monday) return;

    setHours((current) =>
      current.map((d) =>
        d.day === "saturday" || d.day === "sunday"
          ? d
          : {
              ...d,
              open: monday.open,
              close: monday.close,
              closed: monday.closed,
            }
      )
    );
    toast.success("Copied Monday hours to weekdays.");
  };

  const setEveryday11to10 = () => {
    setHours((current) =>
      current.map((d) => ({
        ...d,
        closed: false,
        open: "11:00",
        close: "22:00",
      }))
    );
    toast.success("Applied 11:00–22:00 to every day.");
  };

  const goToStaff = () => {
    router.push(`/dashboard/restaurants/${id}/staff`);
  };

  if (isLoading || !restaurant) {
    return (
      <div className="p-6 text-slate-500">
        Loading restaurant hours...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Business Hours — {restaurant.name}
          </h1>
          <p className="text-sm text-slate-500">
            Set opening and closing times for each day. Guests will only see available slots inside these hours.
          </p>
        </div>
      </div>

      {/* Quick presets */}
      <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-4 flex flex-wrap gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-300 mr-2">
          Quick presets:
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={copyWeekdayToAll}
        >
          Copy Monday → Weekdays
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={setEveryday11to10}
        >
          Everyday 11:00 – 22:00
        </Button>
      </div>

      {/* Hours grid */}
      <section className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-4">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200">
            <tr className="text-left">
              <th className="py-2 pr-4">Day</th>
              <th className="py-2 pr-4">Open</th>
              <th className="py-2 pr-4">Close</th>
              <th className="py-2">Closed</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((day) => (
              <tr
                key={day.day}
                className="border-b border-slate-100 last:border-none"
              >
                <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-100">
                  {day.label}
                </td>

                {/* Open time */}
                <td className="py-3 pr-4">
                  <Select
                    value={day.closed ? "" : day.open ?? ""}
                    disabled={day.closed}
                    onValueChange={(value) =>
                      handleChangeDay(day.day, { open: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {/* Close time */}
                <td className="py-3 pr-4">
                  <Select
                    value={day.closed ? "" : day.close ?? ""}
                    disabled={day.closed}
                    onValueChange={(value) =>
                      handleChangeDay(day.day, { close: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {/* Closed toggle */}
                <td className="py-3">
                  <label className="inline-flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                      checked={day.closed}
                      onChange={(e) =>
                        handleChangeDay(day.day, { closed: e.target.checked })
                      }
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      Closed
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Holidays / Blocked Dates */}
      <section className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-4">
        <HolidaysManager
          restaurantId={id as string}
          initialHolidays={restaurant.holidaysJson || []}
        />
      </section>

      {/* Footer actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => saveMutation.mutate({ finish: false })}
          disabled={saveMutation.isPending}
        >
          Save Hours
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={goToStaff}
          >
            Next: Staff & Roles →
          </Button>
          <Button
            className="bg-slate-900 text-white hover:bg-slate-800"
            onClick={() => saveMutation.mutate({ finish: true })}
            disabled={saveMutation.isPending}
          >
            Save & Publish Restaurant
          </Button>
        </div>
      </div>
    </div>
  );
}

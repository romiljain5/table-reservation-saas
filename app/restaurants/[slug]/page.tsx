"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { isDateBlocked } from "@/lib/holidaysHelper";
import { fetchImageForRestaurant } from "@/lib/unsplash";

export default function PublicRestaurantPage() {
  const { slug } = useParams();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant-public", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/restaurants/public?slug=${slug}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!slug,
  });

  // photo state: prefer `restaurant.logoUrl`, else fetch from Unsplash (or fallback to source)
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurant) return;

    let aborted = false;

    (async () => {
      try {
        const url = await fetchImageForRestaurant(restaurant);
        if (!aborted) setPhoto(url || null);
      } catch (e) {
        // ignore; leave photo as null
      }
    })();

    return () => {
      aborted = true;
    };
  }, [restaurant]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!restaurant) return <div className="p-6">Restaurant not found</div>;

  const today = new Date();
  const next7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const dayKeyFromDate = (d: Date) => {
    const map = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return map[d.getDay()];
  };

  const getHoursForDay = (key: string) => {
    try {
      const hours = restaurant.hoursJson;
      if (!hours || !Array.isArray(hours)) return null;
      return hours.find((h: any) => h.day === key) ?? null;
    } catch {
      return null;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="rounded-xl overflow-hidden">
        <div className="h-64 bg-gradient-to-r from-slate-100 to-white dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
          {(photo || restaurant.logoUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo || restaurant.logoUrl} alt={restaurant.name} className="h-full w-full object-cover" />
          ) : (
            <div className="text-4xl font-bold">{restaurant.name?.[0]?.toUpperCase()}</div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{restaurant.city}{restaurant.state ? `, ${restaurant.state}` : ''}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {Array.isArray(restaurant.cuisines) && restaurant.cuisines.map((c: string, i: number) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800">{c}</span>
              ))}
            </div>

            <div className="mt-4 text-sm text-slate-600">
              {restaurant.phone && <div>Phone: <a href={`tel:${restaurant.phone}`} className="text-indigo-600 hover:underline">{restaurant.phone}</a></div>}
              {restaurant.websiteUrl && <div>Website: <a href={restaurant.websiteUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Visit</a></div>}
            </div>
          </div>

          <div className="w-full lg:w-56 flex flex-col gap-3">
            <Link href={`/r/${restaurant.slug}`} className="text-center px-4 py-2 bg-emerald-600 text-white rounded-md">Reserve</Link>
            <Link href="/restaurants" className="text-center px-4 py-2 border rounded-md">Back to listings</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-6">
          <h3 className="font-semibold mb-3">Availability (Next 7 days)</h3>
          <div className="space-y-2">
            {next7.map((d) => {
              const key = dayKeyFromDate(d);
              const hours = getHoursForDay(key);
              const iso = d.toISOString().split('T')[0];
              const blocked = isDateBlocked(iso, restaurant.holidaysJson);
              const label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
              const open = hours && !hours.closed && hours.open && hours.close && !blocked;

              return (
                <div key={iso} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-slate-500">{blocked ? 'Closed (Holiday)' : hours ? (hours.closed ? 'Closed' : `${hours.open} — ${hours.close}`) : 'No hours set'}</div>
                  </div>
                  <div>
                    {open ? <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Open</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Closed</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-6">
          <h3 className="font-semibold mb-3">Blocked Dates</h3>
          {restaurant.holidaysJson && restaurant.holidaysJson.length > 0 ? (
            <div className="space-y-2">
              {restaurant.holidaysJson.map((ho: any, idx: number) => (
                <div key={idx} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{new Date(ho.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div className="text-xs text-slate-500">{ho.reason}</div>
                  </div>
                  <div className="text-xs text-red-600">Blocked</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No blocked dates.</p>
          )}
        </div>
      </div>
    </div>
  );
}

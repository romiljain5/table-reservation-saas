"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RestaurantPublicPage() {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [times, setTimes] = useState([]);
  const router = useRouter();
  // Fetch restaurant info
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/restaurants/public?slug=${slug}`);
      const data = await res.json();
      setRestaurant(data);
    };
    fetchData();
  }, [slug]);

  // Fetch availability
  const checkAvailability = async () => {
    if (!date) return toast.error("Select a date");

    const res = await fetch(
      `/api/availability?slug=${slug}&date=${date}&guests=${guests}`
    );
    const data = await res.json();
    setTimes(data);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 p-6">
      {restaurant && (
        <>
          {/* Hero */}
          <div className="rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white mb-8">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-sm opacity-80 mt-1">
              {restaurant.addressLine1}, {restaurant.city}
            </p>
          </div>

          {/* Booking Box */}
          <div className="max-w-lg mx-auto p-6 rounded-xl border bg-white dark:bg-neutral-800 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Reserve a Table</h2>

            <div>
              <label className="text-sm font-medium">Guests</label>
              <Input
                type="number"
                className="mt-1"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                className="mt-1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <Button
              onClick={checkAvailability}
              className="w-full bg-slate-900 text-white"
            >
              Find Table
            </Button>

            {/* Available Times */}
            {times.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-4">
                {times.map((t) => (
                  <button
                    key={t}
                    className="px-3 py-2 text-sm rounded-md border hover:bg-slate-100 dark:hover:bg-neutral-700"
                    onClick={() =>
                      router.push(
                        `/r/${slug}/book?date=${date}&time=${t}&guests=${guests}`
                      )
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {times.length === 0 && date && (
              <p className="text-sm text-slate-500 pt-2">
                No slots available — choose another date.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

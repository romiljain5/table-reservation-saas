"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const guests = searchParams.get("guests");

  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const submitBooking = async () => {
    if (!guestName || !phone)
      return toast.error("Please enter name and phone");

    try {
      const res = await fetch("/api/public/reservations", {
        method: "POST",
        body: JSON.stringify({
          slug,
          date,
          time,
          partySize: Number(guests),
          guestName,
          phone,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Booking failed");
        return;
      }

      toast.success("🎉 Reservation Confirmed!");

      router.push(
        `/r/${slug}/success?resId=${data.id}&code=${data.checkInCode}`
      );
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center dark:bg-neutral-900">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Confirm Reservation
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          {date} at {time} — Party of {guests}
        </p>

        <div>
          <label className="text-sm font-medium">Your Name</label>
          <Input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input
            type="tel"
            placeholder="+1 555..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Special Requests</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-700"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button
          onClick={submitBooking}
          className="w-full bg-slate-900 text-white"
        >
          Confirm Booking →
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/r/${slug}`)}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SuccessPage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const { slug } = useParams();

  const reservationId = searchParams.get("resId");
  const checkInCode = searchParams.get("code");

  const { data, isLoading } = useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: async () => {
      const res = await fetch(`/api/reservations/${reservationId}`);
      return res.json();
    },
    enabled: !!reservationId,
  });

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  if (isLoading)
    return (
      <p className="text-slate-700 dark:text-slate-300">
        Loading confirmation…
      </p>
    );
  if (!data)
    return (
      <p className="text-slate-700 dark:text-slate-300">
        Reservation not found.
      </p>
    );

  const checkInUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkin/${checkInCode}`;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div
        className="relative min-h-screen 
        bg-gradient-to-br from-indigo-50 via-white to-slate-100 
        dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 
        flex flex-col items-center justify-center py-12 px-6 text-slate-900 dark:text-slate-100"
      >
        {/* Confetti */}
        <Confetti width={windowSize.width} height={windowSize.height} />

        {/* Restaurant badge */}
        <div className="flex flex-col items-center">
          <img
            src="/logo-placeholder.svg"
            alt="Restaurant Logo"
            className="w-20 h-20 rounded-full shadow-md border border-slate-200 dark:border-neutral-700 object-cover"
          />

          <h1 className="text-4xl font-semibold mt-4 text-slate-900 dark:text-slate-100">
            Reservation Confirmed 🎉
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm text-center">
            We can’t wait to welcome you to
            <strong> {data.restaurant?.name}</strong>.
          </p>
        </div>

        {/* QR CODE CARD */}
        <div
          className="mt-10 bg-white dark:bg-neutral-900 shadow-2xl rounded-2xl p-6 
          border border-slate-100 dark:border-neutral-700 
          backdrop-blur-lg transform hover:scale-[1.02] transition"
        >
          <div
            className="justify-center items-center flex p-4 
            bg-white dark:bg-neutral-800 rounded-xl 
            border border-indigo-200 dark:border-neutral-700 shadow-lg"
          >
            <QRCodeSVG
              value={checkInUrl}
              size={160}
              fgColor={theme === "dark" ? "#fff" : "#111"}
              bgColor={theme === "dark" ? "#111" : "#fff"} // <-- ADD THIS
            />
          </div>
          <a
            href={checkInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 mx-auto block text-xs px-3 py-1.5 rounded-md 
  bg-slate-100 text-slate-700 
  dark:bg-neutral-800 dark:text-slate-300 
  border border-slate-200 dark:border-neutral-700 
  hover:bg-slate-200 dark:hover:bg-neutral-700 
  transition text-center"
          >
            Open Check-In Link ↗
          </a>
        </div>

        {/* DETAILS CARD */}
        <div
          className="mt-10 bg-white/70 dark:bg-neutral-800/60 shadow-md 
          border border-slate-200 dark:border-neutral-700 
          rounded-xl px-8 py-5 text-slate-700 dark:text-slate-200 
          w-full max-w-lg"
        >
          <h2 className="font-medium text-sm text-indigo-600 dark:text-indigo-400 mb-4 uppercase tracking-wide">
            Your Experience Awaits
          </h2>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="font-medium">Name:</span>
            <span>{data.guestName}</span>

            <span className="font-medium">Date & Time:</span>
            <span>
              {new Date(data.date).toLocaleDateString()} @ {data.time}
            </span>

            <span className="font-medium">Guests:</span>
            <span>{data.partySize}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
          <button
            className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 
            text-white text-sm font-medium shadow-md transition"
            onClick={() => window.print()}
          >
            Save / Screenshot 📸
          </button>

          <button
            className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-900 
            border border-slate-300 dark:border-neutral-700 
            text-slate-800 dark:text-slate-200 text-sm hover:bg-slate-100 
            dark:hover:bg-neutral-800 transition"
            onClick={() => alert("Add to Apple/Google Wallet soon!")}
          >
            Add to Wallet / Calendar 📅
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              data.restaurant?.name ?? ""
            )}`}
            target="_blank"
            className="px-4 py-3 rounded-xl border border-transparent 
            text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 
            dark:hover:bg-neutral-800 text-sm font-medium flex items-center justify-center gap-2 transition"
          >
            <MapPin className="w-4 h-4" /> Get Directions
          </a>
        </div>

        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          Confirmation ID: {reservationId}
        </p>
      </div>
    </div>
  );
}

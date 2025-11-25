"use client";

import { useEffect, useState } from "react";

export default function SeatTimer({ seatedAt }: { seatedAt: string }) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!seatedAt) return;

    const start = new Date(seatedAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - start;

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setElapsed(`${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [seatedAt]);

  if (!seatedAt) return null;

  return (
    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
      Seated for {elapsed}
    </span>
  );
}

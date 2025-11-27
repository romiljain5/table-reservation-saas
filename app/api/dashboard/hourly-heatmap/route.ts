import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 6);

  const reservations = await prisma.reservation.findMany({
    where: {
      date: { gte: weekAgo },
    },
    select: { time: true },
  });

  // Convert reservation times to hour buckets
  const hourCounts: Record<string, number> = {};

  for (let i = 16; i <= 22; i++) {
    hourCounts[i.toString()] = 0; // typical dinner service timeframe 4pm–10pm
  }

  reservations.forEach((r) => {
    const hr = r.time?.split(":")[0];
    if (hr && hourCounts.hasOwnProperty(hr)) {
      hourCounts[hr]++;
    }
  });

  const result = Object.keys(hourCounts).map((hour) => ({
    hour: `${hour}:00`,
    count: hourCounts[hour],
  }));

  return NextResponse.json(result);
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [reservationsToday, seatedGuests, avgToday] = await Promise.all([
    prisma.reservation.count({
      where: { date: { gte: today } },
    }),

    prisma.reservation.aggregate({
      _sum: {
        partySize: true,
      },
      where: { status: "SEATED", date: { gte: today } },
    }),

    prisma.reservation.aggregate({
      _avg: {
        partySize: true,
      },
      where: { date: { gte: today } },
    }),
  ]);

  // No-show rate: last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [totalLast7, noShowsLast7] = await Promise.all([
    prisma.reservation.count({
      where: { date: { gte: sevenDaysAgo } },
    }),
    prisma.reservation.count({
      where: { status: "NO_SHOW", date: { gte: sevenDaysAgo } },
    }),
  ]);

  const noShowRate =
    totalLast7 > 0 ? ((noShowsLast7 / totalLast7) * 100).toFixed(1) : "0";

  return NextResponse.json({
    reservationsToday,
    seatedGuests: seatedGuests._sum.partySize ?? 0,
    avgPartySize: avgToday._avg.partySize?.toFixed(1) ?? "-",
    noShowRate,
    resChangeToday: "+8 vs yesterday", // later dynamic
  });
}

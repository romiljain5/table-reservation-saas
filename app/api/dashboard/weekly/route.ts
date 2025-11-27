import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6); // last 7 days

  const dailyCounts = await prisma.reservation.groupBy({
    by: ["date"],
    _count: { id: true },
    where: { date: { gte: weekAgo } },
    orderBy: { date: "asc" },
  });

  const formatted = dailyCounts.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    reservations: d._count.id,
  }));

  return NextResponse.json(formatted);
}

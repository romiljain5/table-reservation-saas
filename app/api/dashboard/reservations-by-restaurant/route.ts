import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);

  const results = await prisma.reservation.groupBy({
    by: ["restaurantId"],
    _count: { id: true },
    where: {
      date: { gte: weekAgo },
    },
  });

  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, name: true },
  });

  const mapped = results.map((item) => {
    const rest = restaurants.find((r) => r.id === item.restaurantId);
    return {
      name: rest?.name || "Unknown",
      count: item._count.id,
    };
  });

  return NextResponse.json(mapped);
}

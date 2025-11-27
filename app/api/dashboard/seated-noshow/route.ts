import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);

  const results = await prisma.reservation.groupBy({
    by: ["date", "status"],
    _count: { id: true },
    where: {
      date: { gte: weekAgo },
      status: { in: ["SEATED", "NO_SHOW"] },
    },
    orderBy: [{ date: "asc" }],
  });

  const mapped: Record<string, any> = {};

  results.forEach((res) => {
    const day = new Date(res.date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    if (!mapped[day]) mapped[day] = { date: day, seated: 0, noShow: 0 };

    if (res.status === "SEATED") mapped[day].seated = res._count.id;
    if (res.status === "NO_SHOW") mapped[day].noShow = res._count.id;
  });

  return NextResponse.json(Object.values(mapped));
}

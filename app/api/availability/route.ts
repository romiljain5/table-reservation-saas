// /app/api/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const RES_DURATION_MIN = 90;
const BUFFER_MIN = 15;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const dateParam = searchParams.get("date");
    const guests = Number(searchParams.get("guests"));

    if (!slug || !dateParam || !guests) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: { tables: true },
    });

    if (!restaurant || restaurant.tables.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const selectedDate = new Date(dateParam);
    const openingTime = 16; // 4 PM default (later: restaurant.hours)
    const closingTime = 22; // 10 PM default

    // All possible timeslots
    const slots: string[] = [];
    for (let hour = openingTime; hour < closingTime; hour++) {
      slots.push(`${hour}:00`, `${hour}:30`);
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        date: {
          gte: selectedDate,
          lt: new Date(
            selectedDate.getTime() + 24 * 60 * 60 * 1000
          ),
        },
      },
    });

    const isSlotAvailable = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      const reqStart = new Date(selectedDate);
      reqStart.setHours(h, m, 0, 0);
      const reqEnd = new Date(reqStart);
      reqEnd.setMinutes(reqEnd.getMinutes() + RES_DURATION_MIN + BUFFER_MIN);

      const availableTable = restaurant.tables.some((table) => {
        if (table.seats < guests) return false;

        const tableRes = reservations.filter((r) => r.tableId === table.id);

        return tableRes.every((res) => {
          const resStart = new Date(res.date);
          const [rh, rm] = res.time.split(":").map(Number);
          resStart.setHours(rh, rm);
          const resEnd = new Date(resStart);
          resEnd.setMinutes(resEnd.getMinutes() + RES_DURATION_MIN);

          return reqEnd <= resStart || resEnd <= reqStart;
        });
      });

      return availableTable;
    };

    const availableSlots = slots.filter(isSlotAvailable);

    return NextResponse.json(availableSlots, { status: 200 });
  } catch (err) {
    console.error("Availability error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

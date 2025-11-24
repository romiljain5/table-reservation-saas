import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const reservation = await prisma.reservation.create({
      data: {
        guestName: body.guestName,
        phone: body.phone,
        partySize: body.partySize,
        date: new Date(body.date),
        time: body.time,
        restaurantId: body.restaurantId,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating reservation" },
      { status: 500 }
    );
  }
}

// GET reservations (READ)
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { date: "desc" },
      include: {
        restaurant: true,
        user: true,
        table: true,
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Reservation GET error:", error);
    return NextResponse.json(
      { error: "Error fetching reservations" },
      { status: 500 }
    );
  }
}
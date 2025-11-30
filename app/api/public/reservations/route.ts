import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, guestName, phone, email, partySize, date, time, notes } = body;

    if (!slug || !guestName || !phone || !partySize || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Upsert customer
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: {
        name: guestName,
        email: email ?? undefined,
        lastVisit: parsedDate,
        visits: { increment: 1 },
      },
      create: {
        name: guestName,
        phone,
        email: email ?? undefined,
        lastVisit: parsedDate,
        visits: 1,
      },
    });

    // Generate short check-in code (e.g., 6 chars)
    const checkInCode = randomBytes(3).toString("hex").toUpperCase();

    const reservation = await prisma.reservation.create({
      data: {
        guestName,
        phone,
        email,
        partySize,
        date: parsedDate,
        time,
        notes,
        status: "PENDING",
        source: "ONLINE",
        restaurantId: restaurant.id,
        customerId: customer.id,
        // store code in notes or add field `checkInCode` if you add it to schema
      },
    });

    return NextResponse.json({
      id: reservation.id,
      checkInCode,
    });
  } catch (err: any) {
    console.error("Public reservation error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

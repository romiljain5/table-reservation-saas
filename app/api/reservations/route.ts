import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔥 Convert date string into proper ISO DateTime
    const parsedDate = new Date(body.date);

    if (isNaN(parsedDate.getTime())) {
      return Response.json(
        { error: "Invalid date format. Expected ISO-8601." },
        { status: 400 }
      );
    }

    // 🔥 Ensure full ISO string
    const isoDate = parsedDate.toISOString();

    const customer = await prisma.customer.upsert({
      where: { phone: body.phone },
      update: {
        name: body.guestName,
        lastVisit: isoDate,
        visits: { increment: 1 },
      },
      create: {
        name: body.guestName,
        phone: body.phone,
        email: body.email ?? null,
        lastVisit: isoDate,
        visits: 1,
      },
    });

    const reservation = await prisma.reservation.create({
      data: {
        guestName: body.guestName,
        phone: body.phone,
        partySize: body.partySize,
        date: isoDate,
        time: body.time,
        status: body.status ?? "PENDING",
        restaurantId: body.restaurantId,
        customerId: customer.id,
      },
    });

    return Response.json(reservation);

  } catch (err: any) {
    console.error("Reservation error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}


// GET reservations (READ)
// export async function GET() {
//   try {
//     const reservations = await prisma.reservation.findMany({
//       orderBy: { date: "desc" },
//       include: {
//         restaurant: true,
//         user: true,
//         table: true,
//       },
//     });

//     return NextResponse.json(reservations);
//   } catch (error) {
//     console.error("Reservation GET error:", error);
//     return NextResponse.json(
//       { error: "Error fetching reservations" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    const reservations = await prisma.reservation.findMany({
      where: restaurantId ? { restaurantId } : {},
      orderBy: {
        date: "asc",
      },
      include: {
        restaurant: true,
        user: true,
        table: true,
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching reservations" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { slug, guestName, phone, partySize, date, time, notes, email } =
      await req.json();

    if (!slug || !guestName || !phone || !date || !time || !partySize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Expected ISO date" },
        { status: 400 }
      );
    }

    // 🔹 Find restaurant from slug
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // 🔹 Upsert customer for CRM
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: {
        name: guestName,
        lastVisit: parsedDate,
        visits: { increment: 1 },
      },
      create: {
        name: guestName,
        phone,
        email: email ?? null,
        lastVisit: parsedDate,
        visits: 1,
      },
    });

    // 🔹 Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        guestName,
        phone,
        partySize,
        date: parsedDate,
        time,
        status: "PENDING",
        notes,
        restaurantId: restaurant.id,
        customerId: customer.id,
      },
      include: {
        restaurant: true,
      },
    });

    return NextResponse.json(reservation);
  } catch (err: any) {
    console.error("Reservation error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
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

export async function GET(
  req: NextRequest,
  { params }: { params?: { id?: string } }
) {
  try {
    const id = params?.id;
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const search = searchParams.get("search")?.trim() || "";

    // Case 1 ➜ Fetch ONE by ID (UNCHANGED)
    if (id && id !== "[id]") {
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: { restaurant: true, user: true, table: true },
      });

      if (!reservation) {
        return NextResponse.json(
          { error: "Reservation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(reservation);
    }

    // Case 2 ➜ Fetch MANY by restaurantId (map behavior depending on search input)
    if (restaurantId) {
      const where: any = { restaurantId };

      // Apply search filter ONLY if search value exists
      if (search.length > 0) {
        where.OR = [
          { guestName: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      const reservations = await prisma.reservation.findMany({
        where,
        include: { restaurant: true, user: true, table: true },
        orderBy: [{ date: "asc" }, { time: "asc" }],
      });

      return NextResponse.json(reservations);
    }

    // Case 3 ➜ Fetch ALL (UNCHANGED)
    const allReservations = await prisma.reservation.findMany({
      include: { restaurant: true, user: true, table: true },
    });

    return NextResponse.json(allReservations);
  } catch (error) {
    console.error("GET /reservations universal handler error:", error);
    return NextResponse.json(
      { error: "Server error fetching reservations" },
      { status: 500 }
    );
  }
}

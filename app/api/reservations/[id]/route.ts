import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = await req.json();

  const updated = await prisma.reservation.update({
    where: { id },
    data: {
      guestName: body.guestName,
      phone: body.phone,
      partySize: body.partySize,
      date: new Date(body.date),
      time: body.time,
      status: body.status,
      restaurantId: body.restaurantId,
    },
  });

  return NextResponse.json(updated);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        restaurant: true,
        customer: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (err: any) {
    console.error("Error fetching reservation:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load reservation" },
      { status: 500 }
    );
  }
}
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

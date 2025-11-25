import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { tableId } = await req.json();

  const updated = await prisma.reservation.update({
    where: { id },
    data: {
      status: "SEATED",
      tableId: tableId,
      seatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}

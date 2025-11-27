import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; staffId: string } }
) {
  const { id, staffId } = params;

  await prisma.restaurant.update({
    where: { id },
    data: {
      admins: {
        disconnect: { id: staffId },
      },
    },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; staffId: string } }
) {
  const { id, staffId } = params;
  const { role } = await req.json();

  const updated = await prisma.user.update({
    where: { id: staffId },
    data: { role },
  });

  return NextResponse.json(updated);
}

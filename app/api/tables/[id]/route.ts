import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const updatedTable = await prisma.table.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedTable);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update table" },
      { status: 500 }
    );
  }
}

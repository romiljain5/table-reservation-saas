import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    const tables = await prisma.table.findMany({
      where: restaurantId ? { restaurantId } : {},
      orderBy: { name: "asc" },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const table = await prisma.table.create({
      data: {
        name: body.name,
        seats: body.seats,
        restaurantId: body.restaurantId,
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to create table" }, { status: 500 });
  }
}

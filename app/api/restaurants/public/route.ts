import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
  });

  if (!restaurant) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(restaurant, { status: 200 });
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const restaurant = await prisma.restaurant.create({
    data: {
      name: body.name,
      phone: body.phone,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      addressLine1: body.addressLine1,
      setupStep: 2, // after info, go to layout
    },
  });

  return NextResponse.json(restaurant);
}

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error loading restaurants", error);
    return NextResponse.json(
      { error: "Failed to load restaurants" },
      { status: 500 }
    );
  }
}

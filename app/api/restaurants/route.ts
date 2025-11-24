import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
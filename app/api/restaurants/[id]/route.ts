import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  return NextResponse.json(restaurant);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return Response.json(
        { error: "Restaurant ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updated = await prisma.restaurant.update({
      where: { id },
      data: {
        setupStep: body.setupStep ?? undefined,
        isPublished: body.isPublished ?? undefined,
        status: body.status ?? undefined,
        name: body.name ?? undefined,
        slug: body.slug ?? undefined,
        phone: body.phone ?? undefined,
        addressLine1: body.addressLine1 ?? undefined,
        addressLine2: body.addressLine2 ?? undefined,
        city: body.city ?? undefined,
        state: body.state ?? undefined,
        zipCode: body.zipCode ?? undefined,
        country: body.country ?? undefined,
        logoUrl: body.logoUrl ?? undefined,
        websiteUrl: body.websiteUrl ?? undefined,
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH ERROR →", error);
    return Response.json(
      { error: "Unable to update restaurant" },
      { status: 500 }
    );
  }
}



export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

  await prisma.restaurant.update({
    where: { id },
    data: { status: "ARCHIVED", isPublished: false },
  });

  return NextResponse.json({ message: "Restaurant archived" });
}

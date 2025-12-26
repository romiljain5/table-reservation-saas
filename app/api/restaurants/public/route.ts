import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchSlug = url.searchParams.get("slug");

  // support either ?slug=... or /api/restaurants/public/<slug>
  let slug = searchSlug ?? undefined;
  if (!slug) {
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "public");
    if (idx !== -1 && parts.length > idx + 1) {
      slug = parts[idx + 1];
    }
  }

  // If no slug provided, return public listing (support search + pagination)
  if (!slug) {
    const search = url.searchParams.get("search") ?? "";
    const pageParam = Number(url.searchParams.get("page") ?? "1");
    const limitParam = Number(url.searchParams.get("limit") ?? "9");
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const limit = Math.max(1, isNaN(limitParam) ? 9 : limitParam);
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };

    if (search.trim()) {
      const s = search.trim();
      where.OR = [
        { name: { contains: s, mode: "insensitive" } },
        { city: { contains: s, mode: "insensitive" } },
        { addressLine1: { contains: s, mode: "insensitive" } },
      ];

      // If user types a token matching a cuisine exactly, match via has
      // split words and include cuisines hasSome for exact tokens
      const tokens = s.split(/\s*,\s*|\s+/).filter(Boolean);
      if (tokens.length > 0) {
        where.OR.push({ cuisines: { hasSome: tokens } });
      }
    }

    const [total, items] = await Promise.all([
      prisma.restaurant.count({ where }),
      prisma.restaurant.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true,
          addressLine1: true,
          phone: true,
          cuisines: true,
          logoUrl: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      { data: items, meta: { total, page, totalPages, perPage: limit } },
      { status: 200 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });

  if (!restaurant) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(restaurant, { status: 200 });
}

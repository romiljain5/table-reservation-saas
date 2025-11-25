import { prisma } from "@/lib/prisma";

export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { lastVisit: "desc" },
  });

  return Response.json(customers);
}

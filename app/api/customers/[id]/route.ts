import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      reservations: {
        orderBy: { date: "desc" },
      },
    },
  });

  return Response.json(customer);
}

import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { newTableId } = await req.json();

  if (!newTableId) {
    return Response.json({ error: "Missing newTableId" }, { status: 400 });
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: {
      table: {
        connect: { id: newTableId },
      },
    },
  });

  return Response.json(updated);
}

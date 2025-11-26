import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { hours } = await req.json();

  await prisma.restaurant.update({
    where: { id },
    data: {
      hoursJson: hours, // stored as JSON
      setupStep: 4, // mark step completed if needed
    },
  });

  return Response.json({ success: true });
}

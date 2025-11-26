import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const staff = await prisma.user.findMany({
    where: {
      Restaurant: {
        some: { id },
      },
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return Response.json(staff);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { email } = await req.json();
  const { id } = await params;

  if (!email)
    return Response.json({ error: "Email is required" }, { status: 400 });

  // Ensure user exists or create placeholder
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, role: "STAFF", name: "" }, // placeholder
  });

  await prisma.restaurant.update({
    where: { id },
    data: {
      admins: {
        connect: { id: user.id },
      },
    },
  });

  return Response.json({ success: true });
}

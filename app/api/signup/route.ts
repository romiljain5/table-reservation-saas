import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, restaurantName } = body;

  if (!email || !password || !restaurantName) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "MANAGER", // new accounts become managers by default

      Restaurant: {
        create: {
          name: restaurantName,
          slug: restaurantName.toLowerCase().replace(/\s+/g, "-"),
        },
      },
    },
    include: { Restaurant: true },
  });

  return Response.json({ success: true, user });
}

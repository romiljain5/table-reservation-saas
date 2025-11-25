const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // -----------------------------
  // 1️⃣ Restaurants
  // -----------------------------
  const restaurants = await prisma.restaurant.createMany({
    data: [
      { name: "Clayton Downtown", slug: "clayton-downtown" },
      { name: "Riverfront", slug: "riverfront" },
      { name: "Airport", slug: "airport" },
    ],
    skipDuplicates: true,
  });

  // Fetch restaurant IDs
  const clayton = await prisma.restaurant.findUnique({
    where: { slug: "clayton-downtown" },
  });

  const riverfront = await prisma.restaurant.findUnique({
    where: { slug: "riverfront" },
  });

  const airport = await prisma.restaurant.findUnique({
    where: { slug: "airport" },
  });

  // -----------------------------
  // 2️⃣ Tables
  // -----------------------------
  await prisma.table.createMany({
    data: [
      // Clayton Downtown
      { number: 1, name: "Window Table", seats: 2, restaurantId: clayton.id },
      { number: 2, name: "Booth A", seats: 4, restaurantId: clayton.id },
      { number: 3, name: "Center Table", seats: 4, restaurantId: clayton.id },
      { number: 4, name: "Corner Table", seats: 6, restaurantId: clayton.id },

      // Riverfront
      { number: 1, name: "Patio 1", seats: 2, restaurantId: riverfront.id },
      { number: 2, name: "Patio 2", seats: 4, restaurantId: riverfront.id },
      { number: 3, name: "Indoor 1", seats: 4, restaurantId: riverfront.id },

      // Airport
      { number: 1, name: "Lounge A", seats: 2, restaurantId: airport.id },
      { number: 2, name: "Lounge B", seats: 6, restaurantId: airport.id },
    ],
    skipDuplicates: true,
  });

  // Fetch tables for reservations
  const claytonTables = await prisma.table.findMany({
    where: { restaurantId: clayton.id },
  });

  // -----------------------------
  // 3️⃣ Reservations
  // -----------------------------
  await prisma.reservation.createMany({
    data: [
      {
        guestName: "John Doe",
        phone: "+1 555-123-4567",
        partySize: 2,
        date: new Date("2025-11-26"),
        time: "18:30",
        status: "CONFIRMED",
        restaurantId: clayton.id,
        tableId: claytonTables[0]?.id,
      },
      {
        guestName: "Emily Smith",
        phone: "+1 555-987-6543",
        partySize: 4,
        date: new Date("2025-11-26"),
        time: "19:00",
        status: "PENDING",
        restaurantId: clayton.id,
        tableId: claytonTables[1]?.id,
      },
      {
        guestName: "Mark Johnson",
        phone: "+1 555-222-3333",
        partySize: 6,
        date: new Date("2025-11-27"),
        time: "20:00",
        status: "SEATED",
        seatedAt: new Date(Date.now() - 35 * 60 * 1000), // 35 min ago
        restaurantId: clayton.id,
        tableId: claytonTables[3]?.id,
      },
    ],
  });

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

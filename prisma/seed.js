const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Utility function
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // -----------------------------
  // 1️⃣ Restaurants (5)
  // -----------------------------
  const restaurantsData = [
    {
      name: "Clayton Downtown",
      slug: "clayton-downtown",
      phone: "+1 555-000-1111",
      status: "ACTIVE",
      setupStep: 4,
      isPublished: true,
      addressLine1: "123 Clayton Ave",
      city: "St. Louis",
      state: "MO",
      zipCode: "63105",
    },
    {
      name: "Riverfront Bistro",
      slug: "riverfront-bistro",
      phone: "+1 555-222-3333",
      status: "ACTIVE",
      setupStep: 4,
      isPublished: true,
      addressLine1: "200 Riverfront Way",
      city: "St. Louis",
      state: "MO",
      zipCode: "63102",
    },
    {
      name: "Airport Lounge",
      slug: "airport-lounge",
      phone: "+1 555-444-5555",
      status: "ACTIVE",
      setupStep: 3,
      isPublished: true,
      addressLine1: "Terminal 2",
      city: "St. Louis",
      state: "MO",
      zipCode: "63145",
    },
    {
      name: "Midtown Grill",
      slug: "midtown-grill",
      phone: "+1 555-666-7777",
      status: "ACTIVE",
      setupStep: 4,
      isPublished: true,
      addressLine1: "500 Market St",
      city: "St. Louis",
      state: "MO",
      zipCode: "63103",
    },
    {
      name: "Suburban Eatery",
      slug: "suburban-eatery",
      phone: "+1 555-888-9999",
      status: "DRAFT",
      setupStep: 2,
      isPublished: false,
      addressLine1: "780 Valley Rd",
      city: "Town & Country",
      state: "MO",
      zipCode: "63017",
    },
  ];

  await prisma.restaurant.createMany({
    data: restaurantsData,
    skipDuplicates: true,
  });

  const restaurants = await prisma.restaurant.findMany();

  // -----------------------------
  // 2️⃣ Tables (8 per restaurant)
  // -----------------------------
  let tablesAll = [];

  for (const r of restaurants) {
    const tables = Array.from({ length: 8 }).map((_, i) => ({
      number: i + 1,
      name: `Table #${i + 1}`,
      seats: rand([2, 4, 6]),
      x: rand([50, 120, 200, 280]),
      y: rand([50, 140, 230, 310]),
      restaurantId: r.id,
    }));

    await prisma.table.createMany({ data: tables });
    tablesAll.push(...await prisma.table.findMany({ where: { restaurantId: r.id } }));
  }

  // -----------------------------
  // 3️⃣ Customers (Unique)
  // -----------------------------
  const customersData = [
    { name: "John Doe", phone: "+1 555-123-4567", tags: ["VIP"], visits: 5 },
    { name: "Emily Smith", phone: "+1 555-987-6543", tags: ["Allergy: Nuts"], visits: 3 },
    { name: "Mark Johnson", phone: "+1 555-222-3333", tags: [], visits: 2 },
    { name: "Sarah Lee", phone: "+1 555-777-8888", tags: ["Regular"], visits: 8 },
    { name: "David Kim", phone: "+1 555-444-7777", tags: ["Family"], visits: 4 },
  ];

  await prisma.customer.createMany({ data: customersData, skipDuplicates: true });
  const customers = await prisma.customer.findMany();

  // -----------------------------
  // 4️⃣ Reservations (10 per restaurant)
  // -----------------------------
  const statuses = ["PENDING", "CONFIRMED", "SEATED", "COMPLETED"];
  const times = ["18:00", "18:30", "19:00", "20:00", "21:00"];

  for (const r of restaurants) {
    const tables = tablesAll.filter((t) => t.restaurantId === r.id);

    const reservations = Array.from({ length: 10 }).map(() => {
      const cust = rand(customers);
      return {
        guestName: cust.name,
        phone: cust.phone,
        partySize: rand([2, 3, 4, 5, 6]),
        date: new Date("2025-11-26T00:00:00Z"),
        time: rand(times),
        status: rand(statuses),
        restaurantId: r.id,
        tableId: rand(tables)?.id,
      };
    });

    await prisma.reservation.createMany({ data: reservations });
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());

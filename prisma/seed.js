const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Restaurants if not already present
  await prisma.restaurant.createMany({
    data: [
      {
        name: "Clayton Downtown",
        slug: "clayton-downtown",
      },
      {
        name: "Riverfront",
        slug: "riverfront",
      },
      {
        name: "Airport",
        slug: "airport",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed 🎉");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

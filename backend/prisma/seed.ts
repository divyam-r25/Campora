import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const college = await prisma.college.upsert({
    where: { domain: "sst.scaler.com" },
    update: {},
    create: {
      name: "Scaler School of Technology",
      domain: "sst.scaler.com",
    },
  });
  console.log("Seeded college:", college);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.missMessage.count();
  if (count > 0) return;

  await prisma.missMessage.createMany({
    data: [
      { text: "Soumya — you’re my favorite kind of magic. — Arjun", author: "Arjun" },
      { text: "Arjun — thanks for being my soft place to land. — Soumya", author: "Soumya" },
      { text: "Every day with you is a tiny festival in my heart.", author: "Arjun" },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

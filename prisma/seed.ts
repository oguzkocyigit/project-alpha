import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.client.findFirst();
  if (existing) {
    console.log(`Client already exists. Public link: /p/${existing.slug}`);
    return;
  }

  const slug = randomBytes(6).toString("hex");

  const client = await prisma.client.create({
    data: {
      name: "İlker Doğan",
      slug,
      protocolItems: {
        create: [
          {
            category: "SUPPLEMENT",
            productName: "Kreatin Monohidrat",
            dosage: "5g",
            daysOfWeek: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            timeOfDay: "Sabah",
            sortOrder: 0,
          },
          {
            category: "VITAMIN",
            productName: "Vitamin D3",
            dosage: "4000 IU",
            daysOfWeek: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            timeOfDay: "Sabah",
            sortOrder: 1,
          },
          {
            category: "PEPTIDE",
            productName: "BPC-157",
            dosage: "250mcg",
            daysOfWeek: ["MON", "WED", "FRI"],
            timeOfDay: "Akşam",
            sortOrder: 2,
          },
          {
            category: "ANABOLIC",
            productName: "Testosterone Enanthate",
            dosage: "250mg",
            daysOfWeek: ["MON", "THU"],
            timeOfDay: "Akşam",
            notes: "IM enjeksiyon",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  console.log(`Seeded client "${client.name}". Public link: /p/${client.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

// Prevents exhausting the database connection limit in dev due to
// Next.js hot-reloading creating a new PrismaClient on every edit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

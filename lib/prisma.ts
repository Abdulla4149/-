import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // Позволяем сборке пройти без DATABASE_URL; реальные запросы все равно упадут.
    // Это нужно, потому что Next.js может импортировать модули API во время build.
    return new PrismaClient({
      datasources: { db: { url: "postgresql://invalid:invalid@localhost:5432/invalid" } },
      log: ["error"],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;


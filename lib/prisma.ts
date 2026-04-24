import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

/** SQL no console: só com `PRISMA_LOG_QUERIES=true` (e reiniciar o dev). Sem isso, sem `query` nos logs. */
const prismaLog =
  process.env.PRISMA_LOG_QUERIES === "true" ? (["query", "error", "warn"] as const) : (["error"] as const);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [...prismaLog],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

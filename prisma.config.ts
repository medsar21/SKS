import "./scripts/load-env";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  ...(process.env.DIRECT_URL || process.env.DATABASE_URL
    ? {
        datasource: {
          url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
        },
      }
    : {}),
});

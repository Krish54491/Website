import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

const { parsed } = config({
  path: [".dev.vars", ".env.local", ".env"],
});

const dbUrl = parsed["DATABASE_URL"];

if (!dbUrl)
  throw new Error("DATABASE_URL is not defined in environment variables.");

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});

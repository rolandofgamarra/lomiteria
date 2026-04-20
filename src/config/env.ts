import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string().default("lomit-dev-secret-123!"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  CORS_ORIGINS: z.string().default("*"),
  SOCKET_CORS_ORIGINS: z.string().default("*"),
});

const _env = envSchema.parse(process.env);

export const env = _env;

import { z } from "zod";

const envSchema = z.object({
  RIOT_API_KEY: z.string().min(1),
  USE_MOCK_DATA: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  DEFAULT_REGION: z.enum(["americas", "europe", "asia", "sea"]).default("americas"),
  DEFAULT_PLATFORM: z.enum(["la1", "la2", "na1", "br1", "euw1", "eun1", "kr"]).default("la1"),
});

export const env = envSchema.parse({
  RIOT_API_KEY: process.env.RIOT_API_KEY,
  USE_MOCK_DATA: process.env.USE_MOCK_DATA,
  DEFAULT_REGION: process.env.DEFAULT_REGION,
  DEFAULT_PLATFORM: process.env.DEFAULT_PLATFORM,
});
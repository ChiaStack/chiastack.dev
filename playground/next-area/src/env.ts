import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CAPTCHA_PROVIDER: z
      .enum(["cloudflare-turnstile", "google-recaptcha"])
      .default("cloudflare-turnstile"),
    NEXT_PUBLIC_CAPTCHA_SITE_KEY: z
      .string()
      .default("1x00000000000000000000AA"),
  },
  server: {
    CAPTCHA_SECRET_KEY: z
      .string()
      .default("1x0000000000000000000000000000000AA"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CAPTCHA_PROVIDER:
      process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER ?? "cloudflare-turnstile",
    CAPTCHA_SECRET_KEY:
      process.env.CAPTCHA_SECRET_KEY ?? "1x0000000000000000000000000000000AA",
    NEXT_PUBLIC_CAPTCHA_SITE_KEY:
      process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? "1x00000000000000000000AA",
  },

  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.SKIP_ENV_VALIDATION === "1",
  emptyStringAsUndefined: true,
  extends: [],
});

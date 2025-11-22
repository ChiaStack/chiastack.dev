import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CAPTCHA_PROVIDER: z
      .enum(["cloudflare-turnstile", "google-recaptcha"])
      .default("cloudflare-turnstile"),
    NEXT_PUBLIC_CAPTCHA_SITE_KEY: z.string().min(1),
  },
  server: {
    CAPTCHA_SECRET_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CAPTCHA_PROVIDER:
      process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER ?? "cloudflare-turnstile",
    CAPTCHA_SECRET_KEY:
      process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
        ? process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER === "google-recaptcha"
          ? "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
          : "1x0000000000000000000000000000000AA"
        : process.env.CAPTCHA_SECRET_KEY,
    NEXT_PUBLIC_CAPTCHA_SITE_KEY:
      process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
        ? process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER === "google-recaptcha"
          ? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          : "1x00000000000000000000AA"
        : process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
  },

  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.SKIP_ENV_VALIDATION === "1",
  emptyStringAsUndefined: true,
  extends: [],
});

import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

import { resolveEnvImport } from "@chiastack/utils/server";

interface CaptchaServerEnvOptions {
  skipValidation?: boolean;
  clientPrefix?: string;
}

export const captchaServerEnv = (options?: CaptchaServerEnvOptions) => {
  const { skipValidation, clientPrefix = "" } = options ?? {};
  const runtimeEnv = resolveEnvImport();
  return createEnv({
    server: {
      [clientPrefix + "CAPTCHA_PROVIDER"]: z
        .enum(["cloudflare-turnstile", "google-recaptcha"])
        .default("google-recaptcha"),
      CAPTCHA_SECRET_KEY: z.string().min(1),
    },
    runtimeEnv: {
      [clientPrefix + "CAPTCHA_PROVIDER"]:
        runtimeEnv[clientPrefix + "CAPTCHA_PROVIDER"] ?? "google-recaptcha",
      CAPTCHA_SECRET_KEY:
        runtimeEnv.NODE_ENV === "development" || runtimeEnv.NODE_ENV === "test"
          ? runtimeEnv[clientPrefix + "CAPTCHA_PROVIDER"] === "google-recaptcha"
            ? "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
            : "1x0000000000000000000000000000000AA"
          : runtimeEnv[clientPrefix + "CAPTCHA_SECRET_KEY"],
    },
    skipValidation,
  });
};

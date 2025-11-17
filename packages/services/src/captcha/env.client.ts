import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

import { resolveEnvImport } from "@chiastack/utils/server";

interface CaptchaClientEnvOptions {
  skipValidation?: boolean;
  clientPrefix?: string;
}

export const captchaClientEnv = (options?: CaptchaClientEnvOptions) => {
  const { skipValidation, clientPrefix = "" } = options ?? {};
  const runtimeEnv = resolveEnvImport();
  return createEnv({
    client: {
      [clientPrefix + "CAPTCHA_PROVIDER"]: z
        .enum(["cloudflare-turnstile", "google-recaptcha"])
        .default("google-recaptcha"),
      [clientPrefix + "CAPTCHA_SITE_KEY"]: z.string().min(1),
    },
    clientPrefix,
    runtimeEnv: {
      [clientPrefix + "CAPTCHA_PROVIDER"]:
        runtimeEnv[clientPrefix + "CAPTCHA_PROVIDER"] ?? "google-recaptcha",
      [clientPrefix + "CAPTCHA_SITE_KEY"]:
        runtimeEnv.NODE_ENV === "development" || runtimeEnv.NODE_ENV === "test"
          ? runtimeEnv[clientPrefix + "CAPTCHA_PROVIDER"] === "google-recaptcha"
            ? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            : "1x00000000000000000000AA"
          : runtimeEnv[clientPrefix + "CAPTCHA_SITE_KEY"],
    },
    skipValidation,
  });
};

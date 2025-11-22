import type { NextRequest } from "next/server";
import * as z from "zod";

import {
  captchaSiteverify,
  CaptchaError,
  ErrorCode,
} from "@chiastack/services/captcha";

import { env } from "@/env";

const schema = z.object({
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const response = await captchaSiteverify(request, {
      provider: env.NEXT_PUBLIC_CAPTCHA_PROVIDER,
      captchaSecretKey: env.CAPTCHA_SECRET_KEY,
      onError: (code) => {
        console.error("CAPTCHA error:", code);
      },
    });
    if (!response.success) {
      return Response.json(
        { error: "CAPTCHA verification failed" },
        { status: 400 }
      );
    }
    const body = schema.parse(await request.json());
    return Response.json({ message: `Hello ${body.name}` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request", { status: 400 });
    }
    if (error instanceof CaptchaError) {
      switch (error.code) {
        case ErrorCode.CaptchaRequired:
          return Response.json(
            { error: "CAPTCHA verification required" },
            { status: 400 }
          );
        case ErrorCode.CaptchaFailed:
          return Response.json(
            { error: "CAPTCHA verification failed" },
            { status: 400 }
          );
        default:
          return Response.json({ error: "Unknown error" }, { status: 500 });
      }
    }
    return new Response("Internal server error", { status: 500 });
  }
}

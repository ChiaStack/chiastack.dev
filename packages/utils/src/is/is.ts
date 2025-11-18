import * as z from "zod";

export const isNumber = (value: unknown): value is number => {
  return z.number().safeParse(value).success;
};

export const isPositiveNumber = (value: unknown): value is number => {
  return z.number().positive().safeParse(value).success;
};

export const isNegativeNumber = (value: unknown): value is number => {
  return z.number().negative().safeParse(value).success;
};

export const isURL = (value: unknown): value is URL => {
  return z.instanceof(URL).safeParse(value).success;
};

export const isString = (value: unknown): value is string => {
  return z.string().safeParse(value).success;
};

export function isAbortError(error: unknown): error is DOMException {
  return (
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}

export const urlSchema = z.union([z.url(), z.instanceof(URL)]);

interface IsUrlOptions<TStrict extends boolean = false> {
  allowedProtocols?: string[];
  /**
   * force check is URL instance
   */
  strict?: TStrict;
}

export const isUrl = <T = unknown, TStrict extends boolean = false>(
  url: T,
  options?: IsUrlOptions<TStrict>
) => {
  const { allowedProtocols = ["http", "https"], strict } = options || {};
  try {
    const parsed = urlSchema.parse(url);
    if (strict && parsed instanceof URL) {
      const urlProtocol = parsed.protocol.replace(":", "");
      return allowedProtocols.includes(urlProtocol);
    }
    const _url = new URL(parsed).protocol.replace(":", "");
    return allowedProtocols.includes(_url);
  } catch {
    return false;
  }
};

export const isURLInstance = (url: unknown): url is URL => {
  return isUrl(url, { strict: true });
};

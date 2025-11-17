export const getClientIP = (
  request: Request,
  fallback = "anonymous"
): string => {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0] ??
    request.headers.get("X-Real-IP") ??
    fallback
  );
};

/**
 * Determines whether to use `import.meta.env` or `process.env` to read environment variables
 * @returns Returns the corresponding environment variables object
 */
export const resolveEnvImport = (): Record<string, string | undefined> => {
  if (typeof import.meta !== "undefined" && import.meta) {
    const meta = import.meta as unknown as Record<string, unknown>;
    if ("env" in meta && typeof meta.env === "object" && meta.env !== null) {
      return meta.env as Record<string, string | undefined>;
    }
  }

  if (typeof process !== "undefined" && process.env) {
    return process.env;
  }

  return {};
};

import { defineConfig } from "tsdown";
import type { UserConfig } from "tsdown";

export default defineConfig(
  (opts) =>
    [
      {
        clean: !opts.watch,
        dts: true,
        format: ["esm", "cjs"],
        minify: true,
        outDir: "dist",
        entry: ["base.ts"],
      },
    ] satisfies UserConfig[],
);

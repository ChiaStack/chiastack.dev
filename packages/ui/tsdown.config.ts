import { readFile, writeFile } from "fs/promises";
import { defineConfig, type Options } from "tsdown";

export default defineConfig(() => {
  const common = {
    // clean: !opts.watch,
    dts: true,
    format: ["esm"],
    minify: true,
    outDir: "dist",
  } satisfies Options;

  return [
    {
      ...common,
      entry: ["./src/index.ts"],
      esbuildOptions: (opts) => {
        opts.banner = {
          js: '"use client";',
        };
      },
    },
  ] satisfies Options[];
});

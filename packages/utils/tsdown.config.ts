import { readFile, writeFile } from "node:fs/promises";
import { defineConfig, type UserConfig } from "tsdown";

type PackageJson = {
  name: string;
  exports: Record<
    string,
    { import: string; types: string; require: string } | string
  >;
  typesVersions: Record<"*", Record<string, string[]>>;
  files: string[];
  dependencies: Record<string, string>;
  pnpm: {
    overrides: Record<string, string>;
  };
};

const ESEntries = [
  "./src/set-search-params/set-search-params.ts",
  "./src/day/day.ts",
  "./src/try-catch/try-catch.ts",
  "./src/is/is.ts",
  "./src/delay/delay.ts",
  "./src/server/server.ts",
];

export default defineConfig((opts) => {
  const common = {
    clean: !opts.watch,
    dts: true,
    format: ["esm", "cjs"],
    minify: true,
    outDir: "dist",
  } satisfies UserConfig;
  return [
    {
      ...common,
      entry: ["src/index.ts"],
    },
    {
      ...common,
      entry: ESEntries,
      async onSuccess() {
        const pkgJson = JSON.parse(
          await readFile("./package.json", {
            encoding: "utf-8",
          })
        ) as PackageJson;
        pkgJson.exports = {
          "./package.json": "./package.json",
          ".": {
            require: "./dist/index.cjs",
            import: "./dist/index.mjs",
            types: "./dist/index.d.mts",
          },
        };
        pkgJson.typesVersions = {
          "*": {},
        };
        [...ESEntries]
          .filter((e) => e.endsWith(".ts"))
          .forEach((entry) => {
            // ./src/foo/foo.ts -> foo
            const file = entry.split("/").pop()?.split(".")[0] ?? "";
            pkgJson.exports["./" + file] = {
              require: "./dist/" + file + "/" + file + ".cjs",
              import: "./dist/" + file + "/" + file + ".mjs",
              types: "./dist/" + file + "/" + file + ".d.mts",
            };
            pkgJson.typesVersions["*"][file] = [
              "./dist/" + file + "/" + file + ".d.mts",
            ];
          });

        await writeFile("./package.json", JSON.stringify(pkgJson, null, 2));
      },
    },
  ] satisfies UserConfig[];
});

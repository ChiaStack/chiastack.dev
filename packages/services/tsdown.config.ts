import { readFile, writeFile } from "node:fs/promises";
import { defineConfig, type UserConfig } from "tsdown";

type PackageJson = {
  name: string;
  exports: Record<string, { import: string; types: string } | string>;
  typesVersions: Record<"*", Record<string, string[]>>;
  files: string[];
  dependencies: Record<string, string>;
  pnpm: {
    overrides: Record<string, string>;
  };
};

const ESEntries = [
  "./src/captcha/captcha.ts",
  "./src/demo/demo.ts",
  "./src/demo/env.ts",
];

export default defineConfig((opts) => {
  const common = {
    clean: !opts.watch,
    dts: true,
    format: ["esm"],
    minify: true,
    outDir: "dist",
  } satisfies UserConfig;
  return [
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
        };
        pkgJson.typesVersions = {
          "*": {},
        };
        [...ESEntries]
          .filter((e) => e.endsWith(".ts"))
          .forEach((entry) => {
            // ./src/captcha/captcha.ts -> ./captcha
            // ./src/captcha/env.ts -> ./captcha/env
            const parts = entry
              .replace("./src/", "")
              .replace(".ts", "")
              .split("/");
            const dir = parts[0] ?? "";
            const file = parts[1] ?? "";

            // 如果文件名和目錄名相同，只使用目錄名；否則使用完整路徑
            const exportPath =
              file && file !== dir ? `./${dir}/${file}` : `./${dir}`;

            // dist 路徑：總是使用 dir/file 格式
            const distPath = file ? `${dir}/${file}` : `${dir}/${dir}`;

            pkgJson.exports[exportPath] = {
              import: `./dist/${distPath}.mjs`,
              types: `./dist/${distPath}.d.mts`,
            };

            // typesVersions 的 key：如果文件名和目錄名相同，只用目錄名；否則用完整路徑
            const typesKey = file && file !== dir ? `${dir}/${file}` : dir;
            pkgJson.typesVersions["*"][typesKey] = [`./dist/${distPath}.d.mts`];
          });

        await writeFile("./package.json", JSON.stringify(pkgJson, null, 2));
      },
    },
  ] satisfies UserConfig[];
});

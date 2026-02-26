import { readFile, writeFile } from "node:fs/promises";

import { defineConfig } from "tsdown";
import type { UserConfig } from "tsdown";

interface PackageJson {
  name: string;
  exports: Record<string, { import: string; types: string } | string>;
  typesVersions: Record<"*", Record<string, string[]>>;
  files: string[];
  dependencies: Record<string, string>;
  pnpm?: {
    overrides: Record<string, string>;
  };
}

const ESEntries = [
  "./src/trading-chart/chart.tsx",
  "./src/trading-chart/chart.context.ts",
  "./src/trading-chart/series.tsx",
  "./src/trading-chart/series.context.ts",
  "./src/trading-chart/macd-series.tsx",
  "./src/trading-chart/rsi-series.tsx",
  "./src/trading-chart/subscrib-visible-logical-range.tsx",
  "./src/error-boundary/error-boundary.tsx",
  "./src/image/image.tsx",
  "./src/utils/create-context.ts",
  "./src/utils/use-is-hydrated.ts",
];

export default defineConfig(() => {
  const common = {
    clean: true,
    dts: true,
    format: ["esm"],
    minify: true,
    outDir: "dist",
    platform: "neutral",
    sourcemap: false,
    exports: true,
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
          .filter((e) => e.endsWith(".tsx") || e.endsWith(".ts"))
          .forEach((entry) => {
            // ./src/trading-chart/chart.tsx -> trading-chart/chart
            const relativePath = entry
              .replace(/^\.\/src\//, "")
              .replace(/\.(tsx|ts)$/, "");
            const pathParts = relativePath.split("/");
            const fileName = pathParts[pathParts.length - 1] ?? "";
            const folderName = pathParts[pathParts.length - 2];

            // 如果檔案名和最後一個 folder 名稱相同，則只顯示一個
            // 例如: ./src/foo/foo.tsx -> ./foo
            // 否則顯示完整路徑: ./src/trading-chart/chart.tsx -> ./trading-chart/chart
            const exportPath =
              folderName === fileName ? `./${fileName}` : `./${relativePath}`;

            pkgJson.exports[exportPath] = {
              import: "./dist/" + relativePath + ".js",
              types: "./dist/" + relativePath + ".d.ts",
            };
            pkgJson.typesVersions["*"][exportPath.replace(/^\.\//, "")] = [
              "./dist/" + relativePath + ".d.ts",
            ];
          });

        await writeFile("./package.json", JSON.stringify(pkgJson, null, 2));
      },
    },
  ] satisfies UserConfig[];
});

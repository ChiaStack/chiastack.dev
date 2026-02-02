import https from "node:https";
import { resolve } from "node:path";

/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv } from "vite";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  process.env.VITE_APP_BUILD_TIMESTAMP = Date.now().toString();

  return defineConfig({
    plugins: [
      tanstackRouter({ autoCodeSplitting: true }),
      viteReact({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      tailwindcss(),
    ],
    test: {
      globals: true,
      environment: "jsdom",
      passWithNoTests: true,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.vitest": "undefined",
    },
    server: {
      proxy: {
        "/proxy": {
          target:
            process.env.VITE_APP_BACKEND_ENDPOINT ?? "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy/, ""),
          agent: new https.Agent(),
        },
      },
    },
  });
};

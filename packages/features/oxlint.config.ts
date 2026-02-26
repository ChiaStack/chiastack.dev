import { defineConfig } from "oxlint";

import { baseConfig } from "@chiastack/oxlint/base";

export default defineConfig({
  extends: [baseConfig],
  plugins: ["react"],
  categories: {
    correctness: "off",
  },
  env: {
    builtin: true,
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "react/react-in-jsx-scope": "off",
      },
      globals: {
        React: "writable",
      },
    },
  ],
});

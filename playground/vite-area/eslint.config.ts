import { defineConfig } from "eslint/config";

import baseConfig from "@chiastack/eslint/base";
import reactConfig from "@chiastack/eslint/react";

export default defineConfig(baseConfig, reactConfig);

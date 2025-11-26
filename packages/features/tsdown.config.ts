import { defineConfig } from "tsdown";

const ESEntries = [
  "./src/chat/store/index.tsx",
  "./src/chat/utils.ts",
  "./src/chat/types/message.ts",
  "./src/chat/enums/chat-status.enum.ts",
  "./src/chat/enums/message-role.enum.ts",
  "./src/chat/index.ts",
  "./src/tic-tac-toe/store.tsx",
  "./src/tic-tac-toe/action.ts",
  "./src/tic-tac-toe/utils.ts",
  "./src/tic-tac-toe/index.ts",
  "./src/todo/store.tsx",
  "./src/todo/actions.ts",
  "./src/todo/index.ts",
  "./src/utils/uuid.ts",
  "./src/utils/logger.ts",
  "./src/utils/stream.ts",
  "./src/utils/storeDebug.ts",
  "./src/utils/middleware/create-devtools.ts",
  "./src/utils/index.ts",
];

export default defineConfig({
  clean: true,
  dts: true,
  format: ["esm"],
  minify: true,
  outDir: "dist",
  tsconfig: "./tsconfig.build.json",
  exports: true,
  platform: "neutral",
  sourcemap: false,
  entry: ESEntries,
  inputOptions: {
    transform: {
      jsx: "react",
    },
  },
});

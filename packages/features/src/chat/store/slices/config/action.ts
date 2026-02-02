import type { StateCreator } from "zustand/vanilla";

import type { ChatStore } from "../..";
import type { MessageItem } from "../../../types/message";

export interface ChatConfigAction<TMessageItem extends MessageItem, TContext> {
  getContext: () => ChatStore<TMessageItem, unknown, TContext>["context"];
  setContext: (context: TContext) => void;
}

export const chatConfigActions: StateCreator<
  ChatStore<MessageItem, unknown, unknown>,
  [],
  [],
  ChatConfigAction<MessageItem, unknown>
> = (set, get) => ({
  getContext: () => get().context,
  setContext: (context: unknown) => set({ context }),
});

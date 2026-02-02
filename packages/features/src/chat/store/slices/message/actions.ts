import type { StateCreator } from "zustand/vanilla";

import type { ChatStore } from "../..";
import type { MessageItem } from "../../../types/message";
import { DEFAULT_THREAD_ID } from "../../../utils";

export interface MessageAction<TMessageItem extends MessageItem> {
  pushMessage: (messages: TMessageItem[]) => void;
  deleteMessage: (id: string) => void;
  updateMessage: (id: string, message: Partial<TMessageItem>) => void;
  deleteLastMessage: () => void;
  getMessage: (id: string) => TMessageItem | undefined;
  getLastMessage: () => TMessageItem | undefined;
  updateLastMessageContent: (content: string) => void;
  updateLastMessage: (message: Partial<TMessageItem>) => void;
  getLatestUserMessage: () => TMessageItem | undefined;
  getUserMessageForAssistant: (
    assistantMessage: TMessageItem
  ) => TMessageItem | undefined;
  setNewMessage: (message: TMessageItem) => void;
  clearMessagesKeepToken: () => void;
  setMessages: (messages: TMessageItem[]) => void;
}

export const messageActions: StateCreator<
  ChatStore<MessageItem, unknown, unknown>,
  [],
  [],
  MessageAction<MessageItem>
> = (set, get) => ({
  pushMessage: (messages: MessageItem[]) => {
    set({ items: [...get().items, ...messages] }, false);
  },
  deleteMessage: (id: string) => {
    set({ items: get().items.filter((item) => item.id !== id) }, false);
  },
  updateLastMessageContent: (content: string) => {
    set(
      {
        items: get().items.map((item) =>
          item.id === get().items[get().items.length - 1]?.id
            ? { ...item, content }
            : item
        ),
      },
      false
    );
  },
  updateLastMessage: (message: Partial<MessageItem>) => {
    set(
      {
        items: get().items.map((item) =>
          item.id === get().items[get().items.length - 1]?.id
            ? { ...item, ...message }
            : item
        ),
      },
      false
    );
  },
  updateMessage: (id: string, message: Partial<MessageItem>) => {
    set(
      {
        items: get().items.map((item) =>
          item.id === id ? { ...item, ...message } : item
        ),
      },
      false
    );
  },
  deleteLastMessage: () => {
    set({ items: get().items.slice(0, -1) }, false);
  },
  getMessage: (id: string) => {
    return get().items.find((item) => item.id === id);
  },
  getLastMessage: () => {
    return get().items[get().items.length - 1];
  },
  getLatestUserMessage: () => {
    return get()
      .items.slice()
      .reverse()
      .find((item) => item.role === "user");
  },
  getUserMessageForAssistant: (assistantMessage: MessageItem) => {
    if (assistantMessage.role !== "assistant" || !assistantMessage.parentId) {
      return undefined;
    }
    return get().getMessage(assistantMessage.parentId);
  },
  setNewMessage: (message: MessageItem) => {
    set({ items: [...get().items, message] }, false);
  },
  clearMessagesKeepToken: () => {
    set(
      {
        items: [],
        currentStream: null,
        threadId: DEFAULT_THREAD_ID,
      },
      false
    );
  },
  setMessages: (messages: MessageItem[]) => {
    set({ items: messages }, false);
  },
});

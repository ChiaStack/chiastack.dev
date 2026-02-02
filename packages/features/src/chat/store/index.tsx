"use client";

import * as React from "react";

import { useStore } from "zustand";
import type { StateCreator, StoreApi } from "zustand/vanilla";
import { createStore } from "zustand/vanilla";

import type { MessageItem } from "../types/message";

import { initialChatState } from "./initial-state";
import type { ChatState } from "./initial-state";
import { chatActions } from "./slices/chat/actions";
import type { ChatAction } from "./slices/chat/actions";
import type { ChatConfigAction } from "./slices/config/action";
import { chatConfigActions } from "./slices/config/action";
import { messageActions } from "./slices/message/actions";
import type { MessageAction } from "./slices/message/actions";

export type ChatStore<
  TMessageItem extends MessageItem,
  TStreamRequestDTO,
  TContext,
> = ChatState<TMessageItem, TStreamRequestDTO, TContext> &
  ChatAction<TMessageItem, TContext> &
  MessageAction<TMessageItem> &
  ChatConfigAction<TMessageItem, TContext>;

export type ChatStoreApi<
  TMessageItem extends MessageItem,
  TStreamRequestDTO,
  TContext,
> = StateCreator<ChatStore<TMessageItem, TStreamRequestDTO, TContext>, [], []>;

export interface ChatStoreProviderProps<
  TMessageItem extends MessageItem,
  TStreamRequestDTO,
  TContext,
> {
  children: React.ReactNode;
  values?: Partial<ChatState<TMessageItem, TStreamRequestDTO, TContext>>;
}

export interface DefineChatStoreProps<
  TMessageItem extends MessageItem,
  TStreamRequestDTO,
  TContext,
> {
  initState?: Partial<ChatState<TMessageItem, TStreamRequestDTO, TContext>>;
  messageProcessor: ChatStore<
    TMessageItem,
    TStreamRequestDTO,
    TContext
  >["messageProcessor"];
}

const createChatStore =
  <
    TMessageItem extends MessageItem,
    TStreamRequestDTO = unknown,
    TContext = unknown,
  >(
    initState?: Partial<ChatState<TMessageItem, TStreamRequestDTO, TContext>>
  ): ChatStoreApi<TMessageItem, TStreamRequestDTO, TContext> =>
  (...params) =>
    ({
      ...initialChatState,

      ...initState,

      // @ts-expect-error - fix actions generic type
      ...chatActions(...params),

      // @ts-expect-error - fix actions generic type
      ...messageActions(...params),

      // @ts-expect-error - fix actions generic type
      ...chatConfigActions(...params),
    }) as ChatStore<TMessageItem, TStreamRequestDTO, TContext>;

export const defineChatStore = <
  TMessageItem extends MessageItem,
  TStreamRequestDTO,
  TContext,
>({
  initState,
  messageProcessor,
}: DefineChatStoreProps<TMessageItem, TStreamRequestDTO, TContext>) => {
  const creator = (
    state?: Partial<ChatState<TMessageItem, TStreamRequestDTO, TContext>>
  ) => {
    return createStore<ChatStore<TMessageItem, TStreamRequestDTO, TContext>>(
      createChatStore<TMessageItem, TStreamRequestDTO, TContext>({
        ...initState,
        ...state,
        messageProcessor,
      })
    );
  };

  const ChatStoreContext = React.createContext<
    StoreApi<ChatStore<TMessageItem, TStreamRequestDTO, TContext>> | undefined
  >(undefined);

  const ChatStoreProvider = ({
    children,
    values,
  }: ChatStoreProviderProps<TMessageItem, TStreamRequestDTO, TContext>) => {
    const storeRef =
      React.useRef<
        StoreApi<ChatStore<TMessageItem, TStreamRequestDTO, TContext>>
      >(null);
    if (!storeRef.current) {
      storeRef.current = creator(values);
    }

    return (
      <ChatStoreContext value={storeRef.current}>{children}</ChatStoreContext>
    );
  };

  const useChatStore = <T,>(
    selector: (
      store: ChatStore<TMessageItem, TStreamRequestDTO, TContext>
    ) => T,
    name = "useChatStore"
  ): T => {
    const chatStoreContext = React.use(ChatStoreContext);
    if (!chatStoreContext) {
      throw new Error(`${name} must be used within ChatStoreProvider`);
    }

    return useStore(chatStoreContext, selector);
  };

  return { ChatStoreProvider, useChatStore, ChatStoreContext, creator };
};

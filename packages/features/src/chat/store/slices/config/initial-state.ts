import type { z } from "zod";
import type { StateCreator } from "zustand/vanilla";

import type { ChatStore } from "../..";
import type { fetchStream } from "../../../../utils/stream";
import type { MessageItem } from "../../../types/message";
import { messageItemSchema } from "../../../types/message";
import type { ChatAction } from "../chat/actions";

export interface BaseContext<
  TMessageItem extends MessageItem,
  TStreamRequestDTO = unknown,
  TContext = unknown,
> {
  set: Parameters<
    StateCreator<
      ChatStore<TMessageItem, TStreamRequestDTO, TContext>,
      [],
      [],
      ChatAction<TMessageItem, TContext>
    >
  >[0];
  get: Parameters<
    StateCreator<
      ChatStore<TMessageItem, TStreamRequestDTO, TContext>,
      [],
      [],
      ChatAction<TMessageItem, TContext>
    >
  >[1];
  ctx: Parameters<
    StateCreator<
      ChatStore<TMessageItem, TStreamRequestDTO, TContext>,
      [],
      [],
      ChatAction<TMessageItem, TContext>
    >
  >[2];
}

export interface ChatConfig<
  TMessageItem extends MessageItem,
  TStreamRequestDTO = unknown,
  TContext = unknown,
> {
  stream?: boolean;
  endpoint: string;
  messageSchema: z.ZodType<TMessageItem, TMessageItem>;
  messageProcessor: (
    context: BaseContext<TMessageItem, TStreamRequestDTO, TContext> & {
      response: Awaited<ReturnType<typeof fetchStream>>;
    }
  ) => void | Promise<void>;
  onCancel?: (
    context: BaseContext<TMessageItem, TStreamRequestDTO, TContext>
  ) => void | Promise<void>;
  preRequest?: (
    context: BaseContext<TMessageItem, TStreamRequestDTO, TContext> & {
      messages: TMessageItem[];
    }
  ) => void | Promise<void>;
  postRequest?: (
    context: BaseContext<TMessageItem, TStreamRequestDTO, TContext>
  ) => void | Promise<void>;
  handleFetch?: (
    context: BaseContext<TMessageItem, TStreamRequestDTO, TContext> & {
      messages: TMessageItem[];
      response: Response;
    }
  ) => void | Promise<void>;
  requestInit?: (
    context: BaseContext<TMessageItem, TStreamRequestDTO, TContext>
  ) => RequestInit & {
    searchParams?: Record<string, string>;
  };
  requestDTO?: (
    context: BaseContext<TMessageItem, TStreamRequestDTO, TContext> & {
      messages: TMessageItem[];
    }
  ) => TStreamRequestDTO;
  context?: TContext;
}

export const initialChatConfig: ChatConfig<MessageItem> = {
  stream: true,
  endpoint: "/api/chat",
  messageSchema: messageItemSchema,
  messageProcessor: () => {
    throw new Error("Please implement your own messageProcessor");
  },
};

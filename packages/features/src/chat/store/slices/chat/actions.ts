import * as z from "zod";
import type { StateCreator } from "zustand/vanilla";

import { dayjs } from "@chiastack/utils/day";
import { isAbortError } from "@chiastack/utils/is";
import { tryCatch } from "@chiastack/utils/try-catch";

import type { ChatStore } from "../..";
import { logger } from "../../../../utils/logger";
import { fetchStream } from "../../../../utils/stream";
import { uuid } from "../../../../utils/uuid";
import { ChatStatus } from "../../../enums/chat-status.enum";
import type { MessageItem } from "../../../types/message";
import { DEFAULT_THREAD_ID } from "../../../utils";
import type { BaseContext } from "../config/initial-state";

export interface ChatAction<TMessageItem extends MessageItem, TContext> {
  setInput: (input: string) => void;
  setStatus: (status: ChatStatus) => void;
  handleSubmit: (
    content?: string,
    parts?: {
      tools?: TMessageItem["toolCalls"];
      rawContent?: string;
      context?: {
        user?: unknown;
        assistant?: unknown;
      };
    },
    config?: {
      stream?: boolean;
      preSubmit?: (
        context: BaseContext<TMessageItem, unknown, TContext>
      ) => void | Promise<void>;
      postSubmit?: (
        context: BaseContext<TMessageItem, unknown, TContext>
      ) => void | Promise<void>;
    }
  ) => void | Promise<void>;
  handleRetry: (
    id: string,
    config?: {
      stream?: boolean;
    },
    handler?: (message: TMessageItem) => void
  ) => void;
  handleCancel: () => void;
  resetSession: () => void;
  setThreadId: (threadId: string) => void;

  /**
   * INTERNAL USE ONLY
   */
  internal_setStream: (stream: string) => void;
  internal_stream: (messages: TMessageItem[]) => ReturnType<typeof fetchStream>;
  internal_abort: () => void;
  internal_bypassRequest: () => never;
  internal_handleSSE: (messages: TMessageItem[]) => void | Promise<void>;
  internal_handleFetch: (messages: TMessageItem[]) => Promise<void>;
}

class BypassRequest extends Error {
  constructor() {
    super("BypassRequest");
  }
}

export const chatActions: StateCreator<
  ChatStore<MessageItem, unknown, unknown>,
  [],
  [],
  ChatAction<MessageItem, unknown>
> = (set, get, ctx) => ({
  setInput: (input: string) => {
    set({ input }, false);
  },
  setStatus: (status: ChatStatus) => {
    set({ status }, false);
  },
  handleSubmit: async (
    content,
    parts,
    { stream = true, preSubmit, postSubmit } = {}
  ) => {
    if (
      (!get().input && !content) ||
      get().status === ChatStatus.Streaming ||
      get().status === ChatStatus.Searching ||
      get().isPending
    ) {
      return;
    }
    const userId = uuid();
    const assistantId = uuid();
    const lastMessage = get().getLastMessage();
    get().pushMessage([
      {
        role: "user",
        content: content ?? get().input,
        rawContent: parts?.rawContent,
        createdAt: dayjs().toDate(),
        id: userId,
        parentId: lastMessage?.id ?? null,
        reasoning: null,
        threadId: get().threadId,
        toolCalls: parts?.tools,
        context: parts?.context?.user,
        error: null,
      },
      {
        role: "assistant",
        content: "",
        createdAt: dayjs().toDate(),
        id: assistantId,
        parentId: userId,
        reasoning: null,
        threadId: get().threadId,
        toolCalls: parts?.tools,
        context: parts?.context?.assistant,
        error: null,
      },
    ]);
    set({ status: ChatStatus.Streaming, input: "" }, false);
    set({ isPending: true }, false);

    if (preSubmit) {
      await preSubmit({ set, get, ctx });
    }

    if (get().stream && stream) {
      await get().internal_handleSSE(get().items);
    } else {
      await get().internal_handleFetch(get().items);
    }

    if (postSubmit) {
      await postSubmit({ set, get, ctx });
    }
  },
  handleRetry: (id, { stream = true } = {}, handler) => {
    const message = get().getMessage(id);
    if (!message) {
      return;
    }
    if (handler) {
      handler(message);
      return;
    }
    void get().updateMessage(id, {
      error: null,
      content: "",
      reasoning: null,
      createdAt: dayjs().toDate(),
    });
    set({ status: ChatStatus.Streaming }, false);
    set({ isPending: true }, false);
    if (get().stream && stream) {
      void get().internal_handleSSE(get().items);
    } else {
      void get().internal_handleFetch(get().items);
    }
  },
  handleCancel: () => {
    set({ status: ChatStatus.Idle }, false);
    try {
      get().internal_abort();
      set({ isPending: false }, false);
      const lastMessage = get().getLastMessage();
      if (lastMessage) {
        void get().updateMessage(lastMessage.id, {
          reasoning: null,
        });
      }
      void get().onCancel?.({ set, get, ctx });
    } catch (error) {
      logger(["Error in handleCancel:", error], { type: "error" });
    }
  },
  resetSession: () => {
    set({ threadId: DEFAULT_THREAD_ID }, false);
  },
  setThreadId: (threadId: string) => {
    set({ threadId }, false);
  },
  /**
   * INTERNAL USE ONLY
   */
  internal_setStream: (stream: string) => {
    set({ currentStream: stream }, false);
  },
  /**
   * INTERNAL USE ONLY
   */
  internal_stream: async (messages) => {
    let abortController = get().abortController;
    if (!abortController || abortController.signal.aborted) {
      abortController = new AbortController();
      set({ abortController }, false);
    }
    const dto = get().requestDTO?.({ set, get, ctx, messages });
    return await fetchStream(
      get().endpoint,
      dto ?? { messages, id: get().threadId },
      {
        signal: abortController.signal,
        ...get().requestInit?.({ set, get, ctx }),
      }
    );
  },
  /**
   * INTERNAL USE ONLY
   */
  internal_abort: () => {
    const abortController = get().abortController;
    if (abortController && !abortController.signal.aborted) {
      abortController.abort();
      set({ abortController: undefined }, false);
    }
  },
  /**
   * INTERNAL USE ONLY
   */
  internal_bypassRequest: () => {
    throw new BypassRequest();
  },
  /**
   * INTERNAL USE ONLY
   */
  internal_handleSSE: async (_messages) => {
    const messages = z.array(get().messageSchema).parse(_messages);
    try {
      await get().preRequest?.({ set, get, ctx, messages });
      const { data: response, error } = await tryCatch(
        get().internal_stream(messages)
      );
      if (error) {
        logger(["Error in internal_handleSSE:", error], { type: "error" });
        if (isAbortError(error)) {
          logger("Request was aborted", { type: "info" });
          return;
        }
        set({ status: ChatStatus.Error }, false);
        return;
      }
      await get().messageProcessor({ set, get, ctx, response });
      await get().postRequest?.({ set, get, ctx });
    } catch (error) {
      if (isAbortError(error)) {
        logger("Request was aborted", { type: "info" });
        return;
      }
      if (error instanceof BypassRequest) {
        logger("BypassRequest", { type: "info" });
        set({ status: ChatStatus.Idle }, false);
        return;
      }
      logger(["Error in internal_handleSSE:", error], { type: "error" });
      set({ status: ChatStatus.Error }, false);
    }
  },
  /**
   * INTERNAL USE ONLY
   */
  internal_handleFetch: async (_messages) => {
    const messages = z.array(get().messageSchema).parse(_messages);
    const dto = get().requestDTO?.({ set, get, ctx, messages });
    let abortController = get().abortController;
    if (!abortController || abortController.signal.aborted) {
      abortController = new AbortController();
      set({ abortController }, false);
    }
    try {
      await get().preRequest?.({ set, get, ctx, messages });
      const response = await fetch(get().endpoint, {
        method: "POST",
        body: JSON.stringify(dto ?? { messages, id: get().threadId }),
        headers: {
          "Content-Type": "application/json",
        },
        // signal: abortController?.signal,
        ...get().requestInit?.({ set, get, ctx }),
      });

      if (!response?.ok) {
        throw new Error("Failed to fetch");
      }

      await get().handleFetch?.({ set, get, ctx, messages, response });
      await get().postRequest?.({ set, get, ctx });
    } catch (error) {
      if (isAbortError(error)) {
        logger("Request was aborted", { type: "info" });
        return;
      }
      if (error instanceof BypassRequest) {
        logger("BypassRequest", { type: "info" });
        set({ status: ChatStatus.Idle }, false);
        return;
      }
      logger(["Error in internal_handleSSE:", error], { type: "error" });
      set({ status: ChatStatus.Error }, false);
    }
  },
});

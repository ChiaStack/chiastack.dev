"use client";

import * as React from "react";

import { useStore } from "zustand";
import type { StateCreator, StoreApi } from "zustand/vanilla";
import { createStore } from "zustand/vanilla";

import type { TodoActions } from "./actions";
import { createTodoActions } from "./actions";
import type { InitialState } from "./initial-state";
import { initialState } from "./initial-state";

export type TodoStore = InitialState & TodoActions;

export type TodoStoreApi = StateCreator<TodoStore, [], []>;

export interface TodoStoreProviderProps {
  children: React.ReactNode;
  initialState?: Partial<InitialState>;
}

const createTodoStore =
  (initialValues?: Partial<InitialState>): TodoStoreApi =>
  (...params) => ({
    ...initialState,
    ...initialValues,

    ...createTodoActions(...params),
  });

const TodoStoreContext = React.createContext<StoreApi<TodoStore> | null>(null);

const creator = (state?: Partial<InitialState>) => {
  const _state = {
    ...initialState,
    ...state,
  };

  return createStore<TodoStore>(createTodoStore(_state));
};
export const TodoStoreProvider = ({
  children,
  initialState,
}: TodoStoreProviderProps) => {
  const store = React.useRef<StoreApi<TodoStore>>(null);

  if (!store.current) {
    store.current = creator(initialState);
  }

  return <TodoStoreContext value={store.current}>{children}</TodoStoreContext>;
};

export const useTodoStore = <T,>(
  selector: (store: TodoStore) => T,
  name = "useTodoStore"
): T => {
  const store = React.use(TodoStoreContext);
  if (!store) {
    throw new Error(`${name} must be used within a TodoStoreProvider.`);
  }
  return useStore(store, selector);
};

"use client";

import * as React from "react";

import { useStore } from "zustand";
import type { StateCreator, StoreApi } from "zustand/vanilla";
import { createStore } from "zustand/vanilla";

import { createDevtools } from "../utils/middleware/create-devtools";

import type { TicTacToeActions } from "./action";
import { createTicTacToeActions } from "./action";
import type { InitialState } from "./initial-state";
import { initialState } from "./initial-state";

export type TicTacToeStore = InitialState & TicTacToeActions;

export type TicTacToeStoreApi = StateCreator<
  TicTacToeStore,
  [["zustand/devtools", never]],
  [],
  TicTacToeStore
>;

export interface TicTacToeStoreProviderProps {
  children: React.ReactNode;
  initialState?: Partial<InitialState>;
}

const devtools = createDevtools("TicTacToeStore");

const creator = (state?: Partial<InitialState>) => {
  const _state = {
    ...initialState,
    ...state,
  };

  return createStore<TicTacToeStore, [["zustand/devtools", never]]>(
    devtools(createTicTacToeStore(_state), {
      enabled: true,
    })
  );
};

export const createTicTacToeStore =
  (initialValues?: Partial<InitialState>): TicTacToeStoreApi =>
  (...params) => ({
    ...initialState,
    ...initialValues,

    ...createTicTacToeActions(...params),
  });

export const TicTacToeStoreContext =
  React.createContext<StoreApi<TicTacToeStore> | null>(null);

export const useTicTacToeStore = <T,>(
  selector: (store: TicTacToeStore) => T,
  name = "useTicTacToeStore"
): T => {
  const store = React.useContext(TicTacToeStoreContext);
  if (!store) {
    throw new Error(`${name} must be used within a TicTacToeStoreProvider.`);
  }
  return useStore(store, selector);
};

export const TicTacToeStoreProvider = ({
  children,
  initialState,
}: TicTacToeStoreProviderProps) => {
  const store = React.useRef<StoreApi<TicTacToeStore>>(null);

  if (!store.current) {
    store.current = creator(initialState);
  }

  return (
    <TicTacToeStoreContext.Provider value={store.current}>
      {children}
    </TicTacToeStoreContext.Provider>
  );
};

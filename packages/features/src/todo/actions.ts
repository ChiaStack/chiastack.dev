import type { StateCreator } from "zustand/vanilla";

import { nanoid } from "../utils/uuid";

import type { Todo, InitialState } from "./initial-state";

export interface TodoActions {
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  clearTodos: () => void;
  updateTodo: (id: string, text: string) => void;
  /**
   * Reset the todos to the given items.
   * @param items - The items to reset the todos to.
   */
  resetTodos: (items: Todo[]) => void;
}

export const createTodoActions: StateCreator<
  InitialState,
  [],
  [],
  TodoActions
> = (set) => ({
  addTodo: (text: string) => {
    set((state) => ({
      items: [...state.items, { id: nanoid(), text, completed: false }],
    }));
  },
  removeTodo: (id: string) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },
  toggleTodo: (id: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  },
  clearTodos: () => {
    set({ items: [] });
  },
  updateTodo: (id: string, text: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, text } : item
      ),
    }));
  },
  resetTodos: (items: Todo[]) => {
    set({ items });
  },
});

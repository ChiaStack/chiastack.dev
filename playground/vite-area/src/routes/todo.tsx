import { createFileRoute } from "@tanstack/react-router";

import { TodoStoreProvider } from "@chiastack/features/todo/store";

import { TodoList } from "@/containers/todo-list";

export const Route = createFileRoute("/todo")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <TodoStoreProvider>
      <TodoList />
    </TodoStoreProvider>
  );
}

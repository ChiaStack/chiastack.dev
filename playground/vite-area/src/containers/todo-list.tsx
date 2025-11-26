import { useTodoStore } from "@chiastack/features/todo/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TodoList() {
  // Get todo list
  const todos = useTodoStore((state) => state.items);

  // Get action methods
  const addTodo = useTodoStore((state) => state.addTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const clearTodos = useTodoStore((state) => state.clearTodos);

  return (
    <div>
      <h1>Todos</h1>
      {todos.map((todo) => (
        <div key={todo.id}>
          <Input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.text}</span>
          <Button onClick={() => removeTodo(todo.id)}>Delete</Button>
        </div>
      ))}
      <Button onClick={() => addTodo("New Task")}>Add Task</Button>
      <Button onClick={clearTodos}>Clear All</Button>
    </div>
  );
}

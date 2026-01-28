import TodoItem from "./TodoItem";
import type { Todo } from "~/features/todos/types";

interface User {
  id: number;
  name: string;
}

export default function TodoList({
  todos,
  users,
  onToggle,
  onDelete,
  onUpdate,
}: {
  todos: Todo[];
  users: User[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
}) {
  if (!todos.length)
    return <p className="font-bold text-violet-600 dark:text-gray-200 text-center">No todos found.</p>;

  return (
    <div className="space-y-2">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          user={users.find((u) => u.id === t.userId)}
          onToggle={() => onToggle(t.id)}
          onDelete={() => onDelete(t.id)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

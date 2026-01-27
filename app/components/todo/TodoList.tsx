import TodoItem from "./TodoItem";
import type {Todo} from "~/features/todos/types";

export default function TodoList({
  todos,
  onToggle,
  onDelete,
}: {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  if (!todos.length)
    return <p className="text-gray-500">No todos found.</p>;

  return (
    <div className="space-y-2">
      {todos.map(t => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={() => onToggle(t.id)}
          onDelete={() => onDelete(t.id)}
        />
      ))}
    </div>
  );
}

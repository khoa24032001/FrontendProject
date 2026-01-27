import type {Todo} from "~/features/todos/types";

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-800">
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={todo.completed} onChange={onToggle} />
        <span className={todo.completed ? "line-through text-gray-500" : ""}>
          {todo.title}
        </span>
      </div>
      <button onClick={onDelete} className="text-red-500">✕</button>
    </div>
  );
}

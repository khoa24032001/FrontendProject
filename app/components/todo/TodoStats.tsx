import type {Todo} from "~/features/todos/types";

export default function TodoStats({ todos }: { todos: Todo[] }) {
  const completed = todos.filter(t => t.completed).length;

  return (
    <p className="text-sm text-gray-500">
      Completed {completed}/{todos.length}
    </p>
  );
}

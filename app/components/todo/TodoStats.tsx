import type {Todo} from "~/features/todos/types";

export default function TodoStats({ todos }: { todos: Todo[] }) {
  const completed = todos.filter(t => t.completed).length;

  return (
    <div className="mb-4 flex justify-between items-center flex-wrap">
      <p className="text-sm font-bold text-gray-400 dark:text-gray-400">
        Active {todos.length - completed}/{todos.length}
      </p>

      <p className="text-sm font-bold text-gray-400 dark:text-gray-400">
        Completed {completed}/{todos.length}
      </p>
    </div>
  );
}

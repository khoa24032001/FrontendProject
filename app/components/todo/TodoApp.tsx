import { useMemo, useState, useEffect } from "react";
import { useTodos } from "~/features/todos/hooks";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import TodoStats from "./TodoStats";
import TodoToolbar from "./TodoToolbar";
import TodoPagination from "./TodoPagination";

const PAGE_SIZE = 10;

export default function TodoApp() {
  const { todos, isLoading, isError, updateTodos } = useTodos();
  console.log("Rendering TodoApp with todos:", todos);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return todos.filter(t => {
      if (filter === "active" && t.completed) return false;
      if (filter === "completed" && !t.completed) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [todos, filter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedTodos = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [page, totalPages]);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Todo App</h1>

      <TodoForm onAdd={(title) =>
        updateTodos(prev => [
          { id: Date.now(), title, completed: false, userId: 1 },
          ...prev,
        ])
      } />

      <TodoToolbar
        filter={filter}
        onFilterChange={setFilter}
        onSearch={setSearch}
      />

      <TodoStats todos={todos} />

      <TodoList
        todos={paginatedTodos}
        onToggle={(id) =>
          updateTodos(prev =>
            prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
          )
        }
        onDelete={(id) =>
          updateTodos(prev => prev.filter(t => t.id !== id))
        }
      />

      <TodoPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

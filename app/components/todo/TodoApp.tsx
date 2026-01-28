import { useEffect, useMemo, useState } from "react";
import { useTodos, useUsers } from "~/features/todos/hooks";

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import TodoStats from "./TodoStats";
import TodoToolbar from "./TodoToolbar";
import TodoPagination from "./TodoPagination";

const PAGE_SIZE = 10;

const CURRENT_USER = {
  id: 999,
  name: "Anh Khoa",
  email: "anhkhoa@local.app",
};

export default function TodoApp() {
  const { todos, isLoading, isError, updateTodos } = useTodos();
  const { data: users = [] } = useUsers();

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<number | "all">("all");

  const allUsers = useMemo(() => {
    const exists = users.some(u => u.name === CURRENT_USER.name);
    return exists ? users : [CURRENT_USER, ...users];
  }, [users]);

  const filtered = useMemo(() => {
    return todos.filter(t => {
      if (filter === "active" && t.completed) return false;
      if (filter === "completed" && !t.completed) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedUser !== "all" && t.userId !== selectedUser) return false;
      return true;
    });
  }, [todos, filter, search, selectedUser]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedTodos = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filter, search, selectedUser]);

  // handle page overflow when deleting items
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [page, totalPages]);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load todos</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Todo App</h1>

      <TodoForm
        onAdd={(title) =>
          updateTodos(prev => [
            {
              id: Date.now(),
              title,
              completed: false,
              userId: CURRENT_USER.id,
            },
            ...prev,
          ])
        }
      />

      <TodoToolbar
        filter={filter}
        users={allUsers}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        onFilterChange={setFilter}
        onSearch={setSearch}
      />

      <TodoStats todos={filtered} />

      <TodoList
        todos={paginatedTodos}
        users={allUsers}
        onToggle={(id) =>
          updateTodos(prev =>
            prev.map(t =>
              t.id === id ? { ...t, completed: !t.completed } : t
            )
          )
        }
        onDelete={(id) =>
          updateTodos(prev => prev.filter(t => t.id !== id))
        }
        onUpdate={(id, title) =>
          updateTodos(prev =>
            prev.map(t =>
              t.id === id
                ? { ...t, title, userId: CURRENT_USER.id }
                : t
            )
          )
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

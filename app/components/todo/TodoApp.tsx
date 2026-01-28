import { useEffect, useMemo, useState } from "react";
import { useTodos, useUsers } from "~/features/todos/hooks";
import { useToast } from "~/components/toast/ToastContext";
import { useTheme } from "~/hooks/useTheme";

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import TodoStats from "./TodoStats";
import TodoToolbar from "./TodoToolbar";
import TodoPagination from "./TodoPagination";
import { MoonIcon,  SunIcon } from "../Icons";

const PAGE_SIZE = 10;

const CURRENT_USER = {
  id: 999,
  name: "Anh Khoa",
  email: "anhkhoa@local.app",
};

export default function TodoApp({theme, toggleTheme}: {theme: string, toggleTheme: () => void}) {
  const { todos, isLoading, isError, updateTodos } = useTodos();
  const { data: users = [] } = useUsers();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<number | "All">("All");

  const allUsers = useMemo(() => {
    const exists = users.some(u => u.name === CURRENT_USER.name);
    return exists ? users : [CURRENT_USER, ...users];
  }, [users]);

  const filtered = useMemo(() => {
    return todos.filter(t => {
      if (filter === "Active" && t.completed) return false;
      if (filter === "Completed" && !t.completed) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedUser !== "All" && t.userId !== selectedUser) return false;
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
    <div className="
        w-full
        max-w-2xl
        mx-auto
        px-4 py-4 sm:px-6 sm:py-6
        space-y-4 sm:space-y-6 
        relative z-10 
      ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">Todo App</h1>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
                p-2 rounded-full border
                border-violet-800 dark:border-gray-700
                bg-gray-100 text-violet-800
                hover:scale-105
                dark:bg-gray-800 dark:text-gray-100
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition
            "
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <TodoForm
          onAdd={(title) => {
              updateTodos(prev => [
                {
                  id: Date.now(),
                  title,
                  completed: false,
                  userId: CURRENT_USER.id,
                },
                ...prev,
              ])
              showToast("Todo created!", "success");
            }
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
          onToggle={(id) => {
              updateTodos(prev =>
                prev.map(t =>
                  t.id === id ? { ...t, completed: !t.completed } : t
                )
              )
              const todo = todos.find(t => t.id === id);
              showToast(
                todo?.completed ? "Return todo as active!" : "Todo completed!",
                todo?.completed ? "info": "success"
              );
            }
          }
          onDelete={(id) => {
              updateTodos(prev => prev.filter(t => t.id !== id))
              showToast("Todo deleted!", "error");
            }
          }
          onUpdate={(id, title) => {
              updateTodos(prev =>
                prev.map(t =>
                  t.id === id
                    ? { ...t, title, userId: CURRENT_USER.id }
                    : t
                )
              )
              showToast("Todo updated!", "success");
            }
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

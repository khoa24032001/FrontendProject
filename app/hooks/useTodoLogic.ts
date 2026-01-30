import { useEffect, useMemo, useState } from "react";
import { useTodos, useUsers } from "~/features/todos/hooks";
import { CURRENT_USER, PAGE_SIZE } from "~/config";

export function useTodoLogic() {
  const { todos, isLoading, isError, updateTodos } = useTodos();
  const { data: users = [] } = useUsers();
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

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filter, search, selectedUser]);

  // Handle page overflow when deleting items
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const addTodo = (title: string) => {
    updateTodos(prev => [
      {
        id: Date.now(),
        title,
        completed: false,
        userId: CURRENT_USER.id,
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: number) => {
    updateTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id: number) => {
    updateTodos(prev => prev.filter(t => t.id !== id));
  };

  const updateTodo = (id: number, title: string) => {
    updateTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, title, userId: CURRENT_USER.id }
          : t
      )
    );
  };

  return {
    // State
    todos,
    isLoading,
    isError,
    filter,
    search,
    page,
    selectedUser,
    allUsers,
    filtered,
    paginatedTodos,
    totalPages,
    // Actions
    setFilter,
    setSearch,
    setPage,
    setSelectedUser,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  };
}
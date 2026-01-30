import { useToast } from "~/components/toast/ToastContext";
import { useTodoLogic } from "~/hooks/useTodoLogic";

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import TodoStats from "./TodoStats";
import TodoToolbar from "./TodoToolbar";
import TodoPagination from "./TodoPagination";
import { MoonIcon, SunIcon } from "../Icons";

export default function TodoApp({theme, toggleTheme}: {theme: string, toggleTheme: () => void}) {
  const { showToast } = useToast();
  const {
    isLoading,
    isError,
    filter,
    page,
    selectedUser,
    allUsers,
    filtered,
    paginatedTodos,
    totalPages,
    setFilter,
    setSearch,
    setPage,
    setSelectedUser,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  } = useTodoLogic();

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
            addTodo(title);
            showToast("Todo created!", "success");
          }}
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
            const todo = paginatedTodos.find(t => t.id === id);
            toggleTodo(id);
            showToast(
              todo?.completed ? "Return todo as active!" : "Todo completed!",
              todo?.completed ? "info": "success"
            );
          }}
          onDelete={(id) => {
            deleteTodo(id);
            showToast("Todo deleted!", "error");
          }}
          onUpdate={(id, title) => {
            updateTodo(id, title);
            showToast("Todo updated!", "success");
          }}
        />

        <TodoPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
    </div>
  );
}
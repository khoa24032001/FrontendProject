import { useState } from "react";
import type { Todo } from "~/features/todos/types";

interface User {
  id: number;
  name: string;
}

export default function TodoItem({
  todo,
  user,
  onToggle,
  onDelete,
  onUpdate,
}: {
  todo: Todo;
  user?: User;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (id: number, title: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(todo.title);

  const handleSave = () => {
    if (!value.trim()) return;
    onUpdate(todo.id, value);
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => {
        if (!isEditing) onToggle();
      }}
      className="
        flex flex-col gap-2
        sm:flex-row sm:items-center sm:justify-between 
        p-3 rounded-lg border dark:border-gray-800 
        hover:bg-gray-50 dark:hover:bg-gray-900 
        transition cursor-pointer
      "
    >
      <div className="flex flex-col gap-1 flex-1">
        {isEditing ? (
          <input
            autoFocus
            value={value}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setValue(todo.title);
                setIsEditing(false);
              }
            }}
            className="rounded border px-2 py-1 dark:bg-gray-900"
          />
        ) : (
          <>
            <label
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={onToggle}
              />
              <span
                className={
                  todo.completed
                    ? "line-through text-gray-500"
                    : "font-medium"
                }
              >
                {todo.title}
              </span>
            </label>

            <span className="text-xs text-gray-500">
              by{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {user?.name || "Unknown"}
              </span>
            </span>
          </>
        )}
      </div>

      <div
        className="flex items-center gap-3 sm:ml-2"
        onClick={(e) => e.stopPropagation()}
      >
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 text-sm hover:underline cursor-pointer"
          >
            Edit
          </button>
        )}

        {isEditing && (
          <button
            onClick={handleSave}
            className="text-green-600 text-sm hover:underline cursor-pointer"
          >
            Save
          </button>
        )}

        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-600 text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

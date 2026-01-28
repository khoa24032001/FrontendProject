import { useState } from "react";

export default function TodoForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <form
      className="flex flex-col sm:flex-row gap-2"
      onSubmit={e => {
        e.preventDefault();
        if (!value.trim()) return;
        onAdd(value);
        setValue("");
      }}
    >
      <input
        className="flex-1 rounded-lg border px-3 py-2 dark:bg-gray-900"
        placeholder="Add new todo..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black cursor-pointer">
        Add
      </button>
    </form>
  );
}

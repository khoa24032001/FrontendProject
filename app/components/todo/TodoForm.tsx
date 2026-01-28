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
        className="
        flex-1 rounded-lg border px-3 py-2 border-gray-300
        bg-slate-50 focus:bg-white dark:focus:bg-gray-900 text-gray-900
        dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
        focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-white
        "
        placeholder="Add new todo..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button className="
        w-full sm:w-auto px-4 py-2 rounded-lg
        bg-purple-600 text-white font-semibold
        dark:bg-white dark:text-black
        hover:opacity-80 transition
        cursor-pointer
      ">
        Add
      </button>
    </form>
  );
}

export default function TodoToolbar({
  filter,
  users,
  selectedUser,
  onUserChange,
  onFilterChange,
  onSearch,
}: {
  filter: string;
  users: { id: number; name: string }[];
  selectedUser: number | "all";
  onUserChange: (v: number | "all") => void;
  onFilterChange: (v: any) => void;
  onSearch: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <div className="flex gap-2">
        {["all", "active", "completed"].map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-3 py-1 rounded-lg border ${
              filter === f ? "bg-black text-white dark:bg-white dark:text-black" : ""
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <select
        value={selectedUser}
        onChange={(e) =>
          onUserChange(e.target.value === "all" ? "all" : Number(e.target.value))
        }
        className="rounded-lg border px-3 py-1 dark:bg-gray-900"
      >
        <option value="all">All users</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <input
        placeholder="Search..."
        onChange={e => onSearch(e.target.value)}
        className="rounded-lg border px-3 py-1 dark:bg-gray-900"
      />
    </div>
  );
}

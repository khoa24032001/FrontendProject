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
  selectedUser: number | "All";
  onUserChange: (v: number | "All") => void;
  onFilterChange: (v: any) => void;
  onSearch: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3
      md:flex-row md:items-center md:justify-between">
      <div className="flex gap-2 justify-start">
        {["All", "Active", "Completed"].map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-3 py-1 rounded-lg border cursor-pointer ${
              filter === f ? "bg-black text-white dark:bg-white dark:text-black" : ""
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <select
          value={selectedUser}
          onChange={(e) =>
            onUserChange(e.target.value === "All" ? "All" : Number(e.target.value))
          }
          className="rounded-lg border px-3 py-1 dark:bg-gray-900 md:w-40 cursor-pointer"
        >
          <option value="all">All users</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <input
          placeholder="Search..."
          onChange={e => onSearch(e.target.value)}
          className="rounded-lg border px-3 py-1 dark:bg-gray-900 sm:w-full md:w-48"
        />
      </div>
    </div>
  );
}

export default function TodoPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-4 text-sm sm:text-base">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-2 sm:px-4 sm:py-2 rounded border
        bg-white dark:bg-gray-900
        border-gray-300 dark:border-gray-700
        hover:bg-gray-100 dark:hover:bg-gray-800
        disabled:opacity-40 transition"
      >
        Prev
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-2 sm:px-4 sm:py-2 rounded border
        bg-white dark:bg-gray-900
        border-gray-300 dark:border-gray-700
        hover:bg-gray-100 dark:hover:bg-gray-800
        disabled:opacity-40 transition"
      >
        Next
      </button>
    </div>
  );
}

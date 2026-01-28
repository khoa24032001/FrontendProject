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
        className="px-3 py-2 sm:px-4 sm:py-2 rounded border disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm text-gray-500">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-2 sm:px-4 sm:py-2 rounded border disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

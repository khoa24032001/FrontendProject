import type { Toast } from "./toast";

export default function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            min-w-[220px] max-w-sm px-4 py-3 rounded-lg shadow-lg
            text-sm font-medium text-white
            animate-slide-in
            ${
              t.type === "success"
                ? "bg-green-600"
                : t.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }
          `}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
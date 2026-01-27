import { useQuery, useQueryClient } from "react-query";
import { fetchTodos } from "./api";
import type {Todo} from "./types";
import { useLocalStorage } from "~/hooks/useLocalStorage";

export function useTodos() {
  const queryClient = useQueryClient();
  const [localTodos, setLocalTodos] = useLocalStorage<Todo[]>("todos", []);

  const query = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    enabled: localTodos.length === 0,
    onSuccess: (data) => setLocalTodos(data),
  });

  const todos = localTodos.length ? localTodos : query.data ?? [];

  const updateTodos = (updater: (prev: Todo[]) => Todo[]) => {
    setLocalTodos(prev => {
      const next = updater(prev);
      queryClient.setQueryData(["todos"], next);
      return next;
    });
  };

  return { ...query, todos, updateTodos };
}

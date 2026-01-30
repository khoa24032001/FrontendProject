import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { fetchTodos, fetchUsers } from "./api";
import type {Todo} from "./types";
import { useLocalStorage } from "~/hooks/useLocalStorage";

export function useTodos() {
  const queryClient = useQueryClient();
  const [localTodos, setLocalTodos] = useLocalStorage<Todo[]>("todos", []);

  const query = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    enabled: localTodos.length === 0,
  });

  useEffect(() => {
    if (query.data && localTodos.length === 0) {
      setLocalTodos(query.data);
    }
  }, [query.data, localTodos.length, setLocalTodos]);

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

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });
}
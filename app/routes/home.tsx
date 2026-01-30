import TodoList from "~/welcome/welcome";
import type { Route } from "./+types/home";
import { QueryClientProvider,QueryClient } from "react-query";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo App" },
    { name: "description", content: "React Challenge" },
  ];
}
const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}

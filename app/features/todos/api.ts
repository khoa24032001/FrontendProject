import axios from "axios";
import type {Todo} from "./types";

const client = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await client.get("/todos");
  return res.data.slice(0, 200);
};

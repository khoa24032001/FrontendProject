import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch (err) {
      console.warn("Failed to read localStorage", err);
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("Failed to write localStorage", err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
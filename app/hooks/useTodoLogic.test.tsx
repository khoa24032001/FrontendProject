import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useTodoLogic } from './useTodoLogic';
import * as todosHooks from '~/features/todos/hooks';
import type { Todo } from '~/features/todos/types';

// Mock the hooks module
jest.mock('~/features/todos/hooks');

const mockTodos: Todo[] = [
  { id: 1, title: 'First todo', completed: false, userId: 1 },
  { id: 2, title: 'Second todo', completed: true, userId: 2 },
  { id: 3, title: 'Third todo', completed: false, userId: 1 },
  { id: 4, title: 'Fourth todo', completed: true, userId: 1 },
  { id: 5, title: 'Fifth todo', completed: false, userId: 2 },
];

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTodoLogic', () => {
  let mockUpdateTodos: jest.Mock;

  beforeEach(() => {
    mockUpdateTodos = jest.fn((updater) => {
      if (typeof updater === 'function') {
        updater(mockTodos);
      }
    });

    (todosHooks.useTodos as jest.Mock).mockReturnValue({
      todos: mockTodos,
      isLoading: false,
      isError: false,
      updateTodos: mockUpdateTodos,
    });

    (todosHooks.useUsers as jest.Mock).mockReturnValue({
      data: mockUsers,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filter).toBe('All');
    expect(result.current.search).toBe('');
    expect(result.current.page).toBe(1);
    expect(result.current.selectedUser).toBe('All');
  });

  it('should return all todos when filter is "All"', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filtered).toHaveLength(5);
  });

  it('should filter active todos', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setFilter('Active');
    });

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.filtered.every(t => !t.completed)).toBe(true);
  });

  it('should filter completed todos', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setFilter('Completed');
    });

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.filtered.every(t => t.completed)).toBe(true);
  });

  it('should filter by search text', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSearch('first');
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].title).toBe('First todo');
  });

  it('should filter by user', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSelectedUser(1);
    });

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.filtered.every(t => t.userId === 1)).toBe(true);
  });

  it('should combine multiple filters', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setFilter('Active');
      result.current.setSelectedUser(1);
    });

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.filtered.every(t => !t.completed && t.userId === 1)).toBe(true);
  });

  it('should paginate todos correctly', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    // All 5 todos, page size is 10, so all should be on page 1
    expect(result.current.paginatedTodos).toHaveLength(5);
  });

  it('should calculate total pages correctly', () => {
    // Mock more todos to test pagination
    const manyTodos = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Todo ${i + 1}`,
      completed: false,
      userId: 1,
    }));

    (todosHooks.useTodos as jest.Mock).mockReturnValue({
      todos: manyTodos,
      isLoading: false,
      isError: false,
      updateTodos: mockUpdateTodos,
    });

    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    expect(result.current.totalPages).toBe(3); // 25 todos / 10 per page = 3 pages
  });

  it('should reset page to 1 when filter changes', async () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    // First, change filter to something that won't trigger reset
    act(() => {
      result.current.setFilter('All');
    });

    // Wait for effects to settle
    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });

    // Now set page to 2
    act(() => {
      result.current.setPage(2);
    });

    // Wait for page to actually be 1 
    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });

    // Now change filter - this should reset page to 1
    act(() => {
      result.current.setFilter('Completed');
    });

    // Page should be reset to 1
    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });
  });

  it('should reset page to 1 when search changes', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPage(2);
    });

    act(() => {
      result.current.setSearch('test');
    });

    expect(result.current.page).toBe(1);
  });

  it('should add a new todo', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.addTodo('New todo');
    });

    expect(mockUpdateTodos).toHaveBeenCalled();
  });

  it('should toggle a todo', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.toggleTodo(1);
    });

    expect(mockUpdateTodos).toHaveBeenCalled();
  });

  it('should delete a todo', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.deleteTodo(1);
    });

    expect(mockUpdateTodos).toHaveBeenCalled();
  });

  it('should update a todo title', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateTodo(1, 'Updated title');
    });

    expect(mockUpdateTodos).toHaveBeenCalled();
  });

  it('should include current user in allUsers', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    expect(result.current.allUsers.length).toBeGreaterThanOrEqual(2);
    expect(result.current.allUsers.some(u => u.name === 'Anh Khoa')).toBe(true);
  });

  it('should handle loading state', () => {
    (todosHooks.useTodos as jest.Mock).mockReturnValue({
      todos: [],
      isLoading: true,
      isError: false,
      updateTodos: mockUpdateTodos,
    });

    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state', () => {
    (todosHooks.useTodos as jest.Mock).mockReturnValue({
      todos: [],
      isLoading: false,
      isError: true,
      updateTodos: mockUpdateTodos,
    });

    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isError).toBe(true);
  });

  it('should search case-insensitively', () => {
    const { result } = renderHook(() => useTodoLogic(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSearch('FIRST');
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].title).toBe('First todo');
  });
});
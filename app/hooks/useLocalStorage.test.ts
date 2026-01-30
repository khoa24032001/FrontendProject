import { renderHook, act, waitFor } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value from localStorage when available', () => {
    // Pre-populate localStorage
    localStorage.setItem('test-key', JSON.stringify('stored value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored value');
  });

  it('should update localStorage when value changes', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new value');
    });

    // Wait for useEffect to run
    await waitFor(() => {
      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify('new value'));
    });
  });

  it('should handle complex objects', async () => {
    const initialObject = { name: 'John', age: 30 };
    localStorage.setItem('test-key', JSON.stringify(initialObject));

    const { result } = renderHook(() => useLocalStorage('test-key', { name: '', age: 0 }));

    expect(result.current[0]).toEqual(initialObject);

    const newObject = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](newObject);
    });

    await waitFor(() => {
      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify(newObject));
    });
  });

  it('should handle arrays', () => {
    const initialArray = [1, 2, 3];
    localStorage.setItem('test-key', JSON.stringify(initialArray));

    const { result } = renderHook(() => useLocalStorage('test-key', [] as number[]));

    expect(result.current[0]).toEqual(initialArray);
  });

  it('should use initial value when localStorage has invalid JSON', () => {
    localStorage.setItem('test-key', 'invalid json{');

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
  });

  it('should handle different keys independently', () => {
    localStorage.setItem('key1', JSON.stringify('value1'));
    localStorage.setItem('key2', JSON.stringify('value2'));

    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'default1'));
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'default2'));

    expect(result1.current[0]).toBe('value1');
    expect(result2.current[0]).toBe('value2');
  });

  it('should persist value across re-renders', async () => {
    localStorage.setItem('test-key', JSON.stringify('initial'));

    const { result, rerender } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('initial');

    act(() => {
      result.current[1]('updated');
    });

    rerender();

    expect(result.current[0]).toBe('updated');
  });

  it('should initialize from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('persisted'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('persisted');
  });

  it('should handle boolean values', async () => {
    const { result } = renderHook(() => useLocalStorage('test-bool', false));

    act(() => {
      result.current[1](true);
    });

    await waitFor(() => {
      const stored = localStorage.getItem('test-bool');
      expect(stored).toBe('true');
    });

    expect(result.current[0]).toBe(true);
  });
});
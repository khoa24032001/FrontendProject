import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme } from './useTheme';

const originalMatchMedia = window.matchMedia;

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    // Restore any mocked matchMedia from other tests to avoid leaking preferences
    window.matchMedia = originalMatchMedia;
  });

  it('should default to light theme when no stored preference and system prefers light', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false, // System prefers light
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });
  });

  it('should use stored theme preference', async () => {
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('should use system preference when no stored theme', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true, // System prefers dark mode
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('should add dark class to document when theme is dark', async () => {
    localStorage.setItem('theme', 'dark');

    renderHook(() => useTheme());

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('should remove dark class when theme is light', async () => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.add('dark'); // Start with dark class

    renderHook(() => useTheme());

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('should toggle theme from light to dark', async () => {
    localStorage.setItem('theme', 'light');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('should toggle theme from dark to light', async () => {
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });
  });

  it('should save theme to localStorage when toggled', async () => {
    localStorage.setItem('theme', 'light');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      const stored = localStorage.getItem('theme');
      expect(stored).toBe('dark');
    });
  });

  it('should update document class when theme changes', async () => {
    localStorage.setItem('theme', 'light');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('should persist theme preference across hook instances', async () => {
    const { result: result1 } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result1.current.theme).toBe('light');
    });

    act(() => {
      result1.current.toggleTheme();
    });

    await waitFor(() => {
      expect(result1.current.theme).toBe('dark');
    });

    // Create new instance
    const { result: result2 } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result2.current.theme).toBe('dark');
    });
  });
});
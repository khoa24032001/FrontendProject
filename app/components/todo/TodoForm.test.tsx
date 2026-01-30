import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from './TodoForm';

describe('TodoForm', () => {
  it('should render input and button', () => {
    const mockOnAdd = jest.fn();
    render(<TodoForm onAdd={mockOnAdd} />);

    expect(screen.getByPlaceholderText('Add new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should call onAdd with input value when form is submitted', async () => {
    const user = userEvent.setup();
    const mockOnAdd = jest.fn();
    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add new todo...');
    await user.type(input, 'New todo item');

    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo item');
  });

  it('should clear input after submission', async () => {
    const user = userEvent.setup();
    const mockOnAdd = jest.fn();
    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add new todo...') as HTMLInputElement;
    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(input.value).toBe('');
  });

  it('should not call onAdd when input is empty', async () => {
    const user = userEvent.setup();
    const mockOnAdd = jest.fn();
    render(<TodoForm onAdd={mockOnAdd} />);

    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should not call onAdd when input contains only whitespace', async () => {
    const user = userEvent.setup();
    const mockOnAdd = jest.fn();
    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add new todo...');
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should handle Enter key submission', async () => {
    const user = userEvent.setup();
    const mockOnAdd = jest.fn();
    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add new todo...');
    await user.type(input, 'New todo{Enter}');

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });
});

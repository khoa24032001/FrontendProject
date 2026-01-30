import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';
import type { Todo } from '~/features/todos/types';

const mockTodo: Todo = {
  id: 1,
  title: 'Test todo',
  completed: false,
  userId: 1,
};

const mockUser = {
  id: 1,
  name: 'John Doe',
};

describe('TodoItem', () => {
  it('should render todo title and user name', () => {
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={mockTodo}
        user={mockUser}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={mockTodo}
        user={mockUser}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={mockTodo}
        user={mockUser}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should show completed todo with line-through style', () => {
    const completedTodo = { ...mockTodo, completed: true };
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={completedTodo}
        user={mockUser}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const title = screen.getByText('Test todo');
    expect(title).toHaveClass('line-through');
  });

  it('should enter edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={mockTodo}
        user={mockUser}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    // Should show input field
    const input = screen.getByDisplayValue('Test todo');
    expect(input).toBeInTheDocument();

    // Should show Save button instead of Edit
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('should call onUpdate when Save button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={mockTodo}
        user={mockUser}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    // Enter edit mode
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Change the value
    const input = screen.getByDisplayValue('Test todo');
    await user.clear(input);
    await user.type(input, 'Updated todo');

    // Click save
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'Updated todo');
  });

  it('should save on Enter key press', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={mockTodo}
        user={mockUser}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    // Enter edit mode
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Change the value and press Enter
    const input = screen.getByDisplayValue('Test todo');
    await user.clear(input);
    await user.type(input, 'Updated todo{Enter}');

    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'Updated todo');
  });

  it('should cancel edit on Escape key press', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={mockTodo}
        user={mockUser}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    // Enter edit mode
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Change the value and press Escape
    const input = screen.getByDisplayValue('Test todo');
    await user.clear(input);
    await user.type(input, 'Updated todo{Escape}');

    // Should NOT call onUpdate
    expect(mockOnUpdate).not.toHaveBeenCalled();

    // Should exit edit mode and show original value
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('should display "Unknown" when user is not provided', () => {
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoItem
        todo={mockTodo}
        user={undefined}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});

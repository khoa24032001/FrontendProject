import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from './TodoList';
import type { Todo } from '~/features/todos/types';

const mockTodos: Todo[] = [
  { id: 1, title: 'First todo', completed: false, userId: 1 },
  { id: 2, title: 'Second todo', completed: true, userId: 2 },
  { id: 3, title: 'Third todo', completed: false, userId: 1 },
];

const mockUsers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

describe('TodoList', () => {
  it('should render all todos', () => {
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoList
        todos={mockTodos}
        users={mockUsers}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
    expect(screen.getByText('Third todo')).toBeInTheDocument();
  });

  it('should display empty state when no todos', () => {
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoList
        todos={[]}
        users={mockUsers}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('No todos found.')).toBeInTheDocument();
  });

  it('should call onToggle with correct id when todo is toggled', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoList
        todos={mockTodos}
        users={mockUsers}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]); // Click first todo's checkbox

    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it('should call onDelete with correct id when todo is deleted', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoList
        todos={mockTodos}
        users={mockUsers}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]); // Click first todo's delete button

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should call onUpdate with correct id and title when todo is updated', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoList
        todos={mockTodos}
        users={mockUsers}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    // Enter edit mode for first todo
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Update the title
    const input = screen.getByDisplayValue('First todo');
    await user.clear(input);
    await user.type(input, 'Updated first todo');

    // Save
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'Updated first todo');
  });

  it('should render correct user names for each todo', () => {
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    render(
      <TodoList
        todos={mockTodos}
        users={mockUsers}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getAllByText('John Doe')).toHaveLength(2); // Todo 1 and 3
    expect(screen.getByText('Jane Smith')).toBeInTheDocument(); // Todo 2
  });
});

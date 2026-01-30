import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoPagination from './TodoPagination';

describe('TodoPagination', () => {
  it('should not render when totalPages is 1', () => {
    const mockOnPageChange = jest.fn();
    const { container } = render(
      <TodoPagination page={1} totalPages={1} onPageChange={mockOnPageChange} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render when totalPages is 0', () => {
    const mockOnPageChange = jest.fn();
    const { container } = render(
      <TodoPagination page={1} totalPages={0} onPageChange={mockOnPageChange} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render pagination controls when totalPages > 1', () => {
    const mockOnPageChange = jest.fn();
    render(<TodoPagination page={1} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByText('Page 1 / 5')).toBeInTheDocument();
  });

  it('should disable Prev button on first page', () => {
    const mockOnPageChange = jest.fn();
    render(<TodoPagination page={1} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    expect(prevButton).toBeDisabled();
  });

  it('should disable Next button on last page', () => {
    const mockOnPageChange = jest.fn();
    render(<TodoPagination page={5} totalPages={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should enable both buttons on middle page', () => {
    const mockOnPageChange = jest.fn();
    render(<TodoPagination page={3} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('should call onPageChange with page - 1 when Prev is clicked', async () => {
    const user = userEvent.setup();
    const mockOnPageChange = jest.fn();
    render(<TodoPagination page={3} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    await user.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange with page + 1 when Next is clicked', async () => {
    const user = userEvent.setup();
    const mockOnPageChange = jest.fn();
    render(<TodoPagination page={3} totalPages={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('should display correct page number', () => {
    const mockOnPageChange = jest.fn();
    render(<TodoPagination page={2} totalPages={10} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('Page 2 / 10')).toBeInTheDocument();
  });
});

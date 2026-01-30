import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToastContainer from './ToastContainer';
import type { Toast } from './toast';

const mockToasts: Toast[] = [
  { id: 1, message: 'Success message', type: 'success' },
  { id: 2, message: 'Error message', type: 'error' },
  { id: 3, message: 'Info message', type: 'info' },
];

describe('ToastContainer', () => {
  it('should render all toasts', () => {
    const mockOnClose = jest.fn();
    render(<ToastContainer toasts={mockToasts} onClose={mockOnClose} />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should not render anything when toasts array is empty', () => {
    const mockOnClose = jest.fn();
    const { container } = render(<ToastContainer toasts={[]} onClose={mockOnClose} />);

    // Container should still exist but be empty
    expect(container.querySelector('.fixed')).toBeInTheDocument();
    expect(container.querySelectorAll('[class*="bg-"]')).toHaveLength(0);
  });

  it('should apply correct background color for success toast', () => {
    const successToast: Toast[] = [
      { id: 1, message: 'Success', type: 'success' },
    ];
    const mockOnClose = jest.fn();
    const { container } = render(
      <ToastContainer toasts={successToast} onClose={mockOnClose} />
    );

    const toast = container.querySelector('.bg-green-600');
    expect(toast).toBeInTheDocument();
  });

  it('should apply correct background color for error toast', () => {
    const errorToast: Toast[] = [{ id: 1, message: 'Error', type: 'error' }];
    const mockOnClose = jest.fn();
    const { container } = render(
      <ToastContainer toasts={errorToast} onClose={mockOnClose} />
    );

    const toast = container.querySelector('.bg-red-600');
    expect(toast).toBeInTheDocument();
  });

  it('should apply correct background color for info toast', () => {
    const infoToast: Toast[] = [{ id: 1, message: 'Info', type: 'info' }];
    const mockOnClose = jest.fn();
    const { container } = render(
      <ToastContainer toasts={infoToast} onClose={mockOnClose} />
    );

    const toast = container.querySelector('.bg-blue-600');
    expect(toast).toBeInTheDocument();
  });

  it('should call onClose with correct id when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();
    render(<ToastContainer toasts={mockToasts} onClose={mockOnClose} />);

    const closeButtons = screen.getAllByLabelText('Close toast');
    await user.click(closeButtons[0]); // Close first toast

    expect(mockOnClose).toHaveBeenCalledWith(1);
  });

  it('should have close buttons for all toasts', () => {
    const mockOnClose = jest.fn();
    render(<ToastContainer toasts={mockToasts} onClose={mockOnClose} />);

    const closeButtons = screen.getAllByLabelText('Close toast');
    expect(closeButtons).toHaveLength(3);
  });

  it('should render toasts in correct order', () => {
    const mockOnClose = jest.fn();
    const { container } = render(
      <ToastContainer toasts={mockToasts} onClose={mockOnClose} />
    );

    const toastElements = container.querySelectorAll('[class*="bg-"]');
    expect(toastElements[0]).toHaveTextContent('Success message');
    expect(toastElements[1]).toHaveTextContent('Error message');
    expect(toastElements[2]).toHaveTextContent('Info message');
  });

  it('should have slide-in animation class', () => {
    const mockOnClose = jest.fn();
    const { container } = render(
      <ToastContainer toasts={[mockToasts[0]]} onClose={mockOnClose} />
    );

    const toast = container.querySelector('.animate-slide-in');
    expect(toast).toBeInTheDocument();
  });
});

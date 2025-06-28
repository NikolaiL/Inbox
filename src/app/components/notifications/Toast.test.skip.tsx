import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders a success toast', () => {
    render(<Toast message="Success!" type="success" onDismiss={() => {}} />);
    const toast = screen.getByRole('alert');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Success!');
    expect(toast).toHaveClass('bg-green-500');
  });

  it('renders an error toast', () => {
    render(<Toast message="Error!" type="error" onDismiss={() => {}} />);
    const toast = screen.getByRole('alert');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Error!');
    expect(toast).toHaveClass('bg-red-500');
  });

  it('renders an info toast', () => {
    render(<Toast message="Info" type="info" onDismiss={() => {}} />);
    const toast = screen.getByRole('alert');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Info');
    expect(toast).toHaveClass('bg-blue-500');
  });

  it('calls onDismiss after a timeout', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    render(<Toast message="test" type="info" onDismiss={onDismiss} />);
    jest.advanceTimersByTime(5000);
    expect(onDismiss).toHaveBeenCalled();
    jest.useRealTimers();
  });
}); 
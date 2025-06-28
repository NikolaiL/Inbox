import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationBadge } from './NotificationBadge';

describe('NotificationBadge', () => {
  it('renders without crashing', () => {
    render(<NotificationBadge />);
  });

  it('displays the count when a count is provided', () => {
    render(<NotificationBadge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not display a count when count is 0', () => {
    render(<NotificationBadge count={0} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('displays a dot when hasNotifications is true and no count is provided', () => {
    render(<NotificationBadge hasNotifications />);
    const dot = screen.getByTestId('notification-dot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('absolute w-2 h-2 bg-red-500 rounded-full');
  });

  it('does not display a dot when hasNotifications is false', () => {
    render(<NotificationBadge hasNotifications={false} />);
    expect(screen.queryByTestId('notification-dot')).not.toBeInTheDocument();
  });
}); 
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationDrawer } from './NotificationDrawer';

const mockNotifications = [
  { id: '1', message: 'First notification', read: false },
  { id: '2', message: 'Second notification', read: true },
  { id: '3', message: 'Third notification', read: false },
];

describe('NotificationDrawer', () => {
  it('renders without crashing', () => {
    render(<NotificationDrawer notifications={[]} />);
  });

  it('displays a list of notifications', () => {
    render(<NotificationDrawer notifications={mockNotifications} />);
    expect(screen.getByText('First notification')).toBeInTheDocument();
    expect(screen.getByText('Second notification')).toBeInTheDocument();
    expect(screen.getByText('Third notification')).toBeInTheDocument();
  });

  it('displays an empty state when there are no notifications', () => {
    render(<NotificationDrawer notifications={[]} />);
    expect(screen.getByText('No new notifications')).toBeInTheDocument();
  });

  it('marks unread notifications visually', () => {
    render(<NotificationDrawer notifications={mockNotifications} />);
    const firstNotification = screen.getByText('First notification').closest('li');
    const secondNotification = screen.getByText('Second notification').closest('li');
    expect(firstNotification).not.toHaveClass('opacity-50');
    expect(secondNotification).toHaveClass('opacity-50');
  });

  it('calls onClearAll when the "Clear all" button is clicked', () => {
    const onClearAll = jest.fn();
    render(<NotificationDrawer notifications={mockNotifications} onClearAll={onClearAll} />);
    screen.getByText('Clear all').click();
    expect(onClearAll).toHaveBeenCalled();
  });

  it('calls onNotificationClick when a notification is clicked', () => {
    const onNotificationClick = jest.fn();
    render(<NotificationDrawer notifications={mockNotifications} onNotificationClick={onNotificationClick} />);
    screen.getByText('First notification').click();
    expect(onNotificationClick).toHaveBeenCalledWith('1');

  });
}); 
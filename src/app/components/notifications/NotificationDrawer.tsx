import React from 'react';

export interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationDrawerProps {
  notifications: Notification[];
  onNotificationClick?: (id: string) => void;
  onClearAll?: () => void;
}

export function NotificationDrawer({ notifications, onNotificationClick, onClearAll }: NotificationDrawerProps) {
  return (
    <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.length > 0 && (
          <button onClick={onClearAll} className="text-sm text-blue-600 hover:underline">
            Clear all
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No new notifications
        </div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              onClick={() => onNotificationClick?.(notification.id)}
              className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                notification.read ? 'opacity-50' : ''
              }`}
            >
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
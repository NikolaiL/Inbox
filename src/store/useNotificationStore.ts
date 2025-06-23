import { create } from 'zustand';
import { Notification } from '../app/components/notifications/NotificationDrawer';
import { ToastType } from '../app/components/notifications/Toast';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface NotificationState {
  notifications: Notification[];
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastType) => void;
  dismissToast: (id: number) => void;
  addNotification: (message: string) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

let toastId = 0;

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  toasts: [],
  showToast: (message, type) => {
    const id = toastId++;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  addNotification: (message) => {
    const newNotification: Notification = {
      id: new Date().toISOString(),
      message,
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  clearAllNotifications: () => {
    set({ notifications: [] });
  },
})); 
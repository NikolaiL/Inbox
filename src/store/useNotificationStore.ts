import { create } from 'zustand';

interface NotificationState {
  notifications: string[];
  addNotification: (msg: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (msg) => set((state) => ({ notifications: [...state.notifications, msg] })),
  clearNotifications: () => set({ notifications: [] }),
})); 
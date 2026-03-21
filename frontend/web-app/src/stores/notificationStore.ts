import { create } from 'zustand';
import { getNotifications, markAsRead as apiMarkAsRead, markAllAsRead as apiMarkAllAsRead } from '../services/notificationService';

export interface AppNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  claimId?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const notifications = await getNotifications();
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ loading: false });
    }
  },

  markRead: async (id) => {
    try {
      await apiMarkAsRead(id);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllRead: async () => {
    try {
      await apiMarkAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  addNotification: (n) =>
    set((state) => {
      const newN: AppNotification = {
        ...n,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newN, ...state.notifications];
      return { notifications: updated, unreadCount: updated.filter((x) => !x.read).length };
    }),
}));

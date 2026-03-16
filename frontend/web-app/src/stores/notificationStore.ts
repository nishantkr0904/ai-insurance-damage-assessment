import { create } from 'zustand';

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
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
}

const INITIAL: AppNotification[] = [
  {
    id: 'n1',
    type: 'success',
    title: 'Claim Approved',
    message: 'Your claim CLM-001 has been approved. Settlement is being processed.',
    claimId: 'CLM-001',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'n2',
    type: 'info',
    title: 'Analysis Complete',
    message: 'AI analysis for claim CLM-002 is complete. Review your damage report.',
    claimId: 'CLM-002',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'n3',
    type: 'warning',
    title: 'Fraud Flag Detected',
    message: 'Claim CLM-002 has a medium fraud risk. Manual review may be required.',
    claimId: 'CLM-002',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'n4',
    type: 'info',
    title: 'Claim Submitted',
    message: 'Claim CLM-003 submitted successfully. AI processing has started.',
    claimId: 'CLM-003',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: INITIAL,
  unreadCount: INITIAL.filter((n) => !n.read).length,

  markRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

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

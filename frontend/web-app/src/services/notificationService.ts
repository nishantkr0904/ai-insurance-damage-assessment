import apiClient from './apiClient';

export interface AppNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  claimId?: string;
  read: boolean;  // Match the frontend property name
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: AppNotification[];
  };
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notification: AppNotification;
  };
  message?: string;
}

// Get all notifications for the user
export async function getNotifications(): Promise<AppNotification[]> {
  const { data } = await apiClient.get<NotificationsResponse>('/notifications');
  return data.data.notifications;
}

// Mark specific notification as read
export async function markAsRead(notificationId: string): Promise<AppNotification> {
  const { data } = await apiClient.patch<NotificationResponse>(
    `/notifications/${notificationId}/read`
  );
  return data.data.notification;
}

// Mark all notifications as read
export async function markAllAsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all');
}
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

type ApiNotificationType =
  | 'claim_update'
  | 'report_ready'
  | 'fraud_alert'
  | 'system'
  | AppNotification['type'];

interface ApiNotification {
  id: string;
  type?: ApiNotificationType;
  title?: string;
  message?: string;
  claimId?: string;
  read?: boolean;
  createdAt?: string;
}

function normalizeNotification(notification: ApiNotification): AppNotification {
  const typeMap: Record<ApiNotificationType, AppNotification['type']> = {
    claim_update: 'info',
    report_ready: 'success',
    fraud_alert: 'warning',
    system: 'info',
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
  };

  const rawType = notification.type ?? 'system';
  const type = rawType in typeMap ? typeMap[rawType as ApiNotificationType] : 'info';

  return {
    id: notification.id,
    type,
    title: notification.title ?? 'Notification',
    message: notification.message ?? '',
    claimId: notification.claimId,
    read: notification.read ?? false,
    createdAt: notification.createdAt ?? new Date().toISOString(),
  };
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: ApiNotification[];
  };
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notification: ApiNotification;
  };
  message?: string;
}

// Get all notifications for the user
export async function getNotifications(): Promise<AppNotification[]> {
  const { data } = await apiClient.get<NotificationsResponse>('/notifications');
  return data.data.notifications.map(normalizeNotification);
}

// Mark specific notification as read
export async function markAsRead(notificationId: string): Promise<AppNotification> {
  const { data } = await apiClient.patch<NotificationResponse>(
    `/notifications/${notificationId}/read`
  );
  return normalizeNotification(data.data.notification);
}

// Mark all notifications as read
export async function markAllAsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all');
}
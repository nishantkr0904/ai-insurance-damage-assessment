import { notificationRepository } from '../repositories/index.js';
import type { INotificationDocument } from '../models/index.js';

export const notificationService = {
  async getUserNotifications(
    userId: string,
    options?: { limit?: number; unreadOnly?: boolean }
  ): Promise<INotificationDocument[]> {
    return notificationRepository.findByUserId(userId, options);
  },

  async markAsRead(notificationId: string): Promise<INotificationDocument | null> {
    return notificationRepository.markAsRead(notificationId);
  },

  async markAllAsRead(userId: string): Promise<void> {
    return notificationRepository.markAllAsRead(userId);
  },

  async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.countUnread(userId);
  },
};

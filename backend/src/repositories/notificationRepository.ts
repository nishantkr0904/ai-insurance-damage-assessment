import { Notification, type INotificationDocument } from '../models/index.js';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'claim_update' | 'report_ready' | 'fraud_alert' | 'system';
  claimId?: string;
}

export const notificationRepository = {
  async create(data: CreateNotificationData): Promise<INotificationDocument> {
    const notification = new Notification(data);
    return notification.save();
  },

  async findByUserId(
    userId: string,
    options?: { limit?: number; unreadOnly?: boolean }
  ): Promise<INotificationDocument[]> {
    const query: Record<string, unknown> = { userId };
    if (options?.unreadOnly) {
      query.read = false;
    }

    return Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(options?.limit || 50);
  },

  async markAsRead(id: string): Promise<INotificationDocument | null> {
    return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ userId, read: false }, { read: true });
  },

  async countUnread(userId: string): Promise<number> {
    return Notification.countDocuments({ userId, read: false });
  },

  async delete(id: string): Promise<INotificationDocument | null> {
    return Notification.findByIdAndDelete(id);
  },
};

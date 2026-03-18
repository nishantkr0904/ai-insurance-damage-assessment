import { Response, NextFunction } from 'express';
import { notificationService } from '../services/index.js';
import { sendSuccess } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../types/index.js';

export const notificationController = {
  async getNotifications(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { limit, unreadOnly } = req.query;

      const notifications = await notificationService.getUserNotifications(userId, {
        limit: limit ? parseInt(limit as string, 10) : undefined,
        unreadOnly: unreadOnly === 'true',
      });

      const unreadCount = await notificationService.getUnreadCount(userId);

      sendSuccess(res, { notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationId } = req.params;

      await notificationService.markAsRead(notificationId);
      sendSuccess(res, null, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      await notificationService.markAllAsRead(userId);
      sendSuccess(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  },
};

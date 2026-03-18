import { Router } from 'express';
import { notificationController } from '../controllers/index.js';
import { authenticate } from '../middlewares/index.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/notifications - Get user notifications
router.get('/', notificationController.getNotifications);

// PATCH /api/v1/notifications/:notificationId/read - Mark as read
router.patch('/:notificationId/read', notificationController.markAsRead);

// PATCH /api/v1/notifications/read-all - Mark all as read
router.patch('/read-all', notificationController.markAllAsRead);

export default router;

import { Router } from 'express';
import authRoutes from './authRoutes.js';
import claimRoutes from './claimRoutes.js';
import adminRoutes from './adminRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import { healthController } from '../controllers/index.js';

const router = Router();

// Health check
router.get('/health', healthController.check);

// API routes
router.use('/auth', authRoutes);
router.use('/claims', claimRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

export default router;

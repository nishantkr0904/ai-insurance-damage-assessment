import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { authenticate } from '../middlewares/index.js';
import {
  registerValidation,
  loginValidation,
  validate,
} from '../middlewares/index.js';

const router = Router();

// POST /api/v1/auth/register
router.post(
  '/register',
  registerValidation,
  validate,
  authController.register
);

// POST /api/v1/auth/login
router.post('/login', loginValidation, validate, authController.login);

// GET /api/v1/auth/profile
router.get('/profile', authenticate, authController.getProfile);

export default router;

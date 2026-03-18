import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/index.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../types/index.js';

export const authController = {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      sendCreated(res, null, result.message);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async getProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await authService.getProfile(userId);
      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  },
};

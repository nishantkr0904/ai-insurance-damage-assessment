import { Response, NextFunction } from 'express';
import { claimService, analyticsService } from '../services/index.js';
import { sendSuccess } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../types/index.js';
import type { ClaimStatus } from '../types/index.js';

export const adminController = {
  async getAllClaims(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, limit, skip } = req.query;

      const claims = await claimService.getAllClaims({
        status: status as ClaimStatus | undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      sendSuccess(res, { claims });
    } catch (error) {
      next(error);
    }
  },

  async getClaimById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;

      const claim = await claimService.getClaimById(claimId, undefined, true);
      sendSuccess(res, { claim });
    } catch (error) {
      next(error);
    }
  },

  async approveClaim(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;
      const adminId = req.user!.id;
      const { notes } = req.body;

      const claim = await claimService.approveClaim(claimId, adminId, notes);
      sendSuccess(res, { claim }, 'Claim approved');
    } catch (error) {
      next(error);
    }
  },

  async rejectClaim(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;
      const adminId = req.user!.id;
      const { notes } = req.body;

      const claim = await claimService.rejectClaim(claimId, adminId, notes);
      sendSuccess(res, { claim }, 'Claim rejected');
    } catch (error) {
      next(error);
    }
  },

  async getAnalytics(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const analytics = await analyticsService.getClaimAnalytics();
      sendSuccess(res, analytics);
    } catch (error) {
      next(error);
    }
  },
};

import { Response, NextFunction } from 'express';
import { claimService, uploadService, aiService } from '../services/index.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../types/index.js';

export const claimController = {
  async createClaim(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const files = req.files as Express.Multer.File[];

      // Validate files
      if (!files || files.length === 0) {
        throw new Error('At least one image is required');
      }

      for (const file of files) {
        uploadService.validateFile(file);
      }

      // Generate temporary claim ID for S3 path
      const tempClaimId = `temp_${Date.now()}`;

      // Upload images to S3
      const imageUrls = await uploadService.uploadMultipleImages(files, tempClaimId);

      // Create claim
      const claim = await claimService.createClaim({
        userId,
        vehicleNumber: req.body.vehicle_number,
        vehicleMake: req.body.vehicle_make,
        vehicleModel: req.body.vehicle_model,
        vehicleYear: req.body.vehicle_year
          ? parseInt(req.body.vehicle_year, 10)
          : undefined,
        incidentDescription: req.body.incident_description,
        images: imageUrls,
      });

      sendCreated(res, {
        claimId: claim._id,
        status: claim.status,
      });
    } catch (error) {
      next(error);
    }
  },

  async getClaims(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const claims = await claimService.getUserClaims(userId);

      sendSuccess(res, claims);
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
      const userId = req.user!.id;

      const claim = await claimService.getClaimById(claimId, userId);
      sendSuccess(res, claim);
    } catch (error) {
      next(error);
    }
  },

  async uploadImages(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;
      const userId = req.user!.id;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new Error('At least one image is required');
      }

      for (const file of files) {
        uploadService.validateFile(file);
      }

      const imageUrls = await uploadService.uploadMultipleImages(files, claimId);
      await claimService.addImagesTolaim(claimId, imageUrls, userId);

      sendSuccess(res, null, 'Images uploaded successfully');
    } catch (error) {
      next(error);
    }
  },

  async analyzeDamage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;

      const claim = await aiService.analyzeDamage(claimId);
      sendSuccess(res, {
        damageDetected: claim.damageAnalysis?.damageDetected,
        damageType: claim.damageAnalysis?.damageType,
        severityScore: claim.damageAnalysis?.severityScore,
      });
    } catch (error) {
      next(error);
    }
  },

  async estimateCost(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;

      const claim = await aiService.estimateCost(claimId);
      sendSuccess(res, {
        estimatedRepairCost: claim.costEstimation?.totalEstimate,
      });
    } catch (error) {
      next(error);
    }
  },

  async checkFraud(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;

      const claim = await aiService.checkFraud(claimId);
      sendSuccess(res, {
        fraudScore: claim.fraudCheck?.fraudScore,
        riskLevel: claim.fraudCheck?.riskLevel,
      });
    } catch (error) {
      next(error);
    }
  },

  async generateReport(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;

      const claim = await aiService.generateReport(claimId);
      sendSuccess(res, {
        reportId: claim.reportId,
        reportUrl: claim.reportUrl,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReport(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { claimId } = req.params;
      const userId = req.user!.id;

      const claim = await claimService.getClaimById(claimId, userId);
      sendSuccess(res, {
        reportUrl: claim.reportUrl,
      });
    } catch (error) {
      next(error);
    }
  },
};

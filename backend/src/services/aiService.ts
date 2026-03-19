import { claimRepository, notificationRepository } from '../repositories/index.js';
import {
  damageDetectionClient,
  costEstimationClient,
  fraudDetectionClient,
  reportGenerationClient,
} from '../ai-clients/index.js';
import { ApiError } from '../middlewares/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { IClaimDocument } from '../models/index.js';

export const aiService = {
  async analyzeDamage(claimId: string): Promise<IClaimDocument> {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    if (claim.images.length === 0) {
      throw new ApiError('No images to analyze', 400);
    }

    // Update status to processing
    await claimRepository.updateStatus(claimId, 'processing');

    try {
      // Analyze first image (primary damage image)
      const damageResult = await damageDetectionClient.analyzeDamage(claim.images[0]);

      const updatedClaim = await claimRepository.update(claimId, {
        damageAnalysis: {
          damageDetected: damageResult.damageDetected,
          damageType: damageResult.damageType,
          severityScore: damageResult.severityScore,
          boundingBoxes: damageResult.boundingBoxes,
          confidence: damageResult.confidence,
          analyzedAt: new Date(),
        },
      });

      logger.info(`Damage analysis completed for claim ${claimId}`);
      return updatedClaim!;
    } catch (error) {
      logger.error(`Damage analysis failed for claim ${claimId}:`, error);
      await claimRepository.updateStatus(claimId, 'submitted');
      throw error;
    }
  },

  async estimateCost(claimId: string): Promise<IClaimDocument> {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    if (!claim.damageAnalysis) {
      throw new ApiError('Damage analysis required before cost estimation', 400);
    }

    try {
      const costResult = await costEstimationClient.estimateCost({
        damageType: claim.damageAnalysis.damageType,
        severityScore: claim.damageAnalysis.severityScore,
        vehicleMake: claim.vehicleInfo.make,
        vehicleModel: claim.vehicleInfo.model,
      });

      const updatedClaim = await claimRepository.update(claimId, {
        costEstimation: {
          totalEstimate: costResult.estimatedRepairCost,
          laborCost: costResult.laborCost,
          partsCost: costResult.partsCost,
          paintCost: costResult.paintCost,
          estimatedAt: new Date(),
        },
      });

      logger.info(`Cost estimation completed for claim ${claimId}`);
      return updatedClaim!;
    } catch (error) {
      logger.error(`Cost estimation failed for claim ${claimId}:`, error);
      throw error;
    }
  },

  async checkFraud(claimId: string): Promise<IClaimDocument> {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    try {
      const fraudResult = await fraudDetectionClient.checkFraud({
        imageUrls: claim.images,
        claimId,
      });

      const updatedClaim = await claimRepository.update(claimId, {
        fraudCheck: {
          fraudScore: fraudResult.fraudScore,
          riskLevel: fraudResult.riskLevel,
          flags: fraudResult.flags,
          checkedAt: new Date(),
        },
      });

      // If high fraud risk, create alert notification
      if (fraudResult.riskLevel === 'high') {
        await notificationRepository.create({
          userId: (claim.userId as any)._id?.toString() || claim.userId.toString(),
          title: 'Fraud Alert',
          message: `Your claim ${claimId} has been flagged for review.`,
          type: 'fraud_alert',
          claimId,
        });
      }

      logger.info(`Fraud check completed for claim ${claimId}`);
      return updatedClaim!;
    } catch (error) {
      logger.error(`Fraud check failed for claim ${claimId}:`, error);
      throw error;
    }
  },

  async generateReport(claimId: string): Promise<IClaimDocument> {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    if (!claim.damageAnalysis || !claim.costEstimation || !claim.fraudCheck) {
      throw new ApiError('All analyses must be completed before report generation', 400);
    }

    try {
      const reportResult = await reportGenerationClient.generateReport({
        claimId,
        damageType: claim.damageAnalysis.damageType,
        severityScore: claim.damageAnalysis.severityScore,
        estimatedCost: claim.costEstimation.totalEstimate,
        fraudScore: claim.fraudCheck.fraudScore,
        vehicleInfo: claim.vehicleInfo,
        incidentDescription: claim.incidentDescription,
      });

      const updatedClaim = await claimRepository.update(claimId, {
        reportId: reportResult.reportId,
        reportUrl: reportResult.reportUrl,
        status: 'analyzed',
      });

      // Notify user that report is ready
      await notificationRepository.create({
        userId: (claim.userId as any)._id?.toString() || claim.userId.toString(),
        title: 'Report Ready',
        message: `Your claim report for ${claimId} is ready for review.`,
        type: 'report_ready',
        claimId,
      });

      logger.info(`Report generated for claim ${claimId}`);
      return updatedClaim!;
    } catch (error) {
      logger.error(`Report generation failed for claim ${claimId}:`, error);
      throw error;
    }
  },

  async runFullPipeline(claimId: string): Promise<IClaimDocument> {
    logger.info(`Starting full AI pipeline for claim ${claimId}`);

    // Run damage analysis
    await this.analyzeDamage(claimId);

    // Run cost estimation
    await this.estimateCost(claimId);

    // Run fraud check
    await this.checkFraud(claimId);

    // Generate report
    const finalClaim = await this.generateReport(claimId);

    logger.info(`Full AI pipeline completed for claim ${claimId}`);
    return finalClaim;
  },
};

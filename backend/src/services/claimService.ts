import { claimRepository, notificationRepository } from '../repositories/index.js';
import { ApiError } from '../middlewares/errorHandler.js';
import type { IClaimDocument } from '../models/index.js';
import type { ClaimStatus, IVehicleInfo } from '../types/index.js';

export interface CreateClaimInput {
  userId: string;
  vehicleNumber: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  incidentDescription: string;
  images: string[];
}

export const claimService = {
  async createClaim(data: CreateClaimInput): Promise<IClaimDocument> {
    const vehicleInfo: IVehicleInfo = {
      vehicleNumber: data.vehicleNumber,
      make: data.vehicleMake,
      model: data.vehicleModel,
      year: data.vehicleYear,
    };

    const claim = await claimRepository.create({
      userId: data.userId,
      vehicleInfo,
      incidentDescription: data.incidentDescription,
      images: data.images,
    });

    // Create notification for user
    await notificationRepository.create({
      userId: data.userId,
      title: 'Claim Submitted',
      message: `Your claim ${claim._id} has been submitted successfully and is being processed.`,
      type: 'claim_update',
      claimId: claim._id.toString(),
    });

    return claim;
  },

  async getClaimById(
    claimId: string,
    userId?: string,
    isAdmin = false
  ): Promise<IClaimDocument> {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    // If not admin, verify ownership
    if (!isAdmin && userId && claim.userId.toString() !== userId) {
      throw new ApiError('Not authorized to access this claim', 403);
    }

    return claim;
  },

  async getUserClaims(userId: string): Promise<IClaimDocument[]> {
    return claimRepository.findByUserId(userId);
  },

  async getAllClaims(filters?: {
    status?: ClaimStatus;
    limit?: number;
    skip?: number;
  }): Promise<IClaimDocument[]> {
    return claimRepository.findAll(filters);
  },

  async updateClaimStatus(
    claimId: string,
    status: ClaimStatus,
    _userId: string
  ): Promise<IClaimDocument> {
    const claim = await claimRepository.updateStatus(claimId, status);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    // Notify user of status change
    await notificationRepository.create({
      userId: claim.userId.toString(),
      title: 'Claim Status Updated',
      message: `Your claim ${claimId} status has been updated to: ${status.replace('_', ' ')}`,
      type: 'claim_update',
      claimId,
    });

    return claim;
  },

  async addImagesTolaim(
    claimId: string,
    imageUrls: string[],
    userId: string
  ): Promise<IClaimDocument> {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    if (claim.userId.toString() !== userId) {
      throw new ApiError('Not authorized to update this claim', 403);
    }

    if (claim.status !== 'submitted') {
      throw new ApiError('Cannot add images to a claim that is already processing', 400);
    }

    const updatedClaim = await claimRepository.addImages(claimId, imageUrls);
    if (!updatedClaim) {
      throw new ApiError('Failed to update claim', 500);
    }

    return updatedClaim;
  },

  async approveClaim(
    claimId: string,
    adminId: string,
    notes?: string
  ): Promise<IClaimDocument> {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    const updatedClaim = await claimRepository.update(claimId, {
      status: 'approved',
      adminNotes: notes,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    });

    if (!updatedClaim) {
      throw new ApiError('Failed to approve claim', 500);
    }

    // Notify user
    await notificationRepository.create({
      userId: claim.userId.toString(),
      title: 'Claim Approved',
      message: `Your claim ${claimId} has been approved.`,
      type: 'claim_update',
      claimId,
    });

    return updatedClaim;
  },

  async rejectClaim(
    claimId: string,
    adminId: string,
    notes?: string
  ): Promise<IClaimDocument> {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError('Claim not found', 404);
    }

    const updatedClaim = await claimRepository.update(claimId, {
      status: 'rejected',
      adminNotes: notes,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    });

    if (!updatedClaim) {
      throw new ApiError('Failed to reject claim', 500);
    }

    // Notify user
    await notificationRepository.create({
      userId: claim.userId.toString(),
      title: 'Claim Rejected',
      message: `Your claim ${claimId} has been rejected. ${notes ? 'Reason: ' + notes : ''}`,
      type: 'claim_update',
      claimId,
    });

    return updatedClaim;
  },
};

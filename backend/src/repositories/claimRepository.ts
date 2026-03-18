import { Claim, type IClaimDocument } from '../models/index.js';
import type {
  ClaimStatus,
  IDamageAnalysis,
  ICostEstimation,
  IFraudCheck,
  IVehicleInfo,
} from '../types/index.js';

export interface CreateClaimData {
  userId: string;
  vehicleInfo: IVehicleInfo;
  incidentDescription: string;
  images: string[];
}

export interface UpdateClaimData {
  status?: ClaimStatus;
  damageAnalysis?: IDamageAnalysis;
  costEstimation?: ICostEstimation;
  fraudCheck?: IFraudCheck;
  reportId?: string;
  reportUrl?: string;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export const claimRepository = {
  async create(data: CreateClaimData): Promise<IClaimDocument> {
    const claim = new Claim(data);
    return claim.save();
  },

  async findById(id: string): Promise<IClaimDocument | null> {
    return Claim.findById(id).populate('userId', 'name email');
  },

  async findByUserId(userId: string): Promise<IClaimDocument[]> {
    return Claim.find({ userId }).sort({ createdAt: -1 });
  },

  async findAll(filters?: {
    status?: ClaimStatus;
    limit?: number;
    skip?: number;
  }): Promise<IClaimDocument[]> {
    const query: Record<string, unknown> = {};
    if (filters?.status) {
      query.status = filters.status;
    }

    return Claim.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 100)
      .skip(filters?.skip || 0);
  },

  async update(id: string, data: UpdateClaimData): Promise<IClaimDocument | null> {
    return Claim.findByIdAndUpdate(id, { $set: data }, { new: true });
  },

  async updateStatus(id: string, status: ClaimStatus): Promise<IClaimDocument | null> {
    return Claim.findByIdAndUpdate(id, { status }, { new: true });
  },

  async addImages(id: string, imageUrls: string[]): Promise<IClaimDocument | null> {
    return Claim.findByIdAndUpdate(
      id,
      { $push: { images: { $each: imageUrls } } },
      { new: true }
    );
  },

  async countByStatus(): Promise<Record<ClaimStatus, number>> {
    const result = await Claim.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const counts: Record<string, number> = {
      submitted: 0,
      processing: 0,
      analyzed: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
    };

    result.forEach((item: { _id: string; count: number }) => {
      counts[item._id] = item.count;
    });

    return counts as Record<ClaimStatus, number>;
  },

  async getTotalEstimatedCost(): Promise<number> {
    const result = await Claim.aggregate([
      { $match: { 'costEstimation.totalEstimate': { $exists: true } } },
      { $group: { _id: null, total: { $sum: '$costEstimation.totalEstimate' } } },
    ]);

    return result[0]?.total || 0;
  },

  async countFraudAlerts(): Promise<number> {
    return Claim.countDocuments({
      'fraudCheck.riskLevel': { $in: ['medium', 'high'] },
    });
  },

  async delete(id: string): Promise<IClaimDocument | null> {
    return Claim.findByIdAndDelete(id);
  },
};

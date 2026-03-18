import { claimRepository, userRepository } from '../repositories/index.js';
import type { IClaimAnalytics } from '../types/index.js';

export const analyticsService = {
  async getClaimAnalytics(): Promise<IClaimAnalytics> {
    const statusCounts = await claimRepository.countByStatus();
    const totalEstimatedCost = await claimRepository.getTotalEstimatedCost();
    const fraudAlertsCount = await claimRepository.countFraudAlerts();

    const totalClaims = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    return {
      totalClaims,
      approvedClaims: statusCounts.approved,
      rejectedClaims: statusCounts.rejected,
      pendingClaims:
        statusCounts.submitted +
        statusCounts.processing +
        statusCounts.analyzed +
        statusCounts.under_review,
      averageProcessingTime: 0, // TODO: Calculate from actual data
      totalEstimatedCost,
      fraudAlertsCount,
    };
  },

  async getUserStats(): Promise<{
    totalUsers: number;
    adminCount: number;
    userCount: number;
  }> {
    const totalUsers = await userRepository.countUsers();
    // Simplified - in production, add separate count queries
    return {
      totalUsers,
      adminCount: 1, // Placeholder
      userCount: totalUsers - 1,
    };
  },
};

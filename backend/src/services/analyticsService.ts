import { claimRepository, userRepository } from '../repositories/index.js';
import type { IClaimAnalytics } from '../types/index.js';

export const analyticsService = {
  async getClaimAnalytics(): Promise<IClaimAnalytics> {
    const statusCounts = await claimRepository.countByStatus();
    const totalEstimatedCost = await claimRepository.getTotalEstimatedCost();
    const fraudAlertsCount = await claimRepository.countFraudAlerts();

    const totalClaims = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    // TODO: Calculate from actual claims data
    const claimsOverTime = [
      { date: 'Mon', count: 12 },
      { date: 'Tue', count: 15 },
      { date: 'Wed', count: 8 },
      { date: 'Thu', count: 18 },
      { date: 'Fri', count: 14 },
      { date: 'Sat', count: 6 },
      { date: 'Sun', count: 4 },
    ];

    const damageTypeDistribution = [
      { type: 'Scratch', count: 28 },
      { type: 'Dent', count: 22 },
      { type: 'Crack', count: 15 },
      { type: 'Shatter', count: 8 },
      { type: 'Other', count: 4 },
    ];

    const fraudRiskDistribution = [
      { level: 'Low', count: 45 },
      { level: 'Medium', count: 18 },
      { level: 'High', count: 7 },
    ];

    return {
      totalClaims,
      approvedClaims: statusCounts.approved,
      rejectedClaims: statusCounts.rejected,
      pendingClaims:
        statusCounts.submitted +
        statusCounts.processing +
        statusCounts.analyzed +
        statusCounts.under_review,
      fraudDetected: fraudAlertsCount,
      avgProcessingTime: 0, // TODO: Calculate from actual data
      averageProcessingTime: 0, // Keep for backward compatibility
      totalEstimatedCost,
      fraudAlertsCount,
      claimsOverTime,
      damageTypeDistribution,
      fraudRiskDistribution,
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

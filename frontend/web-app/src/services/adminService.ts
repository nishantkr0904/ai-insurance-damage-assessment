import apiClient from './apiClient';
import type { Claim, AnalyticsData } from '../types';

export interface AdminClaimResponse {
  success: boolean;
  data: {
    claim: Claim;
  };
  message?: string;
}

export interface AdminClaimsResponse {
  success: boolean;
  data: {
    claims: Claim[];
  };
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export interface ApproveRejectPayload {
  adminNotes?: string;
}

// Get all claims (admin view)
export async function getAllClaims(): Promise<Claim[]> {
  const { data } = await apiClient.get<AdminClaimsResponse>('/admin/claims');
  return data.data.claims;
}

// Get specific claim (admin view)
export async function getClaimById(claimId: string): Promise<Claim> {
  const { data } = await apiClient.get<AdminClaimResponse>(`/admin/claims/${claimId}`);
  return data.data.claim;
}

// Approve claim
export async function approveClaim(claimId: string, payload?: ApproveRejectPayload): Promise<Claim> {
  const { data } = await apiClient.patch<AdminClaimResponse>(
    `/admin/claims/${claimId}/approve`,
    payload
  );
  return data.data.claim;
}

// Reject claim
export async function rejectClaim(claimId: string, payload?: ApproveRejectPayload): Promise<Claim> {
  const { data } = await apiClient.patch<AdminClaimResponse>(
    `/admin/claims/${claimId}/reject`,
    payload
  );
  return data.data.claim;
}

// Get analytics data
export async function getAnalytics(): Promise<AnalyticsData> {
  const { data } = await apiClient.get<AnalyticsResponse>('/admin/analytics');
  return data.data;
}
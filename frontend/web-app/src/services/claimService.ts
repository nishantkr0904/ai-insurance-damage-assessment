import apiClient from './apiClient';
import type { Claim, AnalyticsData } from '../types';

export async function fetchClaims(): Promise<Claim[]> {
  const { data } = await apiClient.get('/claims');
  return data;
}

export async function fetchClaimById(id: string): Promise<Claim> {
  const { data } = await apiClient.get(`/claims/${id}`);
  return data;
}

export async function createClaim(vehicleInfo: Claim['vehicleInfo']): Promise<Claim> {
  const { data } = await apiClient.post('/claims', { vehicleInfo });
  return data;
}

export async function uploadClaimImages(claimId: string, files: File[]): Promise<Claim> {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const { data } = await apiClient.post(`/claims/${claimId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateClaimStatus(
  claimId: string,
  status: 'approved' | 'rejected'
): Promise<Claim> {
  const { data } = await apiClient.patch(`/claims/${claimId}/status`, { status });
  return data;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const { data } = await apiClient.get('/analytics');
  return data;
}

export async function downloadReport(claimId: string): Promise<Blob> {
  const { data } = await apiClient.get(`/claims/${claimId}/report`, {
    responseType: 'blob',
  });
  return data;
}

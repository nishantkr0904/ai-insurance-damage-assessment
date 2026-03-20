import apiClient from './apiClient';
import type { Claim, AnalyticsData } from '../types';

export interface ClaimResponse {
  success: boolean;
  data: {
    claim: Claim;
  };
  message?: string;
}

export interface ClaimsResponse {
  success: boolean;
  data: {
    claims: Claim[];
  };
}

export interface CreateClaimPayload {
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  incidentDescription: string;
  images: File[];
}

// Get all user claims
export async function fetchClaims(): Promise<Claim[]> {
  const { data } = await apiClient.get<ClaimsResponse>('/claims');
  return data.data.claims;
}

// Get specific claim by ID
export async function fetchClaimById(id: string): Promise<Claim> {
  const { data } = await apiClient.get<ClaimResponse>(`/claims/${id}`);
  return data.data.claim;
}

// Create new claim with images
export async function createClaim(payload: CreateClaimPayload): Promise<Claim> {
  const formData = new FormData();

  // Add vehicle info fields (backend expects these individual fields)
  formData.append('vehicle_number', payload.vehicleInfo.licensePlate);
  formData.append('vehicle_make', payload.vehicleInfo.make);
  formData.append('vehicle_model', payload.vehicleInfo.model);
  formData.append('vehicle_year', payload.vehicleInfo.year?.toString() || '');
  formData.append('incident_description', payload.incidentDescription);

  // Add images
  payload.images.forEach((image) => {
    formData.append('images', image);
  });

  const { data } = await apiClient.post<ClaimResponse>('/claims', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data.claim;
}

// Upload additional images to existing claim
export async function uploadClaimImages(claimId: string, files: File[]): Promise<Claim> {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const { data } = await apiClient.post<ClaimResponse>(`/claims/${claimId}/upload-images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.claim;
}

// Trigger damage analysis
export async function analyzeDamage(claimId: string): Promise<Claim> {
  const { data } = await apiClient.post<ClaimResponse>(`/claims/${claimId}/analyze-damage`);
  return data.data.claim;
}

// Trigger cost estimation
export async function estimateCost(claimId: string): Promise<Claim> {
  const { data } = await apiClient.post<ClaimResponse>(`/claims/${claimId}/estimate-cost`);
  return data.data.claim;
}

// Trigger fraud check
export async function checkFraud(claimId: string): Promise<Claim> {
  const { data } = await apiClient.post<ClaimResponse>(`/claims/${claimId}/fraud-check`);
  return data.data.claim;
}

// Generate report
export async function generateReport(claimId: string): Promise<Claim> {
  const { data } = await apiClient.post<ClaimResponse>(`/claims/${claimId}/generate-report`);
  return data.data.claim;
}

// Get claim report
export async function getReport(claimId: string): Promise<any> {
  const { data } = await apiClient.get(`/claims/${claimId}/report`);
  return data.data;
}

// Legacy: Update claim status (for admin)
export async function updateClaimStatus(
  claimId: string,
  status: 'approved' | 'rejected'
): Promise<Claim> {
  const { data } = await apiClient.patch(`/claims/${claimId}/status`, { status });
  return data;
}

// Fetch analytics (moved to adminService)
export async function fetchAnalytics(): Promise<AnalyticsData> {
  const { data } = await apiClient.get('/admin/analytics');
  return data.data;
}

// Download report blob
export async function downloadReport(claimId: string): Promise<Blob> {
  const { data } = await apiClient.get(`/claims/${claimId}/report`, {
    responseType: 'blob',
  });
  return data;
}

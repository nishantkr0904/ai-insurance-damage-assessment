export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Claim {
  id: string;
  userId: string;
  status: ClaimStatus;
  images: ClaimImage[];
  vehicleInfo: VehicleInfo;
  damageAnalysis?: DamageAnalysis;
  costEstimation?: CostEstimation;
  fraudDetection?: FraudDetection;
  report?: ClaimReport;
  createdAt: string;
  updatedAt: string;
}

export type ClaimStatus =
  | 'submitted'
  | 'processing'
  | 'analyzed'
  | 'under_review'
  | 'approved'
  | 'rejected';

export interface ClaimImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  uploadedAt: string;
}

export interface VehicleInfo {
  make?: string;
  model?: string;
  year?: number;
  licensePlate: string;
}

export interface DamageRegion {
  id: string;
  type: string;
  severity: 'minor' | 'moderate' | 'severe';
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
}

export interface DamageAnalysis {
  regions: DamageRegion[];
  overallSeverity: 'minor' | 'moderate' | 'severe';
  confidenceScore: number;
  processedAt: string;
}

export interface CostBreakdown {
  parts: number;
  labor: number;
  miscellaneous: number;
}

export interface CostEstimation {
  totalEstimate: number;
  breakdown: CostBreakdown;
  currency: string;
  estimatedAt: string;
}

export interface FraudDetection {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
  analyzedAt: string;
}

export interface ClaimReport {
  summary: string;
  damageDescription: string;
  repairRecommendation: string;
  generatedAt: string;
  pdfUrl?: string;
}

export interface AnalyticsData {
  totalClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  pendingClaims: number;
  fraudDetected: number;
  avgProcessingTime: number;
  claimsOverTime: { date: string; count: number }[];
  damageTypeDistribution: { type: string; count: number }[];
  fraudRiskDistribution: { level: string; count: number }[];
}

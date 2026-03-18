import { Request } from 'express';

// User types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// Claim types
export type ClaimStatus =
  | 'submitted'
  | 'processing'
  | 'analyzed'
  | 'under_review'
  | 'approved'
  | 'rejected';

export interface IVehicleInfo {
  vehicleNumber: string;
  make?: string;
  model?: string;
  year?: number;
}

export interface IDamageAnalysis {
  damageDetected: boolean;
  damageType: string;
  severityScore: number;
  boundingBoxes: IBoundingBox[];
  confidence: number;
  analyzedAt: Date;
}

export interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface ICostEstimation {
  totalEstimate: number;
  laborCost: number;
  partsCost: number;
  paintCost: number;
  estimatedAt: Date;
}

export interface IFraudCheck {
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
  checkedAt: Date;
}

export interface IClaim {
  _id: string;
  userId: string;
  vehicleInfo: IVehicleInfo;
  incidentDescription: string;
  images: string[];
  damageAnalysis?: IDamageAnalysis;
  costEstimation?: ICostEstimation;
  fraudCheck?: IFraudCheck;
  reportId?: string;
  reportUrl?: string;
  status: ClaimStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Request with user
export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
}

// AI Service response types
export interface DamageAnalysisResponse {
  damageDetected: boolean;
  damageType: string;
  severityScore: number;
  boundingBoxes: IBoundingBox[];
  confidence: number;
}

export interface CostEstimationResponse {
  estimatedRepairCost: number;
  laborCost: number;
  partsCost: number;
  paintCost: number;
}

export interface FraudCheckResponse {
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
}

export interface ReportGenerationResponse {
  reportId: string;
  reportUrl: string;
  reportText: string;
}

// Notification types
export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'claim_update' | 'report_ready' | 'fraud_alert' | 'system';
  claimId?: string;
  read: boolean;
  createdAt: Date;
}

// Analytics types
export interface IClaimAnalytics {
  totalClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  pendingClaims: number;
  averageProcessingTime: number;
  totalEstimatedCost: number;
  fraudAlertsCount: number;
}

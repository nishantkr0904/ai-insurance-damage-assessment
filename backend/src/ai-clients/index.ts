import axios, { AxiosError } from 'axios';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import type {
  DamageAnalysisResponse,
  CostEstimationResponse,
  FraudCheckResponse,
  ReportGenerationResponse,
} from '../types/index.js';

const TIMEOUT = 30000; // 30 seconds

async function handleAIServiceError(error: unknown, serviceName: string): Promise<never> {
  if (error instanceof AxiosError) {
    logger.error(`${serviceName} service error:`, error.response?.data || error.message);
    throw new Error(`${serviceName} service unavailable`);
  }
  throw error;
}

export const damageDetectionClient = {
  async analyzeDamage(imageUrl: string): Promise<DamageAnalysisResponse> {
    try {
      logger.info(`Calling damage detection service for image: ${imageUrl}`);

      const response = await axios.post<DamageAnalysisResponse>(
        `${config.aiServices.damageServiceUrl}/analyze-damage`,
        { image_url: imageUrl },
        { timeout: TIMEOUT }
      );

      logger.info('Damage detection completed');
      return response.data;
    } catch (error) {
      return handleAIServiceError(error, 'Damage Detection');
    }
  },
};

export const costEstimationClient = {
  async estimateCost(params: {
    damageType: string;
    severityScore: number;
    vehicleMake?: string;
    vehicleModel?: string;
  }): Promise<CostEstimationResponse> {
    try {
      logger.info('Calling cost estimation service');

      const response = await axios.post<CostEstimationResponse>(
        `${config.aiServices.costServiceUrl}/estimate-cost`,
        {
          damage_type: params.damageType,
          severity_score: params.severityScore,
          vehicle_make: params.vehicleMake,
          vehicle_model: params.vehicleModel,
        },
        { timeout: TIMEOUT }
      );

      logger.info('Cost estimation completed');
      return response.data;
    } catch (error) {
      return handleAIServiceError(error, 'Cost Estimation');
    }
  },
};

export const fraudDetectionClient = {
  async checkFraud(params: {
    imageUrls: string[];
    claimId: string;
  }): Promise<FraudCheckResponse> {
    try {
      logger.info(`Calling fraud detection service for claim: ${params.claimId}`);

      const response = await axios.post<FraudCheckResponse>(
        `${config.aiServices.fraudServiceUrl}/fraud-check`,
        {
          image_urls: params.imageUrls,
          claim_id: params.claimId,
        },
        { timeout: TIMEOUT }
      );

      logger.info('Fraud check completed');
      return response.data;
    } catch (error) {
      return handleAIServiceError(error, 'Fraud Detection');
    }
  },
};

export const reportGenerationClient = {
  async generateReport(params: {
    claimId: string;
    damageType: string;
    severityScore: number;
    estimatedCost: number;
    fraudScore: number;
    vehicleInfo: {
      vehicleNumber: string;
      make?: string;
      model?: string;
    };
    incidentDescription: string;
  }): Promise<ReportGenerationResponse> {
    try {
      logger.info(`Calling report generation service for claim: ${params.claimId}`);

      const response = await axios.post<ReportGenerationResponse>(
        `${config.aiServices.reportServiceUrl}/generate-report`,
        {
          claim_id: params.claimId,
          damage_type: params.damageType,
          severity_score: params.severityScore,
          estimated_cost: params.estimatedCost,
          fraud_score: params.fraudScore,
          vehicle_info: params.vehicleInfo,
          incident_description: params.incidentDescription,
        },
        { timeout: TIMEOUT }
      );

      logger.info('Report generation completed');
      return response.data;
    } catch (error) {
      return handleAIServiceError(error, 'Report Generation');
    }
  },
};

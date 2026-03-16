import type { Claim, AnalyticsData } from '../types';

export const mockClaims: Claim[] = [
  {
    id: 'CLM-001',
    userId: '1',
    status: 'approved',
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100', uploadedAt: '2026-03-10T09:00:00Z' },
    ],
    vehicleInfo: { make: 'Toyota', model: 'Camry', year: 2021, licensePlate: 'ABC-1234' },
    damageAnalysis: {
      regions: [
        { id: 'r1', type: 'Dent', severity: 'moderate', confidence: 0.94, boundingBox: { x: 120, y: 80, width: 200, height: 150 } },
        { id: 'r2', type: 'Scratch', severity: 'minor', confidence: 0.87, boundingBox: { x: 60, y: 200, width: 100, height: 60 } },
      ],
      overallSeverity: 'moderate',
      confidenceScore: 0.91,
      processedAt: '2026-03-10T09:00:32Z',
    },
    costEstimation: { totalEstimate: 2340, breakdown: { parts: 1200, labor: 950, miscellaneous: 190 }, currency: 'USD', estimatedAt: '2026-03-10T09:00:45Z' },
    fraudDetection: { riskScore: 0.12, riskLevel: 'low', flags: [], analyzedAt: '2026-03-10T09:01:00Z' },
    report: { summary: 'Moderate vehicle damage detected on the front-left panel. Two damage regions identified: a dent (94.2% confidence) and a scratch (87.3% confidence).', damageDescription: 'Front-left panel dent approximately 20×15cm, minor scratch on bumper.', repairRecommendation: 'Panel beating and repainting recommended for the dent. Scratch buffing for minor surface damage.', generatedAt: '2026-03-10T09:01:15Z' },
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-12T14:00:00Z',
  },
  {
    id: 'CLM-002',
    userId: '1',
    status: 'under_review',
    images: [
      { id: 'img2', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', uploadedAt: '2026-03-14T11:00:00Z' },
    ],
    vehicleInfo: { make: 'Honda', model: 'Civic', year: 2022, licensePlate: 'XYZ-5678' },
    damageAnalysis: {
      regions: [
        { id: 'r3', type: 'Crack', severity: 'severe', confidence: 0.96, boundingBox: { x: 50, y: 50, width: 300, height: 200 } },
      ],
      overallSeverity: 'severe',
      confidenceScore: 0.96,
      processedAt: '2026-03-14T11:00:28Z',
    },
    costEstimation: { totalEstimate: 5800, breakdown: { parts: 3200, labor: 2100, miscellaneous: 500 }, currency: 'USD', estimatedAt: '2026-03-14T11:00:40Z' },
    fraudDetection: { riskScore: 0.31, riskLevel: 'medium', flags: ['Metadata inconsistency detected'], analyzedAt: '2026-03-14T11:01:00Z' },
    report: { summary: 'Severe windshield crack detected. Immediate replacement advised.', damageDescription: 'Full-width windshield crack requiring complete replacement.', repairRecommendation: 'Windshield replacement with OEM glass.', generatedAt: '2026-03-14T11:01:10Z' },
    createdAt: '2026-03-14T11:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z',
  },
  {
    id: 'CLM-003',
    userId: '1',
    status: 'processing',
    images: [],
    vehicleInfo: { make: 'Ford', model: 'Mustang', year: 2020, licensePlate: 'GT-9900' },
    createdAt: '2026-03-16T08:00:00Z',
    updatedAt: '2026-03-16T08:05:00Z',
  },
];

export const mockAnalytics: AnalyticsData = {
  totalClaims: 1284,
  approvedClaims: 892,
  rejectedClaims: 147,
  pendingClaims: 245,
  fraudDetected: 38,
  avgProcessingTime: 18.4,
  claimsOverTime: [
    { date: 'Oct', count: 95 }, { date: 'Nov', count: 112 }, { date: 'Dec', count: 98 },
    { date: 'Jan', count: 134 }, { date: 'Feb', count: 156 }, { date: 'Mar', count: 189 },
  ],
  damageTypeDistribution: [
    { type: 'Dent', count: 412 }, { type: 'Scratch', count: 298 }, { type: 'Crack', count: 187 },
    { type: 'Broken Part', count: 134 }, { type: 'Other', count: 253 },
  ],
  fraudRiskDistribution: [
    { level: 'Low', count: 1089 }, { level: 'Medium', count: 157 }, { level: 'High', count: 38 },
  ],
};

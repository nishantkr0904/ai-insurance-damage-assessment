import mongoose, { Schema, Document } from 'mongoose';
import type {
  IVehicleInfo,
  IDamageAnalysis,
  ICostEstimation,
  IFraudCheck,
  ClaimStatus,
} from '../types/index.js';

export interface IClaimDocument extends Document {
  userId: mongoose.Types.ObjectId;
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
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const boundingBoxSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    label: { type: String, required: true },
    confidence: { type: Number, required: true },
  },
  { _id: false }
);

const damageAnalysisSchema = new Schema(
  {
    damageDetected: { type: Boolean, required: true },
    damageType: { type: String, required: true },
    severityScore: { type: Number, required: true, min: 0, max: 1 },
    boundingBoxes: [boundingBoxSchema],
    confidence: { type: Number, required: true, min: 0, max: 1 },
    analyzedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const costEstimationSchema = new Schema(
  {
    totalEstimate: { type: Number, required: true },
    laborCost: { type: Number, required: true },
    partsCost: { type: Number, required: true },
    paintCost: { type: Number, default: 0 },
    estimatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const fraudCheckSchema = new Schema(
  {
    fraudScore: { type: Number, required: true, min: 0, max: 1 },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    flags: [{ type: String }],
    checkedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const vehicleInfoSchema = new Schema(
  {
    vehicleNumber: { type: String, required: true },
    make: { type: String },
    model: { type: String },
    year: { type: Number },
  },
  { _id: false }
);

const claimSchema = new Schema<IClaimDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vehicleInfo: {
      type: vehicleInfoSchema,
      required: true,
    },
    incidentDescription: {
      type: String,
      required: [true, 'Incident description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    damageAnalysis: damageAnalysisSchema,
    costEstimation: costEstimationSchema,
    fraudCheck: fraudCheckSchema,
    reportId: { type: String },
    reportUrl: { type: String },
    status: {
      type: String,
      enum: ['submitted', 'processing', 'analyzed', 'under_review', 'approved', 'rejected'],
      default: 'submitted',
      index: true,
    },
    adminNotes: { type: String },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v, ...rest } = ret as Record<string, unknown> & {
          _id: { toString: () => string };
        };
        return { ...rest, id: _id.toString() };
      },
    },
  }
);

// Index for efficient queries
claimSchema.index({ userId: 1, status: 1 });
claimSchema.index({ createdAt: -1 });

export const Claim = mongoose.model<IClaimDocument>('Claim', claimSchema);

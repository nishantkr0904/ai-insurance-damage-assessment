import { Router } from 'express';
import multer from 'multer';
import { claimController } from '../controllers/index.js';
import { authenticate, claimIdValidation, validate } from '../middlewares/index.js';
import { config } from '../config/index.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 10, // Maximum 10 files per request
  },
});

// All routes require authentication
router.use(authenticate);

// POST /api/v1/claims - Create new claim with images
router.post('/', upload.array('images', 10), claimController.createClaim);

// GET /api/v1/claims - Get all user claims
router.get('/', claimController.getClaims);

// GET /api/v1/claims/:claimId - Get specific claim
router.get('/:claimId', claimIdValidation, validate, claimController.getClaimById);

// POST /api/v1/claims/:claimId/upload-images - Upload additional images
router.post(
  '/:claimId/upload-images',
  claimIdValidation,
  validate,
  upload.array('images', 10),
  claimController.uploadImages
);

// POST /api/v1/claims/:claimId/analyze-damage - Trigger damage analysis
router.post(
  '/:claimId/analyze-damage',
  claimIdValidation,
  validate,
  claimController.analyzeDamage
);

// POST /api/v1/claims/:claimId/estimate-cost - Trigger cost estimation
router.post(
  '/:claimId/estimate-cost',
  claimIdValidation,
  validate,
  claimController.estimateCost
);

// POST /api/v1/claims/:claimId/fraud-check - Trigger fraud check
router.post(
  '/:claimId/fraud-check',
  claimIdValidation,
  validate,
  claimController.checkFraud
);

// POST /api/v1/claims/:claimId/generate-report - Generate report
router.post(
  '/:claimId/generate-report',
  claimIdValidation,
  validate,
  claimController.generateReport
);

// GET /api/v1/claims/:claimId/report - Get claim report
router.get(
  '/:claimId/report',
  claimIdValidation,
  validate,
  claimController.getReport
);

export default router;

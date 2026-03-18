import { Router } from 'express';
import { adminController } from '../controllers/index.js';
import {
  authenticate,
  authorizeAdmin,
  claimIdValidation,
  adminNotesValidation,
  validate,
} from '../middlewares/index.js';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorizeAdmin);

// GET /api/v1/admin/claims - Get all claims
router.get('/claims', adminController.getAllClaims);

// GET /api/v1/admin/claims/:claimId - Get specific claim (admin view)
router.get(
  '/claims/:claimId',
  claimIdValidation,
  validate,
  adminController.getClaimById
);

// PATCH /api/v1/admin/claims/:claimId/approve - Approve claim
router.patch(
  '/claims/:claimId/approve',
  claimIdValidation,
  adminNotesValidation,
  validate,
  adminController.approveClaim
);

// PATCH /api/v1/admin/claims/:claimId/reject - Reject claim
router.patch(
  '/claims/:claimId/reject',
  claimIdValidation,
  adminNotesValidation,
  validate,
  adminController.rejectClaim
);

// GET /api/v1/admin/analytics - Get analytics
router.get('/analytics', adminController.getAnalytics);

export default router;

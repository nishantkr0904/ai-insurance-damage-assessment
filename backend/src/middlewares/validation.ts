import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse.js';

// Validation result handler
export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => {
      if ('msg' in err) return err.msg;
      return 'Validation error';
    });
    sendError(res, errorMessages.join(', '), 400);
    return;
  }
  next();
}

// Auth validations
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Claim validations
export const createClaimValidation = [
  body('vehicleNumber')
    .trim()
    .notEmpty()
    .withMessage('Vehicle number is required'),
  body('incidentDescription')
    .trim()
    .notEmpty()
    .withMessage('Incident description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be 10-2000 characters'),
  body('vehicleMake').optional().trim(),
  body('vehicleModel').optional().trim(),
  body('vehicleYear').optional().isInt({ min: 1900, max: 2100 }),
];

export const claimIdValidation = [
  param('claimId')
    .notEmpty()
    .withMessage('Claim ID is required')
    .isMongoId()
    .withMessage('Invalid claim ID format'),
];

// Admin validations
export const adminNotesValidation = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

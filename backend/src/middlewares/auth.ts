import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { sendUnauthorized, sendForbidden } from '../utils/apiResponse.js';
import type { AuthenticatedRequest, IUserPayload } from '../types/index.js';

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'No token provided');
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwt.secret) as IUserPayload;
    req.user = decoded;
    next();
  } catch {
    sendUnauthorized(res, 'Invalid or expired token');
  }
}

export function authorizeAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    sendUnauthorized(res);
    return;
  }

  if (req.user.role !== 'admin') {
    sendForbidden(res, 'Admin access required');
    return;
  }

  next();
}

export function generateToken(payload: IUserPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
}

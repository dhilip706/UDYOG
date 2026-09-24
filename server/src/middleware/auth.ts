import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env, isAuthorizedAdmin } from '../config/env';

export interface AuthUserPayload {
  id: string;
  phoneNumber?: string;
  email?: string;
  displayName?: string;
  role?: 'BENEFICIARY' | 'EMPLOYER' | 'ADMIN' | 'NGO' | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export function generateToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, env.AUTH_SECRET, { expiresIn: '7d' });
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.AUTH_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'INVALID_TOKEN', message: 'Session expired or token invalid.' });
    return;
  }
}

export function requireRole(...allowedRoles: ('BENEFICIARY' | 'EMPLOYER' | 'ADMIN' | 'NGO')[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required.' });
      return;
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: `Access denied. Requires one of [${allowedRoles.join(', ')}] role privileges.`,
      });
      return;
    }

    next();
  };
}

export function requireNgo(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'NGO' && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Access denied. Requires NGO / Community Team privileges.',
    });
    return;
  }

  next();
}

/**
 * Strict Server-Side Admin Authorization Boundary
 * Verifies that the authenticated user's email or phone is present in the server allowlist.
 * Frontend role claims alone are strictly insufficient.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Admin authentication required.' });
    return;
  }

  const isAllowed = isAuthorizedAdmin({
    email: req.user.email,
    phoneNumber: req.user.phoneNumber,
  });

  if (!isAllowed || req.user.role !== 'ADMIN') {
    console.warn(`[Security Alert] Unauthorized administrative access attempt by User ID: ${req.user.id}, Email: ${req.user.email || 'N/A'}, Phone: ${req.user.phoneNumber || 'N/A'}`);
    res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Access denied. Authenticated identity is not in the server-side administrative allowlist.',
    });
    return;
  }

  next();
}

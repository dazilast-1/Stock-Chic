import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, UserRole } from '../types/stock.types';

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Middleware d'authentification JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token d\'accès requis'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'demo-jwt-secret-change-in-production';

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return res.status(403).json({
      success: false,
      error: 'Token invalide ou expiré'
    });
  }
};

// Middleware pour vérifier les rôles
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est gérant
export const requireManager = requireRole(['gerant']);

// Middleware pour vérifier si l'utilisateur est gérant ou vendeur
export const requireVendorOrManager = requireRole(['gerant', 'vendeur']);

// Middleware pour vérifier la propriété de la ressource
export const requireOwnership = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentification requise'
    });
  }

  // Les gérants peuvent accéder à tout
  if (req.user.role === 'gerant') {
    return next();
  }

  // Les vendeurs ne peuvent accéder qu'à leurs propres ressources
  const resourceUserId = req.params.userId || req.body.userId;
  if (resourceUserId && resourceUserId !== req.user.userId) {
    return res.status(403).json({
      success: false,
      error: 'Accès non autorisé à cette ressource'
    });
  }

  next();
};

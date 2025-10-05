import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { supabase } from '../db/supabase';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserPublic, 
  ApiResponse,
  JWTPayload 
} from '../types/stock.types';

const router = express.Router();

// Schémas de validation
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('gerant', 'vendeur').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Route d'inscription
router.post('/register', async (req: express.Request, res: express.Response) => {
  try {
    // Validation des données
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { email, password, role = 'vendeur' }: RegisterRequest = value;

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hacher le mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role
      })
      .select('id, email, role, created_at')
      .single();

    if (insertError) {
      console.error('Erreur lors de la création de l\'utilisateur:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la création de l\'utilisateur'
      });
    }

    // Générer le token JWT
    const jwtSecret = process.env.JWT_SECRET || 'demo-jwt-secret-change-in-production';

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      } as JWTPayload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const response: AuthResponse = {
      token,
      user: newUser as UserPublic
    };

    res.status(201).json({
      success: true,
      data: response,
      message: 'Utilisateur créé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route de connexion
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    // Validation des données
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { email, password }: LoginRequest = value;

    // Récupérer l'utilisateur
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, password_hash, role, created_at')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token JWT
    const jwtSecret = process.env.JWT_SECRET || 'demo-jwt-secret-change-in-production';

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      } as JWTPayload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Retourner la réponse sans le mot de passe
    const { password_hash, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      token,
      user: userWithoutPassword as UserPublic
    };

    res.json({
      success: true,
      data: response,
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour vérifier le token (profil utilisateur)
router.get('/me', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }

    // Récupérer les informations utilisateur
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, created_at')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: user as UserPublic
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour rafraîchir le token
router.post('/refresh', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET non configuré');
    }

    // Générer un nouveau token
    const newToken = jwt.sign(
      {
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role
      } as JWTPayload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      data: { token: newToken },
      message: 'Token rafraîchi avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route de déconnexion (côté client principalement)
router.post('/logout', authenticateToken, (req: express.Request, res: express.Response) => {
  // Dans une implémentation JWT stateless, la déconnexion se fait côté client
  // en supprimant le token du localStorage
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

export default router;

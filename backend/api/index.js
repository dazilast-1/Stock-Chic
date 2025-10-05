// Point d'entrée simple pour Vercel
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Configuration CORS - Accepter les origines de développement et de production
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5177',
    'https://teal-flan-8621ec.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware de sécurité
app.use(helmet());
app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Stock Chic API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Données de démo directement intégrées
const demoUsers = [
  {
    id: '1',
    nom: 'Admin',
    prenom: 'Stock',
    email: 'admin@stockchic.com',
    role: 'gerant',
    telephone: '+33 1 23 45 67 89',
    profile_photo: '/images/admin.jpg'
  }
];

// Route de connexion démo
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@stockchic.com' && password === 'admin123') {
    const user = demoUsers[0];
    const token = 'demo-token-' + Date.now();
    
    res.json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Connexion réussie'
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Identifiants incorrects'
    });
  }
});

// Route profil utilisateur
app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: demoUsers[0]
  });
});

// Route par défaut
app.get('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Export pour Vercel
export default app;
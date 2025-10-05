// Point d'entrée pour Vercel
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Import du serveur Express
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Charger les variables d'environnement
require('dotenv').config();

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

// Routes de démo (mode démo activé)
if (process.env.DEMO_MODE === 'true') {
  // Import des routes de démo
  const demoRoutes = require('../src/routes/demo.routes');
  app.use('/api', demoRoutes);
} else {
  // Import des routes de production
  const authRoutes = require('../src/routes/auth.routes');
  const articleRoutes = require('../src/routes/article.routes');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/articles', articleRoutes);
}

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
module.exports = app;

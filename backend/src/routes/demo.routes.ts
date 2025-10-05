import express from 'express';
import { 
  ApiResponse, 
  AuthResponse, 
  UserPublic, 
  ArticleWithDeclinaisons,
  PaginatedResponse,
  CreateArticleRequest,
  Vente,
  CreateVenteRequest
} from '../types/stock.types';

const router = express.Router();

// Données de démo - Utilisateurs
const demoUsers: UserPublic[] = [
  {
    id: 'demo-user-1',
    email: 'admin@stockchic.com',
    role: 'gerant',
    profile_photo: '/images/profiles/admin.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-2',
    email: 'marie.dupont@stockchic.com',
    role: 'vendeur',
    profile_photo: '/images/profiles/marie.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-3',
    email: 'jean.martin@stockchic.com',
    role: 'vendeur',
    profile_photo: '/images/profiles/jean.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-4',
    email: 'sophie.bernard@stockchic.com',
    role: 'vendeur',
    profile_photo: '/images/profiles/sophie.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-5',
    email: 'admin2@stockchic.com',
    role: 'gerant',
    profile_photo: '/images/profiles/admin2.jpg',
    created_at: new Date().toISOString(),
  }
];

const demoArticles: ArticleWithDeclinaisons[] = [
  {
    id: '1',
    reference: 'TSH-001',
    nom: 'T-shirt Basic Blanc',
    marque: 'Basic Brand',
    collection: 'ETE_2024',
    prix_achat: 15.00,
    prix_vente: 25.00,
    photos: [
      {
        id: '1-1',
        article_id: '1',
        url: '/images/products/tshirt-basic-blanc.jpg',
        alt_text: 'T-shirt Basic Blanc',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '1-1',
        article_id: '1',
        taille: 'S',
        couleur: 'Blanc',
        quantite: 10,
        quantite_min: 5,
        code_barre: '1234567890123',
      },
      {
        id: '1-2',
        article_id: '1',
        taille: 'M',
        couleur: 'Blanc',
        quantite: 15,
        quantite_min: 5,
        code_barre: '1234567890124',
      },
      {
        id: '1-3',
        article_id: '1',
        taille: 'L',
        couleur: 'Blanc',
        quantite: 2,
        quantite_min: 5,
        code_barre: '1234567890125',
      },
    ],
  },
  {
    id: '2',
    reference: 'JEA-001',
    nom: 'Jean Slim Noir',
    marque: 'Denim Co',
    collection: 'HIVER_2024',
    prix_achat: 35.00,
    prix_vente: 65.00,
    photos: [
      {
        id: '2-1',
        article_id: '2',
        url: '/images/products/jean-slim-noir.jpg',
        alt_text: 'Jean Slim Noir',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '2-1',
        article_id: '2',
        taille: 'M',
        couleur: 'Noir',
        quantite: 8,
        quantite_min: 3,
        code_barre: '2234567890123',
      },
      {
        id: '2-2',
        article_id: '2',
        taille: 'L',
        couleur: 'Noir',
        quantite: 1,
        quantite_min: 3,
        code_barre: '2234567890124',
      },
    ],
  },
  {
    id: '3',
    reference: 'ROB-001',
    nom: 'Robe d\'été Fleurie',
    marque: 'SummerStyle',
    collection: 'ETE_2024',
    prix_achat: 28.00,
    prix_vente: 55.00,
    photos: [
      {
        id: '3-1',
        article_id: '3',
        url: '/images/products/robe-ete-fleurie.jpg',
        alt_text: 'Robe d\'été Fleurie',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '3-1',
        article_id: '3',
        taille: 'S',
        couleur: 'Rose',
        quantite: 6,
        quantite_min: 2,
        code_barre: '3234567890123',
      },
      {
        id: '3-2',
        article_id: '3',
        taille: 'M',
        couleur: 'Rose',
        quantite: 9,
        quantite_min: 2,
        code_barre: '3234567890124',
      },
      {
        id: '3-3',
        article_id: '3',
        taille: 'L',
        couleur: 'Bleu',
        quantite: 4,
        quantite_min: 2,
        code_barre: '3234567890125',
      },
    ],
  },
  {
    id: '4',
    reference: 'VES-001',
    nom: 'Veste en Cuir Vintage',
    marque: 'LeatherLux',
    collection: 'AUTOMNE_2024',
    prix_achat: 120.00,
    prix_vente: 220.00,
    photos: [
      {
        id: '4-1',
        article_id: '4',
        url: '/images/products/veste-cuir-vintage.jpg',
        alt_text: 'Veste en Cuir Vintage',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '4-1',
        article_id: '4',
        taille: 'M',
        couleur: 'Brun',
        quantite: 3,
        quantite_min: 1,
        code_barre: '4234567890123',
      },
      {
        id: '4-2',
        article_id: '4',
        taille: 'L',
        couleur: 'Noir',
        quantite: 2,
        quantite_min: 1,
        code_barre: '4234567890124',
      },
    ],
  },
  {
    id: '5',
    reference: 'CHA-001',
    nom: 'Chaussures Sneakers',
    marque: 'SportMax',
    collection: 'ETE_2024',
    prix_achat: 45.00,
    prix_vente: 85.00,
    photos: [
      {
        id: '5-1',
        article_id: '5',
        url: '/images/products/chaussures-sneakers.jpg',
        alt_text: 'Chaussures Sneakers',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '5-1',
        article_id: '5',
        taille: '38',
        couleur: 'Blanc',
        quantite: 8,
        quantite_min: 3,
        code_barre: '5234567890123',
      },
      {
        id: '5-2',
        article_id: '5',
        taille: '39',
        couleur: 'Blanc',
        quantite: 12,
        quantite_min: 3,
        code_barre: '5234567890124',
      },
      {
        id: '5-3',
        article_id: '5',
        taille: '40',
        couleur: 'Noir',
        quantite: 6,
        quantite_min: 3,
        code_barre: '5234567890125',
      },
    ],
  },
  {
    id: '6',
    reference: 'SAC-001',
    nom: 'Sac à Main Élégant',
    marque: 'LuxuryBags',
    collection: 'PRINTEMPS_2025',
    prix_achat: 80.00,
    prix_vente: 150.00,
    photos: [
      {
        id: '6-1',
        article_id: '6',
        url: '/images/products/sac-main-elegant.jpg',
        alt_text: 'Sac à Main Élégant',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '6-1',
        article_id: '6',
        taille: 'Unique',
        couleur: 'Beige',
        quantite: 5,
        quantite_min: 2,
        code_barre: '6234567890123',
      },
      {
        id: '6-2',
        article_id: '6',
        taille: 'Unique',
        couleur: 'Noir',
        quantite: 7,
        quantite_min: 2,
        code_barre: '6234567890124',
      },
    ],
  },
  {
    id: '7',
    reference: 'PUL-001',
    nom: 'Pull en Laine Douce',
    marque: 'WoolComfort',
    collection: 'HIVER_2024',
    prix_achat: 35.00,
    prix_vente: 70.00,
    photos: [
      {
        id: '7-1',
        article_id: '7',
        url: '/images/products/pull-laine-douce.jpg',
        alt_text: 'Pull en Laine Douce',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '7-1',
        article_id: '7',
        taille: 'S',
        couleur: 'Gris',
        quantite: 4,
        quantite_min: 2,
        code_barre: '7234567890123',
      },
      {
        id: '7-2',
        article_id: '7',
        taille: 'M',
        couleur: 'Gris',
        quantite: 8,
        quantite_min: 2,
        code_barre: '7234567890124',
      },
      {
        id: '7-3',
        article_id: '7',
        taille: 'L',
        couleur: 'Bordeaux',
        quantite: 3,
        quantite_min: 2,
        code_barre: '7234567890125',
      },
    ],
  },
  {
    id: '8',
    reference: 'SHO-001',
    nom: 'Short de Sport',
    marque: 'ActiveWear',
    collection: 'ETE_2024',
    prix_achat: 18.00,
    prix_vente: 35.00,
    photos: [
      {
        id: '8-1',
        article_id: '8',
        url: '/images/products/short-sport.jpg',
        alt_text: 'Short de Sport',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '8-1',
        article_id: '8',
        taille: 'S',
        couleur: 'Bleu',
        quantite: 15,
        quantite_min: 5,
        code_barre: '8234567890123',
      },
      {
        id: '8-2',
        article_id: '8',
        taille: 'M',
        couleur: 'Bleu',
        quantite: 20,
        quantite_min: 5,
        code_barre: '8234567890124',
      },
      {
        id: '8-3',
        article_id: '8',
        taille: 'L',
        couleur: 'Noir',
        quantite: 12,
        quantite_min: 5,
        code_barre: '8234567890125',
      },
    ],
  },
  {
    id: '9',
    reference: 'CHE-001',
    nom: 'Chemise Business',
    marque: 'OfficeStyle',
    collection: 'PRINTEMPS_2025',
    prix_achat: 25.00,
    prix_vente: 50.00,
    photos: [
      {
        id: '9-1',
        article_id: '9',
        url: '/images/products/chemise-business.jpg',
        alt_text: 'Chemise Business',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '9-1',
        article_id: '9',
        taille: 'M',
        couleur: 'Blanc',
        quantite: 10,
        quantite_min: 3,
        code_barre: '9234567890123',
      },
      {
        id: '9-2',
        article_id: '9',
        taille: 'L',
        couleur: 'Blanc',
        quantite: 8,
        quantite_min: 3,
        code_barre: '9234567890124',
      },
      {
        id: '9-3',
        article_id: '9',
        taille: 'XL',
        couleur: 'Bleu',
        quantite: 5,
        quantite_min: 3,
        code_barre: '9234567890125',
      },
    ],
  },
  {
    id: '10',
    reference: 'CHA-002',
    nom: 'Chapeau Panama',
    marque: 'SummerHats',
    collection: 'ETE_2024',
    prix_achat: 22.00,
    prix_vente: 45.00,
    photos: [
      {
        id: '10-1',
        article_id: '10',
        url: '/images/products/chapeau-panama.jpg',
        alt_text: 'Chapeau Panama',
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    declinaisons: [
      {
        id: '10-1',
        article_id: '10',
        taille: 'Unique',
        couleur: 'Beige',
        quantite: 6,
        quantite_min: 2,
        code_barre: '10234567890123',
      },
      {
        id: '10-2',
        article_id: '10',
        taille: 'Unique',
        couleur: 'Blanc',
        quantite: 4,
        quantite_min: 2,
        code_barre: '10234567890124',
      },
    ],
  },
];

// Route de connexion démo
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Vérifier les identifiants pour tous les utilisateurs de démo
  const user = demoUsers.find(u => u.email === email);
  
  if (user && (
    (email === 'admin@stockchic.com' && password === 'admin123') ||
    (email === 'marie.dupont@stockchic.com' && password === 'marie123') ||
    (email === 'jean.martin@stockchic.com' && password === 'jean123') ||
    (email === 'sophie.bernard@stockchic.com' && password === 'sophie123') ||
    (email === 'admin2@stockchic.com' && password === 'admin123')
  )) {
    const response: AuthResponse = {
      token: 'demo-jwt-token',
      user: user,
    };
    
    res.json({
      success: true,
      data: response,
      message: 'Connexion réussie (mode démo)',
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Email ou mot de passe incorrect',
    });
  }
});

// Route d'inscription démo
router.post('/auth/register', (req, res) => {
  const { email, password, role = 'vendeur' } = req.body;
  
  const newUser: UserPublic = {
    id: `demo-user-${Date.now()}`,
    email,
    role: role as 'gerant' | 'vendeur',
    created_at: new Date().toISOString(),
  };
  
  const response: AuthResponse = {
    token: 'demo-jwt-token',
    user: newUser,
  };
  
  res.status(201).json({
    success: true,
    data: response,
    message: 'Utilisateur créé avec succès (mode démo)',
  });
});

// Route profil utilisateur démo
router.get('/auth/me', (req, res) => {
  res.json({
    success: true,
    data: demoUsers[0], // Retourner le premier utilisateur par défaut
  });
});

// Route liste des articles démo
router.get('/articles', (req, res) => {
  const { page = 1, limit = 20, search, collection } = req.query;
  
  let filteredArticles = [...demoArticles];
  
  // Filtre par recherche
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredArticles = filteredArticles.filter(article =>
      article.nom.toLowerCase().includes(searchTerm) ||
      article.reference.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filtre par collection
  if (collection) {
    filteredArticles = filteredArticles.filter(article =>
      article.collection === collection
    );
  }
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;
  const paginatedArticles = filteredArticles.slice(offset, offset + limitNum);
  
  const response: PaginatedResponse<ArticleWithDeclinaisons> = {
    data: paginatedArticles,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredArticles.length,
      totalPages: Math.ceil(filteredArticles.length / limitNum),
    },
  };
  
  res.json({
    success: true,
    data: response,
  });
});

// Route détail d'un article démo
router.get('/articles/:id', (req, res) => {
  const { id } = req.params;
  const article = demoArticles.find(a => a.id === id);
  
  if (!article) {
    return res.status(404).json({
      success: false,
      error: 'Article non trouvé',
    });
  }
  
  return res.json({
    success: true,
    data: article,
  });
});

// Route création d'article démo
router.post('/articles', (req, res) => {
  const articleData: CreateArticleRequest = req.body;
  
  const newArticle: ArticleWithDeclinaisons = {
    id: `demo-article-${Date.now()}`,
    reference: articleData.reference,
    nom: articleData.nom,
    marque: articleData.marque,
    collection: articleData.collection,
    prix_achat: articleData.prix_achat,
    prix_vente: articleData.prix_vente,
    created_at: new Date().toISOString(),
    declinaisons: articleData.declinaisons.map((d, index) => ({
      id: `demo-decl-${Date.now()}-${index}`,
      article_id: `demo-article-${Date.now()}`,
      taille: d.taille,
      couleur: d.couleur,
      quantite: d.quantite,
      quantite_min: d.quantite_min,
      code_barre: d.code_barre,
    })),
  };
  
  demoArticles.push(newArticle);
  
  res.status(201).json({
    success: true,
    data: newArticle,
    message: 'Article créé avec succès (mode démo)',
  });
});

// Route mise à jour d'article démo
router.put('/articles/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const articleIndex = demoArticles.findIndex(a => a.id === id);
  
  if (articleIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Article non trouvé',
    });
  }
  
  demoArticles[articleIndex] = {
    ...demoArticles[articleIndex],
    ...updateData,
  };
  
  return res.json({
    success: true,
    data: demoArticles[articleIndex],
    message: 'Article mis à jour avec succès (mode démo)',
  });
});

// Route suppression d'article démo
router.delete('/articles/:id', (req, res) => {
  const { id } = req.params;
  const articleIndex = demoArticles.findIndex(a => a.id === id);
  
  if (articleIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Article non trouvé',
    });
  }
  
  demoArticles.splice(articleIndex, 1);
  
  return res.json({
    success: true,
    message: 'Article supprimé avec succès (mode démo)',
  });
});

// Route alertes de stock démo
router.get('/articles/alerts/stock-bas', (req, res) => {
  const alerts = [];
  
  for (const article of demoArticles) {
    for (const declinaison of article.declinaisons) {
      if (declinaison.quantite <= declinaison.quantite_min) {
        alerts.push({
          article_id: article.id,
          reference: article.reference,
          nom: article.nom,
          marque: article.marque,
          declinaison_id: declinaison.id,
          taille: declinaison.taille,
          couleur: declinaison.couleur,
          quantite: declinaison.quantite,
          quantite_min: declinaison.quantite_min,
          quantite_manquante: declinaison.quantite_min - declinaison.quantite,
        });
      }
    }
  }
  
  res.json({
    success: true,
    data: alerts,
  });
});

// Route statistiques générales
router.get('/stats/overview', (req, res) => {
  const totalArticles = demoArticles.length;
  const totalDeclinaisons = demoArticles.reduce((sum, article) => sum + article.declinaisons.length, 0);
  const totalStock = demoArticles.reduce((sum, article) => 
    sum + article.declinaisons.reduce((declSum, decl) => declSum + decl.quantite, 0), 0
  );
  const stockBas = demoArticles.flatMap(article => 
    article.declinaisons.filter(decl => decl.quantite <= decl.quantite_min)
  ).length;
  
  const valeurStock = demoArticles.reduce((sum, article) => 
    sum + article.declinaisons.reduce((declSum, decl) => 
      declSum + (decl.quantite * article.prix_achat), 0), 0
  );
  
  const stats = {
    totalArticles,
    totalDeclinaisons,
    totalStock,
    stockBas,
    valeurStock: Math.round(valeurStock * 100) / 100,
    articlesParCollection: {
      'ETE_2024': demoArticles.filter(a => a.collection === 'ETE_2024').length,
      'HIVER_2024': demoArticles.filter(a => a.collection === 'HIVER_2024').length,
      'AUTOMNE_2024': demoArticles.filter(a => a.collection === 'AUTOMNE_2024').length,
      'PRINTEMPS_2025': demoArticles.filter(a => a.collection === 'PRINTEMPS_2025').length,
    }
  };
  
  res.json({
    success: true,
    data: stats,
    message: 'Statistiques récupérées (mode démo)',
  });
});

// Route ventes récentes (simulées)
router.get('/sales/recent', (req, res) => {
  const ventesSimulees = [
    {
      id: '1',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
      articles: [
        { nom: 'T-shirt Basic Blanc', quantite: 2, prix: 25.00 },
        { nom: 'Jean Slim Noir', quantite: 1, prix: 65.00 }
      ],
      total: 115.00,
      client: 'Client anonyme'
    },
    {
      id: '2',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // Il y a 5h
      articles: [
        { nom: 'Robe d\'été Fleurie', quantite: 1, prix: 55.00 }
      ],
      total: 55.00,
      client: 'Marie Dubois'
    },
    {
      id: '3',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Il y a 1 jour
      articles: [
        { nom: 'Chaussures Sneakers', quantite: 1, prix: 85.00 },
        { nom: 'Short de Sport', quantite: 2, prix: 35.00 }
      ],
      total: 155.00,
      client: 'Client anonyme'
    }
  ];
  
  res.json({
    success: true,
    data: ventesSimulees,
    message: 'Ventes récentes récupérées (mode démo)',
  });
});

// Route mouvements de stock (simulés)
router.get('/stock/movements', (req, res) => {
  const mouvementsSimules = [
    {
      id: '1',
      date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      type: 'SORTIE_VENTE',
      article: 'T-shirt Basic Blanc',
      declinaison: 'M - Blanc',
      quantite: -2,
      motif: 'Vente client'
    },
    {
      id: '2',
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      type: 'ENTREE',
      article: 'Jean Slim Noir',
      declinaison: 'L - Noir',
      quantite: 5,
      motif: 'Réception commande fournisseur'
    },
    {
      id: '3',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      type: 'AJUSTEMENT',
      article: 'Robe d\'été Fleurie',
      declinaison: 'S - Rose',
      quantite: -1,
      motif: 'Inventaire - écart constaté'
    }
  ];
  
  res.json({
    success: true,
    data: mouvementsSimules,
    message: 'Mouvements de stock récupérés (mode démo)',
  });
});

// Route rapports de vente
router.get('/reports/sales', (req, res) => {
  const { period = 'month' } = req.query;
  
  const rapportsSimules = {
    period,
    totalVentes: 3245.50,
    nombreVentes: 47,
    panierMoyen: 69.05,
    articlesVendus: 89,
    evolution: '+12.5%',
    topArticles: [
      { nom: 'T-shirt Basic Blanc', quantite: 15, chiffre: 375.00 },
      { nom: 'Jean Slim Noir', quantite: 8, chiffre: 520.00 },
      { nom: 'Robe d\'été Fleurie', quantite: 6, chiffre: 330.00 },
      { nom: 'Chaussures Sneakers', quantite: 5, chiffre: 425.00 },
      { nom: 'Short de Sport', quantite: 12, chiffre: 420.00 }
    ],
    ventesParJour: [
      { date: '2024-10-01', montant: 245.50 },
      { date: '2024-10-02', montant: 189.00 },
      { date: '2024-10-03', montant: 312.75 },
      { date: '2024-10-04', montant: 156.25 },
      { date: '2024-10-05', montant: 278.90 }
    ]
  };
  
  res.json({
    success: true,
    data: rapportsSimules,
    message: 'Rapport de ventes récupéré (mode démo)',
  });
});

// ============================================
// ROUTES POUR LES VENTES
// ============================================

// Stockage en mémoire des ventes
let demoVentes: Vente[] = [];
let venteCounter = 1;

// POST /ventes - Créer une nouvelle vente
router.post('/ventes', (req, res) => {
  const venteData: CreateVenteRequest = req.body;
  
  // Validation des données
  if (!venteData.items || venteData.items.length === 0) {
    const response: ApiResponse = {
      success: false,
      error: 'La vente doit contenir au moins un article',
    };
    return res.status(400).json(response);
  }

  // Vérifier la disponibilité du stock et calculer le montant total
  let montantTotal = 0;
  const venteItems = [];
  
  for (const item of venteData.items) {
    const article = demoArticles.find(a => a.id === item.article_id);
    if (!article) {
      const response: ApiResponse = {
        success: false,
        error: `Article ${item.article_id} introuvable`,
      };
      return res.status(404).json(response);
    }

    const declinaison = article.declinaisons.find(d => d.id === item.declinaison_id);
    if (!declinaison) {
      const response: ApiResponse = {
        success: false,
        error: `Déclinaison ${item.declinaison_id} introuvable`,
      };
      return res.status(404).json(response);
    }

    // Vérifier le stock disponible
    if (declinaison.quantite < item.quantite) {
      const response: ApiResponse = {
        success: false,
        error: `Stock insuffisant pour ${article.nom} (${declinaison.taille} - ${declinaison.couleur}). Disponible: ${declinaison.quantite}`,
      };
      return res.status(400).json(response);
    }

    const prixTotal = item.prix_unitaire * item.quantite;
    montantTotal += prixTotal;

    venteItems.push({
      id: `item-${Date.now()}-${Math.random()}`,
      vente_id: '', // Sera défini après
      article_id: item.article_id,
      declinaison_id: item.declinaison_id,
      article_nom: article.nom,
      article_reference: article.reference,
      taille: declinaison.taille,
      couleur: declinaison.couleur,
      quantite: item.quantite,
      prix_unitaire: item.prix_unitaire,
      prix_total: prixTotal,
    });

    // Déduire du stock
    declinaison.quantite -= item.quantite;
  }

  // Calculer le montant rendu
  const montantRendu = Math.max(0, venteData.montant_paye - montantTotal);

  // Créer la vente
  const nouvelleVente: Vente = {
    id: `vente-${Date.now()}`,
    numero_vente: `VTE-${new Date().getFullYear()}-${String(venteCounter++).padStart(6, '0')}`,
    client_nom: venteData.client_nom,
    client_email: venteData.client_email,
    client_telephone: venteData.client_telephone,
    items: venteItems.map(item => ({ ...item, vente_id: `vente-${Date.now()}` })),
    montant_total: montantTotal,
    montant_paye: venteData.montant_paye,
    montant_rendu: montantRendu,
    mode_paiement: venteData.mode_paiement,
    statut: 'VALIDEE',
    notes: venteData.notes,
    vendeur_id: 'demo-user-id',
    created_at: new Date().toISOString(),
  };

  demoVentes.unshift(nouvelleVente);

  const response: ApiResponse<Vente> = {
    success: true,
    data: nouvelleVente,
    message: 'Vente enregistrée avec succès',
  };

  return res.status(201).json(response);
});

// GET /ventes - Récupérer toutes les ventes
router.get('/ventes', (req, res) => {
  const response: ApiResponse<Vente[]> = {
    success: true,
    data: demoVentes,
  };

  return res.json(response);
});

// GET /ventes/:id - Récupérer une vente par ID
router.get('/ventes/:id', (req, res) => {
  const vente = demoVentes.find(v => v.id === req.params.id);

  if (!vente) {
    const response: ApiResponse = {
      success: false,
      error: 'Vente introuvable',
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<Vente> = {
    success: true,
    data: vente,
  };

  return res.json(response);
});

// DELETE /ventes/:id - Annuler une vente
router.delete('/ventes/:id', (req, res) => {
  const venteIndex = demoVentes.findIndex(v => v.id === req.params.id);

  if (venteIndex === -1) {
    const response: ApiResponse = {
      success: false,
      error: 'Vente introuvable',
    };
    return res.status(404).json(response);
  }

  const vente = demoVentes[venteIndex];

  // Remettre le stock
  for (const item of vente.items) {
    const article = demoArticles.find(a => a.id === item.article_id);
    if (article) {
      const declinaison = article.declinaisons.find(d => d.id === item.declinaison_id);
      if (declinaison) {
        declinaison.quantite += item.quantite;
      }
    }
  }

  // Marquer comme annulée
  vente.statut = 'ANNULEE';

  const response: ApiResponse = {
    success: true,
    message: 'Vente annulée avec succès',
  };

  return res.json(response);
});

// Route pour récupérer tous les utilisateurs
router.get('/users', (req, res) => {
  res.json({
    success: true,
    data: demoUsers,
    message: 'Liste des utilisateurs récupérée avec succès',
  });
});

export default router;

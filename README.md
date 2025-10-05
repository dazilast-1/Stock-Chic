# 🛍️ Stock Chic - Application de Gestion de Stock

Une application moderne et professionnelle de gestion de stock pour boutiques indépendantes, développée avec React, TypeScript et Node.js.

![Stock Chic](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178c6)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-339933)

## ✨ Fonctionnalités

### 🏠 **Interface Utilisateur**
- **Page d'accueil moderne** avec témoignages et statistiques
- **Design responsive** adapté à tous les écrans
- **Thèmes sombre/clair** avec transition fluide
- **Multi-langue** (Français/Anglais)
- **Interface intuitive** et professionnelle

### 📊 **Gestion de Stock**
- **Tableau de bord** avec statistiques en temps réel
- **Catalogue produits** avec photos et descriptions
- **Alertes de stock** automatiques
- **Suivi des mouvements** de stock
- **Gestion des déclinaisons** (tailles, couleurs)

### 💰 **Gestion des Ventes**
- **Enregistrement des ventes** en temps réel
- **Historique des ventes** avec détails
- **Statistiques de vente** et rapports
- **Gestion des clients** et commandes

### 👥 **Gestion des Utilisateurs**
- **Authentification sécurisée** avec JWT
- **Gestion des rôles** (Admin, Gérant, Vendeur)
- **Profil utilisateur** avec photos
- **Permissions granulaires**

### 🔧 **Fonctionnalités Avancées**
- **Upload de photos** pour produits et profils
- **Système de notifications** en temps réel
- **Export de données** et rapports
- **Sauvegarde automatique**

## 🚀 Technologies Utilisées

### **Frontend**
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **React Query** pour la gestion des données
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes

### **Backend**
- **Node.js** avec Express
- **TypeScript** pour la sécurité des types
- **Supabase** pour la base de données
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **CORS** pour la sécurité

### **Base de Données**
- **PostgreSQL** via Supabase
- **Row Level Security** pour la sécurité
- **Triggers** pour l'automatisation
- **Fonctions** pour la logique métier

## 📦 Installation

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### **1. Cloner le repository**
```bash
git clone https://github.com/dazilast-1/stock-chic.git
cd stock-chic
```

### **2. Installer les dépendances**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### **3. Configuration**
```bash
# Copier les fichiers d'exemple
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env.local

# Configurer les variables d'environnement
# Voir DEPLOYMENT.md pour plus de détails
```

### **4. Lancer l'application**
```bash
# Backend (port 3001)
cd backend
npm run dev

# Frontend (port 5173)
cd frontend
npm run dev
```

## 🌐 Déploiement

### **Déploiement Automatique**
```bash
# Utiliser le script de déploiement
./simple-deploy.sh
```

### **Déploiement Manuel**
1. **Supabase** - Base de données et authentification
2. **Vercel** - Backend API
3. **Netlify** - Frontend React

Voir `GUIDE-DEPLOIEMENT.md` pour les instructions détaillées.

## 🎯 Utilisation

### **Connexion**
- **Admin :** `admin@stockchic.com` / `admin123`
- **Gérant :** `gerant@stockchic.com` / `gerant123`
- **Vendeur :** `vendeur@stockchic.com` / `vendeur123`

### **Navigation**
- **Tableau de bord** - Vue d'ensemble et statistiques
- **Catalogue** - Gestion des produits
- **Alertes** - Stock bas et notifications
- **Ventes** - Enregistrement et historique
- **Utilisateurs** - Gestion des équipes
- **Paramètres** - Configuration de l'application

## 📱 Captures d'Écran

### **Page d'Accueil**
- Design moderne et professionnel
- Témoignages clients
- Statistiques en temps réel
- Call-to-action clairs

### **Tableau de Bord**
- Statistiques animées
- Graphiques interactifs
- Alertes en temps réel
- Navigation intuitive

### **Catalogue Produits**
- Grille responsive
- Photos haute qualité
- Filtres et recherche
- Gestion des stocks

## 🔒 Sécurité

- **Authentification JWT** sécurisée
- **Row Level Security** sur la base de données
- **Validation** des données côté serveur
- **CORS** configuré correctement
- **Variables d'environnement** pour les secrets

## 📊 Base de Données

### **Tables Principales**
- `users` - Utilisateurs et authentification
- `articles` - Produits et inventaire
- `declinaisons` - Variantes des produits
- `sales` - Ventes et transactions
- `stock_movements` - Mouvements de stock
- `stock_alerts` - Alertes automatiques

### **Sécurité**
- **RLS** activé sur toutes les tables
- **Triggers** pour l'audit trail
- **Fonctions** pour la logique métier
- **Index** pour les performances

## 🛠️ Développement

### **Structure du Projet**
```
stock-chic/
├── backend/          # API Node.js/Express
├── frontend/         # Application React
├── supabase-schema.sql # Schéma de base de données
├── DEPLOYMENT.md     # Guide de déploiement
└── README.md         # Documentation
```

### **Scripts Disponibles**
```bash
# Développement
npm run dev          # Lancer en mode développement
npm run build        # Build de production
npm run migrate      # Migration des données

# Déploiement
./simple-deploy.sh   # Déploiement automatisé
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Dazilast-1**
- GitHub: [@dazilast-1](https://github.com/dazilast-1)

## 🙏 Remerciements

- **Supabase** pour la base de données
- **Vercel** pour l'hébergement backend
- **Netlify** pour l'hébergement frontend
- **Tailwind CSS** pour le design system
- **React** pour l'écosystème frontend

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Vérifier les logs de déploiement

---

**🎉 Stock Chic - Simplifiez la gestion de votre boutique !**
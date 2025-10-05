# 🚀 Guide de Déploiement Stock Chic - Étape par Étape

## 📋 Prérequis (Déjà fait ✅)

- ✅ Projet Supabase créé
- ✅ Schéma SQL exécuté
- ✅ Clés API récupérées

## 🎯 **ÉTAPE 1 : Préparation locale (2 minutes)**

### 1.1 Lancer le script de préparation

```bash
cd /home/dzsec/Documents/Daziano
./simple-deploy.sh
```

**Le script va vous demander :**
- URL de votre projet Supabase
- Clé anon public
- Clé service_role

**Exemple de réponse :**
```
URL: https://abc123def456.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1.2 Vérification

Le script va :
- ✅ Installer les dépendances
- ✅ Configurer les variables d'environnement
- ✅ Migrer les données de démonstration
- ✅ Builder les applications

## 🌐 **ÉTAPE 2 : Déploiement Backend sur Vercel (5 minutes)**

### 2.1 Aller sur Vercel

1. **Ouvrez votre navigateur** et allez sur [vercel.com](https://vercel.com)
2. **Cliquez sur "Sign up"** ou "Log in"
3. **Connectez-vous avec GitHub** (recommandé)

### 2.2 Créer un nouveau projet

1. **Cliquez sur "New Project"**
2. **Importez votre repository** GitHub (Stock Chic)
3. **Configurez le projet :**
   - **Framework Preset :** Other
   - **Root Directory :** `backend`
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`
   - **Install Command :** `npm install`

### 2.3 Variables d'environnement

**Cliquez sur "Environment Variables" et ajoutez :**

```
NODE_ENV = production
SUPABASE_URL = https://votre-projet.supabase.co
SUPABASE_ANON_KEY = votre-anon-key
SUPABASE_SERVICE_ROLE_KEY = votre-service-role-key
JWT_SECRET = votre-jwt-secret-généré
FRONTEND_URL = https://stock-chic-frontend.netlify.app
```

### 2.4 Déployer

1. **Cliquez sur "Deploy"**
2. **Attendez 2-3 minutes** que le déploiement se termine
3. **Notez l'URL** de votre backend (ex: `https://stock-chic-backend.vercel.app`)

## 🎨 **ÉTAPE 3 : Déploiement Frontend sur Netlify (5 minutes)**

### 3.1 Aller sur Netlify

1. **Ouvrez votre navigateur** et allez sur [netlify.com](https://netlify.com)
2. **Cliquez sur "Sign up"** ou "Log in"
3. **Connectez-vous avec GitHub**

### 3.2 Créer un nouveau site

1. **Cliquez sur "New site from Git"**
2. **Choisissez "GitHub"**
3. **Sélectionnez votre repository** Stock Chic

### 3.3 Configuration du build

**Configurez :**
- **Base directory :** `frontend`
- **Build command :** `npm run build`
- **Publish directory :** `dist`

### 3.4 Variables d'environnement

**Cliquez sur "Environment variables" et ajoutez :**

```
VITE_API_URL = https://votre-backend.vercel.app
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY = votre-anon-key
```

### 3.5 Déployer

1. **Cliquez sur "Deploy site"**
2. **Attendez 2-3 minutes**
3. **Notez l'URL** de votre frontend (ex: `https://stock-chic.netlify.app`)

## 🔗 **ÉTAPE 4 : Configuration finale (2 minutes)**

### 4.1 Mettre à jour Vercel

1. **Retournez sur Vercel**
2. **Allez dans Settings > Environment Variables**
3. **Modifiez `FRONTEND_URL`** avec votre URL Netlify

### 4.2 Mettre à jour Netlify

1. **Retournez sur Netlify**
2. **Allez dans Site settings > Environment variables**
3. **Modifiez `VITE_API_URL`** avec votre URL Vercel

### 4.3 Redéployer

1. **Dans Vercel :** Cliquez "Redeploy"
2. **Dans Netlify :** Cliquez "Trigger deploy"

## 🧪 **ÉTAPE 5 : Test de l'application (3 minutes)**

### 5.1 Test du backend

1. **Visitez** `https://votre-backend.vercel.app/api/health`
2. **Vous devriez voir :** `{"success":true,"message":"API fonctionnelle"}`

### 5.2 Test du frontend

1. **Visitez votre site Netlify**
2. **Testez la connexion :**
   - Email : `admin@stockchic.com`
   - Mot de passe : `admin123`
3. **Vérifiez que :**
   - ✅ Le tableau de bord s'affiche
   - ✅ Les statistiques sont visibles
   - ✅ Le catalogue montre les articles
   - ✅ Les alertes de stock fonctionnent

## 🎉 **Félicitations !**

Votre application Stock Chic est maintenant déployée et fonctionnelle !

### 📊 Résumé de votre déploiement

- **Base de données :** Supabase PostgreSQL
- **Backend API :** Vercel (Node.js/Express)
- **Frontend :** Netlify (React/Vite)
- **Authentification :** Supabase Auth
- **Stockage :** Supabase Storage

### 🔧 URLs importantes

- **Frontend :** https://votre-site.netlify.app
- **Backend :** https://votre-backend.vercel.app
- **Supabase Dashboard :** https://app.supabase.com

### 📱 Fonctionnalités disponibles

- ✅ Authentification sécurisée
- ✅ Gestion des articles et stock
- ✅ Tableau de bord avec statistiques
- ✅ Alertes de stock bas
- ✅ Gestion des ventes
- ✅ Interface responsive
- ✅ Thèmes sombre/clair
- ✅ Multi-langue (FR/EN)

## 🚨 **En cas de problème**

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans Vercel correspond à votre URL Netlify
- Vérifiez que `VITE_API_URL` dans Netlify correspond à votre URL Vercel

### Erreur de connexion
- Vérifiez que les clés Supabase sont correctes
- Vérifiez que le schéma SQL a été exécuté

### Erreur de build
- Vérifiez les logs dans Vercel/Netlify
- Vérifiez que toutes les dépendances sont installées

### Support
- Consultez les logs dans les dashboards Vercel et Netlify
- Vérifiez la documentation Supabase
- Testez localement avec les mêmes variables d'environnement

## 🎯 **Prochaines étapes (optionnel)**

1. **Nom de domaine personnalisé**
2. **Configuration SSL**
3. **Monitoring et alertes**
4. **Sauvegardes automatiques**
5. **Mise à jour des dépendances**

---

**🎉 Votre application Stock Chic est maintenant en ligne et prête à être utilisée !**

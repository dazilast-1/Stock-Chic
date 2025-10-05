# 🚀 Guide de Déploiement Stock Chic sur Supabase

## 📋 Prérequis

1. **Compte Supabase** : Créez un compte sur [supabase.com](https://supabase.com)
2. **Node.js** : Version 18 ou supérieure
3. **Git** : Pour la gestion du code

## 🏗️ Étape 1 : Créer un projet Supabase

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Cliquez sur "New Project"
3. Choisissez votre organisation
4. Remplissez les informations :
   - **Name** : `stock-chic`
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche
5. Cliquez sur "Create new project"
6. Attendez que le projet soit créé (2-3 minutes)

## 🗄️ Étape 2 : Configuration de la base de données

1. Dans votre dashboard Supabase, allez dans **SQL Editor**
2. Cliquez sur "New Query"
3. Copiez le contenu du fichier `supabase-schema.sql` et collez-le dans l'éditeur
4. Cliquez sur "Run" pour exécuter le script
5. Vérifiez que toutes les tables ont été créées dans l'onglet **Table Editor**

## 🔑 Étape 3 : Récupération des clés API

1. Dans votre dashboard Supabase, allez dans **Settings** > **API**
2. Copiez les informations suivantes :
   - **Project URL** (ex: `https://your-project.supabase.co`)
   - **anon public** key
   - **service_role** key

## ⚙️ Étape 4 : Configuration des variables d'environnement

1. Créez un fichier `.env` dans le dossier `backend/` :

```bash
# Mode de fonctionnement
NODE_ENV=production
DEMO_MODE=false

# Configuration du serveur
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com

# Configuration Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Configuration de stockage des images
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Configuration CORS
CORS_ORIGINS=https://your-frontend-domain.com
```

## 🔐 Étape 5 : Configuration de l'authentification

1. Dans Supabase, allez dans **Authentication** > **Settings**
2. Configurez les paramètres :
   - **Site URL** : `https://your-frontend-domain.com`
   - **Redirect URLs** : `https://your-frontend-domain.com/dashboard`
3. Désactivez l'inscription publique si nécessaire
4. Configurez les providers (email, Google, etc.)

## 📱 Étape 6 : Configuration du stockage

1. Dans Supabase, allez dans **Storage**
2. Créez un bucket nommé `images`
3. Configurez les politiques :
   - **Public Access** : Lecture seulement
   - **Authenticated Upload** : Téléchargement pour les utilisateurs authentifiés

## 🚀 Étape 7 : Déploiement du Backend

### Option A : Déploiement sur Vercel

1. Installez Vercel CLI :
```bash
npm install -g vercel
```

2. Dans le dossier `backend/`, lancez :
```bash
vercel
```

3. Suivez les instructions pour configurer le projet

### Option B : Déploiement sur Railway

1. Connectez votre repository GitHub à Railway
2. Créez un nouveau projet
3. Configurez les variables d'environnement
4. Déployez automatiquement

### Option C : Déploiement sur DigitalOcean App Platform

1. Créez une nouvelle app sur DigitalOcean
2. Connectez votre repository
3. Configurez les variables d'environnement
4. Déployez

## 🎨 Étape 8 : Déploiement du Frontend

### Option A : Déploiement sur Vercel

1. Dans le dossier `frontend/`, lancez :
```bash
vercel
```

2. Configurez les variables d'environnement :
```bash
VITE_API_URL=https://your-backend-domain.com
```

### Option B : Déploiement sur Netlify

1. Connectez votre repository à Netlify
2. Configurez les variables d'environnement
3. Déployez automatiquement

## 🔧 Étape 9 : Configuration finale

1. **Mise à jour des URLs** : Modifiez les URLs dans :
   - Backend : `FRONTEND_URL`
   - Frontend : `VITE_API_URL`

2. **Test de l'application** :
   - Créez un compte utilisateur
   - Testez les fonctionnalités principales
   - Vérifiez que les données sont sauvegardées

3. **Configuration SSL** : Assurez-vous que votre domaine utilise HTTPS

## 🛠️ Étape 10 : Migration des données (optionnel)

Si vous avez des données de démonstration à migrer :

1. Créez un script de migration dans `backend/scripts/migrate-demo-data.js`
2. Exécutez le script pour insérer les données initiales
3. Vérifiez que toutes les données ont été migrées

## 📊 Étape 11 : Monitoring et maintenance

1. **Monitoring** : Configurez des alertes pour :
   - Erreurs de base de données
   - Temps de réponse de l'API
   - Utilisation du stockage

2. **Sauvegardes** : Configurez des sauvegardes automatiques dans Supabase

3. **Mises à jour** : Planifiez les mises à jour régulières

## 🚨 Résolution de problèmes

### Problèmes courants :

1. **Erreur CORS** :
   - Vérifiez que `FRONTEND_URL` est correctement configuré
   - Assurez-vous que les URLs utilisent HTTPS

2. **Erreur d'authentification** :
   - Vérifiez les clés Supabase
   - Assurez-vous que RLS est correctement configuré

3. **Erreur de base de données** :
   - Vérifiez que le schéma a été correctement appliqué
   - Vérifiez les politiques RLS

4. **Problèmes de stockage** :
   - Vérifiez les politiques de stockage
   - Assurez-vous que le bucket existe

## 📞 Support

En cas de problème :
1. Vérifiez les logs dans Supabase Dashboard
2. Consultez la documentation Supabase
3. Vérifiez les logs de votre plateforme de déploiement

## 🎉 Félicitations !

Votre application Stock Chic est maintenant déployée sur Supabase ! 

N'oubliez pas de :
- Tester toutes les fonctionnalités
- Configurer des sauvegardes
- Mettre en place un monitoring
- Planifier les mises à jour régulières

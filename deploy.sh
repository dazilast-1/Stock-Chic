#!/bin/bash

# =====================================================
# SCRIPT DE DÉPLOIEMENT AUTOMATISÉ STOCK CHIC
# =====================================================

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Déploiement de Stock Chic"
echo "=============================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet Stock Chic"
    exit 1
fi

# Vérifier que Git est configuré
if ! git config --get user.name > /dev/null 2>&1; then
    echo "❌ Erreur: Git n'est pas configuré. Veuillez configurer Git d'abord:"
    echo "   git config --global user.name 'Votre Nom'"
    echo "   git config --global user.email 'votre@email.com'"
    exit 1
fi

# Fonction pour demander confirmation
confirm() {
    read -p "$1 (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "📋 Vérification des prérequis..."

# Vérifier Node.js
if ! command_exists node; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    exit 1
fi

# Vérifier npm
if ! command_exists npm; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Demander les informations Supabase
echo ""
echo "🔑 Configuration Supabase"
echo "=========================="
echo "Veuillez entrer vos informations Supabase :"
echo "(Vous les trouvez dans Settings > API de votre projet Supabase)"

read -p "URL de votre projet Supabase (ex: https://abc123.supabase.co): " SUPABASE_URL
read -p "Clé anon public (commence par eyJ...): " SUPABASE_ANON_KEY
read -p "Clé service_role (commence par eyJ...): " SUPABASE_SERVICE_ROLE_KEY

# Vérifier que les valeurs ne sont pas vides
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Erreur: Toutes les informations Supabase sont requises"
    exit 1
fi

# Générer un JWT secret
JWT_SECRET=$(openssl rand -base64 32)

echo ""
echo "📝 Configuration des variables d'environnement..."

# Créer le fichier .env pour le backend
cat > backend/.env << EOF
NODE_ENV=production
DEMO_MODE=false
PORT=3001
FRONTEND_URL=https://stock-chic-frontend.netlify.app
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET=$JWT_SECRET
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
CORS_ORIGINS=https://stock-chic-frontend.netlify.app
EOF

echo "✅ Fichier .env créé pour le backend"

# Créer le fichier .env.local pour le frontend
cat > frontend/.env.local << EOF
VITE_API_URL=https://stock-chic-backend.vercel.app
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

echo "✅ Fichier .env.local créé pour le frontend"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."

echo "Installation des dépendances du backend..."
cd backend
npm install
cd ..

echo "Installation des dépendances du frontend..."
cd frontend
npm install
cd ..

echo "✅ Dépendances installées"

# Tester la migration des données
echo ""
echo "🗄️ Test de la migration des données..."

cd backend
if npm run migrate; then
    echo "✅ Migration des données réussie"
else
    echo "❌ Erreur lors de la migration des données"
    echo "Vérifiez que votre projet Supabase est correctement configuré"
    exit 1
fi
cd ..

# Build du frontend
echo ""
echo "🏗️ Build du frontend..."
cd frontend
npm run build
cd ..
echo "✅ Frontend buildé"

# Build du backend
echo ""
echo "🏗️ Build du backend..."
cd backend
npm run build
cd ..
echo "✅ Backend buildé"

# Vérifier Git et commit
echo ""
echo "📝 Préparation pour le déploiement..."

if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Aucun changement à commiter"
else
    echo "📋 Changements détectés, ajout au commit..."
    git add .
    git commit -m "🚀 Préparation pour le déploiement Supabase

- Ajout de la configuration Supabase
- Variables d'environnement configurées
- Build des applications"
fi

echo ""
echo "🎉 Préparation terminée !"
echo "=========================="
echo ""
echo "📋 Prochaines étapes manuelles :"
echo ""
echo "1. 🌐 Déploiement du Backend sur Vercel:"
echo "   - Allez sur https://vercel.com"
echo "   - Importez votre repository GitHub"
echo "   - Configurez le dossier 'backend'"
echo "   - Ajoutez ces variables d'environnement :"
echo "     NODE_ENV=production"
echo "     SUPABASE_URL=$SUPABASE_URL"
echo "     SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
echo "     SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
echo "     JWT_SECRET=$JWT_SECRET"
echo "     FRONTEND_URL=https://stock-chic-frontend.netlify.app"
echo ""
echo "2. 🎨 Déploiement du Frontend sur Netlify:"
echo "   - Allez sur https://netlify.com"
echo "   - Importez votre repository GitHub"
echo "   - Configurez le dossier 'frontend'"
echo "   - Ajoutez ces variables d'environnement :"
echo "     VITE_API_URL=https://votre-backend.vercel.app"
echo "     VITE_SUPABASE_URL=$SUPABASE_URL"
echo "     VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
echo ""
echo "3. 🔗 Mise à jour des URLs:"
echo "   - Une fois déployé, mettez à jour FRONTEND_URL dans Vercel"
echo "   - Mettez à jour VITE_API_URL dans Netlify avec l'URL Vercel"
echo ""
echo "4. 🧪 Test final:"
echo "   - Visitez votre site Netlify"
echo "   - Testez la connexion et les fonctionnalités"
echo ""
echo "📞 Support:"
echo "   - Consultez DEPLOYMENT.md pour plus de détails"
echo "   - Vérifiez les logs dans Vercel et Netlify en cas de problème"
echo ""

if confirm "Voulez-vous que je vous aide avec une étape spécifique ?"; then
    echo ""
    echo "Quelle étape voulez-vous que je vous aide à faire ?"
    echo "1. Déploiement Vercel"
    echo "2. Déploiement Netlify"
    echo "3. Configuration des variables d'environnement"
    echo "4. Test de l'application"
    read -p "Choisissez (1-4): " choice
    
    case $choice in
        1)
            echo "🚀 Aide pour Vercel..."
            echo "- Allez sur https://vercel.com"
            echo "- Cliquez 'New Project'"
            echo "- Importez votre repository"
            echo "- Configurez:"
            echo "  * Root Directory: backend"
            echo "  * Build Command: npm run build"
            echo "  * Output Directory: dist"
            ;;
        2)
            echo "🎨 Aide pour Netlify..."
            echo "- Allez sur https://netlify.com"
            echo "- Cliquez 'New site from Git'"
            echo "- Choisissez votre repository"
            echo "- Configurez:"
            echo "  * Base directory: frontend"
            echo "  * Build command: npm run build"
            echo "  * Publish directory: dist"
            ;;
        3)
            echo "⚙️ Variables d'environnement..."
            echo "Backend (Vercel):"
            echo "  NODE_ENV=production"
            echo "  SUPABASE_URL=$SUPABASE_URL"
            echo "  SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
            echo "  SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
            echo "  JWT_SECRET=$JWT_SECRET"
            echo ""
            echo "Frontend (Netlify):"
            echo "  VITE_API_URL=https://votre-backend.vercel.app"
            echo "  VITE_SUPABASE_URL=$SUPABASE_URL"
            echo "  VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
            ;;
        4)
            echo "🧪 Test de l'application..."
            echo "1. Vérifiez que le backend répond: https://votre-backend.vercel.app/api/health"
            echo "2. Visitez votre frontend Netlify"
            echo "3. Testez la connexion avec admin@stockchic.com / admin123"
            echo "4. Vérifiez que les données s'affichent correctement"
            ;;
    esac
fi

echo ""
echo "🎉 Script terminé ! Votre application est prête pour le déploiement."

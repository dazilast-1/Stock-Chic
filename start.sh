#!/bin/bash

# Script de démarrage pour Stock Chic
echo "🚀 Démarrage de Stock Chic..."

# Charger nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installation en cours..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18 && nvm use 18
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Démarrer le backend
echo "🔧 Démarrage du backend..."
cd backend
npm install --silent
npm run dev &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 5

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
cd ../frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Stock Chic est maintenant en cours d'exécution !"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3001"
echo "📋 Health:   http://localhost:3001/health"
echo ""
echo "🎭 Mode démo activé"
echo "👤 Email: admin@stockchic.com"
echo "🔑 Mot de passe: admin123"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Serveurs arrêtés"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait


# 🔧 Configuration Git pour GitHub

## **Option 1 : HTTPS avec Token (Recommandé)**

### 1. Créer un Personal Access Token
1. Allez sur [GitHub.com](https://github.com) → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez "Generate new token (classic)"
3. Nom : `Stock Chic Deploy`
4. Expiration : `90 days`
5. Permissions : cochez `repo` (Full control of private repositories)
6. Cliquez "Generate token"
7. **Copiez le token** (vous ne pourrez plus le voir !)

### 2. Configurer Git
```bash
cd /home/dzsec/Documents/Daziano
git remote set-url origin https://github.com/dazilast-1/stock-chic.git
```

### 3. Push avec le token
```bash
git push -u origin main
# Username: dazilast-1
# Password: [collez votre token ici]
```

## **Option 2 : SSH (Alternative)**

### 1. Générer une clé SSH
```bash
ssh-keygen -t ed25519 -C "votre-email@example.com"
# Appuyez sur Entrée pour accepter l'emplacement par défaut
# Entrez une passphrase ou laissez vide
```

### 2. Ajouter la clé à SSH agent
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 3. Copier la clé publique
```bash
cat ~/.ssh/id_ed25519.pub
```

### 4. Ajouter sur GitHub
1. Allez sur GitHub.com → Settings → SSH and GPG keys
2. Cliquez "New SSH key"
3. Titre : `Stock Chic`
4. Collez la clé publique
5. Cliquez "Add SSH key"

### 5. Tester la connexion
```bash
ssh -T git@github.com
```

### 6. Push
```bash
git push -u origin main
```

## **Option 3 : GitHub CLI (Plus simple)**

### 1. Installer GitHub CLI
```bash
# Sur Ubuntu/Debian
sudo apt install gh

# Ou télécharger depuis https://cli.github.com/
```

### 2. Se connecter
```bash
gh auth login
# Choisir GitHub.com
# Choisir HTTPS
# Authentifier via navigateur
```

### 3. Push
```bash
git push -u origin main
```

## **Vérification**

Une fois le push réussi, vous devriez voir :
```
Enumerating objects: 72, done.
Counting objects: 100% (72/72), done.
Delta compression using up to 8 threads
Compressing objects: 100% (70/70), done.
Writing objects: 100% (72/72), 220.19 KiB | 10.01 MiB/s, done.
Total 72 (delta 15), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (15/15), done.
To https://github.com/dazilast-1/stock-chic.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## **Prochaines étapes**

Une fois sur GitHub, vous pourrez :
1. **Déployer sur Vercel** (Backend)
2. **Déployer sur Netlify** (Frontend)
3. **Configurer Supabase** (Base de données)

Voir `GUIDE-DEPLOIEMENT.md` pour la suite !

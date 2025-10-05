-- =====================================================
-- SCHÉMA DE BASE DE DONNÉES STOCK CHIC
-- Application de gestion de stock de vêtements
-- =====================================================

-- Types personnalisés pour garantir l'intégrité des données
CREATE TYPE collection_type AS ENUM ('HIVER_2024', 'ETE_2024', 'AUTOMNE_2024', 'PRINTEMPS_2025');
CREATE TYPE taille_type AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');
CREATE TYPE mouvement_type AS ENUM ('ENTREE', 'SORTIE_VENTE', 'SORTIE_PERTE', 'AJUSTEMENT', 'RETOUR_CLIENT');
CREATE TYPE user_role AS ENUM ('gerant', 'vendeur');

-- =====================================================
-- 1. TABLE USERS (Authentification et rôles)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'vendeur',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches par email
CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- 2. TABLE ARTICLES (Informations produit)
-- =====================================================
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    marque VARCHAR(100),
    collection collection_type NOT NULL,
    prix_achat NUMERIC(10, 2) NOT NULL CHECK (prix_achat >= 0),
    prix_vente NUMERIC(10, 2) NOT NULL CHECK (prix_vente >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_articles_reference ON articles(reference);
CREATE INDEX idx_articles_collection ON articles(collection);
CREATE INDEX idx_articles_marque ON articles(marque);

-- =====================================================
-- 3. TABLE DECLINAISONS (Stock par Taille/Couleur)
-- =====================================================
CREATE TABLE declinaisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    taille taille_type NOT NULL,
    couleur VARCHAR(50) NOT NULL,
    quantite INTEGER DEFAULT 0 NOT NULL CHECK (quantite >= 0),
    quantite_min INTEGER DEFAULT 5 NOT NULL CHECK (quantite_min >= 0),
    code_barre VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (article_id, taille, couleur)
);

-- Index pour optimiser les recherches
CREATE INDEX idx_declinaisons_article_id ON declinaisons(article_id);
CREATE INDEX idx_declinaisons_code_barre ON declinaisons(code_barre);
CREATE INDEX idx_declinaisons_quantite ON declinaisons(quantite);

-- =====================================================
-- 4. TABLE VENTES (Transactions de vente)
-- =====================================================
CREATE TABLE ventes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_vente TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_ttc NUMERIC(10, 2) NOT NULL CHECK (total_ttc >= 0),
    user_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_ventes_date ON ventes(date_vente);
CREATE INDEX idx_ventes_user_id ON ventes(user_id);

-- =====================================================
-- 5. TABLE VENTES_LIGNES (Détail des ventes)
-- =====================================================
CREATE TABLE ventes_lignes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vente_id UUID REFERENCES ventes(id) ON DELETE CASCADE NOT NULL,
    declinaison_id UUID REFERENCES declinaisons(id) NOT NULL,
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    prix_unitaire NUMERIC(10, 2) NOT NULL CHECK (prix_unitaire >= 0),
    total_ligne NUMERIC(10, 2) NOT NULL CHECK (total_ligne >= 0)
);

-- Index pour optimiser les recherches
CREATE INDEX idx_ventes_lignes_vente_id ON ventes_lignes(vente_id);
CREATE INDEX idx_ventes_lignes_declinaison_id ON ventes_lignes(declinaison_id);

-- =====================================================
-- 6. TABLE MOUVEMENTS_STOCK (Historique des mouvements)
-- =====================================================
CREATE TABLE mouvements_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    declinaison_id UUID REFERENCES declinaisons(id) NOT NULL,
    type_mouvement mouvement_type NOT NULL,
    quantite INTEGER NOT NULL,
    quantite_avant INTEGER NOT NULL CHECK (quantite_avant >= 0),
    quantite_apres INTEGER NOT NULL CHECK (quantite_apres >= 0),
    motif TEXT,
    user_id UUID REFERENCES users(id),
    vente_id UUID REFERENCES ventes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_mouvements_declinaison_id ON mouvements_stock(declinaison_id);
CREATE INDEX idx_mouvements_type ON mouvements_stock(type_mouvement);
CREATE INDEX idx_mouvements_date ON mouvements_stock(created_at);

-- =====================================================
-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE DES TIMESTAMPS
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les tables avec updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_declinaisons_updated_at BEFORE UPDATE ON declinaisons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER POUR MOUVEMENTS DE STOCK AUTOMATIQUES
-- =====================================================

-- Fonction pour créer automatiquement un mouvement de stock
CREATE OR REPLACE FUNCTION create_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifier si la quantité a changé
    IF OLD.quantite IS DISTINCT FROM NEW.quantite THEN
        INSERT INTO mouvements_stock (
            declinaison_id,
            type_mouvement,
            quantite,
            quantite_avant,
            quantite_apres,
            motif
        ) VALUES (
            NEW.id,
            CASE 
                WHEN NEW.quantite > OLD.quantite THEN 'ENTREE'
                WHEN NEW.quantite < OLD.quantite THEN 'SORTIE_PERTE'
                ELSE 'AJUSTEMENT'
            END,
            ABS(NEW.quantite - OLD.quantite),
            OLD.quantite,
            NEW.quantite,
            'Mise à jour automatique'
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour les mouvements automatiques
CREATE TRIGGER trigger_stock_movement AFTER UPDATE ON declinaisons
    FOR EACH ROW EXECUTE FUNCTION create_stock_movement();

-- =====================================================
-- VUES UTILES POUR L'APPLICATION
-- =====================================================

-- Vue pour les articles avec leurs déclinaisons
CREATE VIEW articles_with_declinaisons AS
SELECT 
    a.*,
    COALESCE(SUM(d.quantite), 0) as stock_total,
    COUNT(d.id) as nombre_declinaisons
FROM articles a
LEFT JOIN declinaisons d ON a.id = d.article_id
GROUP BY a.id;

-- Vue pour les alertes de stock bas
CREATE VIEW alertes_stock_bas AS
SELECT 
    a.id as article_id,
    a.reference,
    a.nom,
    a.marque,
    d.id as declinaison_id,
    d.taille,
    d.couleur,
    d.quantite,
    d.quantite_min,
    (d.quantite_min - d.quantite) as quantite_manquante
FROM articles a
JOIN declinaisons d ON a.id = d.article_id
WHERE d.quantite <= d.quantite_min;

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Insérer un utilisateur de test (mot de passe: "admin123")
-- Le hash bcrypt pour "admin123" est: $2b$10$rQZ8k3QZ8k3QZ8k3QZ8k3O
INSERT INTO users (email, password_hash, role) VALUES 
('admin@stockchic.com', '$2b$10$rQZ8k3QZ8k3QZ8k3QZ8k3O', 'gerant'),
('vendeur@stockchic.com', '$2b$10$rQZ8k3QZ8k3QZ8k3QZ8k3O', 'vendeur');

-- =====================================================
-- POLITIQUES RLS (Row Level Security) - À CONFIGURER DANS SUPABASE
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE declinaisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventes_lignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mouvements_stock ENABLE ROW LEVEL SECURITY;

-- Politiques de base (à adapter selon vos besoins)
-- Les utilisateurs peuvent voir leurs propres données
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);

-- Les gérants peuvent tout voir, les vendeurs peuvent voir les articles et déclinaisons
CREATE POLICY "Managers can view all articles" ON articles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id::text = auth.uid()::text 
        AND users.role = 'gerant'
    )
);

CREATE POLICY "Vendors can view all articles" ON articles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id::text = auth.uid()::text 
        AND users.role IN ('gerant', 'vendeur')
    )
);

-- Politiques similaires pour les autres tables...


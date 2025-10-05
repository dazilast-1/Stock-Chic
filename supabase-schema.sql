-- =====================================================
-- SCHÉMA DE BASE DE DONNÉES STOCK CHIC POUR SUPABASE
-- =====================================================

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs (extension de auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nom TEXT,
    prenom TEXT,
    role TEXT CHECK (role IN ('gerant', 'vendeur')) DEFAULT 'vendeur',
    avatar_url TEXT,
    telephone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des collections
CREATE TABLE public.collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    couleur TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles
CREATE TABLE public.articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    prix_achat DECIMAL(10,2),
    prix_vente DECIMAL(10,2) NOT NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des déclinaisons d'articles
CREATE TABLE public.declinaisons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    taille TEXT,
    couleur TEXT,
    quantite INTEGER DEFAULT 0,
    quantite_min INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des photos d'articles
CREATE TABLE public.article_photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des ventes
CREATE TABLE public.ventes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_vente TEXT UNIQUE NOT NULL,
    client_nom TEXT,
    client_telephone TEXT,
    client_email TEXT,
    montant_total DECIMAL(10,2) NOT NULL,
    montant_paye DECIMAL(10,2) NOT NULL,
    methode_paiement TEXT CHECK (methode_paiement IN ('especes', 'carte', 'cheque', 'virement')),
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des détails de ventes
CREATE TABLE public.vente_details (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vente_id UUID REFERENCES public.ventes(id) ON DELETE CASCADE,
    declinaison_id UUID REFERENCES public.declinaisons(id),
    quantite INTEGER NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des mouvements de stock
CREATE TABLE public.stock_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    declinaison_id UUID REFERENCES public.declinaisons(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('entree', 'sortie', 'ajustement')) NOT NULL,
    quantite INTEGER NOT NULL,
    raison TEXT,
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- POLITIQUES DE SÉCURITÉ RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.declinaisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vente_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les collections (lecture pour tous, écriture pour les gérants)
CREATE POLICY "Everyone can view collections" ON public.collections
    FOR SELECT USING (true);

CREATE POLICY "Only managers can modify collections" ON public.collections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'gerant'
        )
    );

-- Politiques pour les articles
CREATE POLICY "Everyone can view articles" ON public.articles
    FOR SELECT USING (true);

CREATE POLICY "Only managers can modify articles" ON public.articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'gerant'
        )
    );

-- Politiques pour les déclinaisons
CREATE POLICY "Everyone can view declinaisons" ON public.declinaisons
    FOR SELECT USING (true);

CREATE POLICY "Only managers can modify declinaisons" ON public.declinaisons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'gerant'
        )
    );

-- Politiques pour les photos d'articles
CREATE POLICY "Everyone can view article photos" ON public.article_photos
    FOR SELECT USING (true);

CREATE POLICY "Only managers can modify article photos" ON public.article_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'gerant'
        )
    );

-- Politiques pour les ventes
CREATE POLICY "Everyone can view ventes" ON public.ventes
    FOR SELECT USING (true);

CREATE POLICY "Only managers and sellers can create ventes" ON public.ventes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('gerant', 'vendeur')
        )
    );

CREATE POLICY "Only managers can modify ventes" ON public.ventes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'gerant'
        )
    );

-- Politiques pour les détails de ventes
CREATE POLICY "Everyone can view vente details" ON public.vente_details
    FOR SELECT USING (true);

CREATE POLICY "Only managers and sellers can create vente details" ON public.vente_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('gerant', 'vendeur')
        )
    );

-- Politiques pour les mouvements de stock
CREATE POLICY "Everyone can view stock movements" ON public.stock_movements
    FOR SELECT USING (true);

CREATE POLICY "Only managers and sellers can create stock movements" ON public.stock_movements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('gerant', 'vendeur')
        )
    );

-- =====================================================
-- TRIGGERS POUR LES TIMESTAMPS
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_declinaisons_updated_at BEFORE UPDATE ON public.declinaisons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Insérer les collections par défaut
INSERT INTO public.collections (nom, description, couleur) VALUES
('Vêtements', 'Collection de vêtements', '#3B82F6'),
('Accessoires', 'Collection d''accessoires', '#10B981'),
('Chaussures', 'Collection de chaussures', '#F59E0B'),
('Électronique', 'Collection d''électronique', '#8B5CF6');

-- Insérer un utilisateur admin par défaut (sera créé via Supabase Auth)
-- Note: L'utilisateur sera créé automatiquement lors de l'inscription
-- et mis à jour avec les informations de profil dans la table users

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour générer un numéro de vente unique
CREATE OR REPLACE FUNCTION generate_vente_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    vente_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_vente FROM 'V(\d+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.ventes
    WHERE numero_vente ~ '^V\d+$';
    
    vente_number := 'V' || LPAD(next_number::TEXT, 4, '0');
    RETURN vente_number;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le stock après une vente
CREATE OR REPLACE FUNCTION update_stock_after_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Diminuer la quantité en stock
    UPDATE public.declinaisons
    SET quantite = quantite - NEW.quantite,
        updated_at = NOW()
    WHERE id = NEW.declinaison_id;
    
    -- Enregistrer le mouvement de stock
    INSERT INTO public.stock_movements (declinaison_id, type, quantite, raison, user_id)
    VALUES (NEW.declinaison_id, 'sortie', NEW.quantite, 'Vente', 
            (SELECT user_id FROM public.ventes WHERE id = NEW.vente_id));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le stock automatiquement
CREATE TRIGGER trigger_update_stock_after_sale
    AFTER INSERT ON public.vente_details
    FOR EACH ROW EXECUTE FUNCTION update_stock_after_sale();

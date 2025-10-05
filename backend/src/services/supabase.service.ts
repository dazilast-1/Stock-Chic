import { supabaseAdmin, Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Article = Database['public']['Tables']['articles']['Row'];
type Declinaison = Database['public']['Tables']['declinaisons']['Row'];
type Collection = Database['public']['Tables']['collections']['Row'];
type Vente = Database['public']['Tables']['ventes']['Row'];
type VenteDetail = Database['public']['Tables']['vente_details']['Row'];
type StockMovement = Database['public']['Tables']['stock_movements']['Row'];
type ArticlePhoto = Database['public']['Tables']['article_photos']['Row'];

export class SupabaseService {
  // =====================================================
  // GESTION DES UTILISATEURS
  // =====================================================

  async getUserById(id: string): Promise<User | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
    
    return data;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
    
    return data;
  }

  async createUser(userData: {
    id: string;
    email: string;
    nom?: string;
    prenom?: string;
    role?: 'gerant' | 'vendeur';
    avatar_url?: string;
    telephone?: string;
  }): Promise<User | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return null;
    }
    
    return data;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      return null;
    }
    
    return data;
  }

  async getAllUsers(): Promise<User[]> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
    
    return data || [];
  }

  // =====================================================
  // GESTION DES ARTICLES
  // =====================================================

  async getAllArticles(): Promise<(Article & { declinaisons: Declinaison[], photos: ArticlePhoto[], collection?: Collection })[]> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select(`
        *,
        declinaisons (*),
        article_photos (*),
        collection:collections (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }
    
    return data || [];
  }

  async getArticleById(id: string): Promise<(Article & { declinaisons: Declinaison[], photos: ArticlePhoto[], collection?: Collection }) | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select(`
        *,
        declinaisons (*),
        article_photos (*),
        collection:collections (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return null;
    }
    
    return data;
  }

  async createArticle(articleData: {
    nom: string;
    description?: string;
    prix_achat?: number;
    prix_vente: number;
    collection_id?: string;
  }): Promise<Article | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert(articleData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      return null;
    }
    
    return data;
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      return null;
    }
    
    return data;
  }

  async deleteArticle(id: string): Promise<boolean> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return false;
    }
    
    return true;
  }

  // =====================================================
  // GESTION DES DÉCLINAISONS
  // =====================================================

  async createDeclinaison(declinaisonData: {
    article_id: string;
    taille?: string;
    couleur?: string;
    quantite?: number;
    quantite_min?: number;
  }): Promise<Declinaison | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('declinaisons')
      .insert(declinaisonData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la déclinaison:', error);
      return null;
    }
    
    return data;
  }

  async updateDeclinaison(id: string, updates: Partial<Declinaison>): Promise<Declinaison | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('declinaisons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la déclinaison:', error);
      return null;
    }
    
    return data;
  }

  // =====================================================
  // GESTION DES COLLECTIONS
  // =====================================================

  async getAllCollections(): Promise<Collection[]> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('collections')
      .select('*')
      .order('nom');
    
    if (error) {
      console.error('Erreur lors de la récupération des collections:', error);
      return [];
    }
    
    return data || [];
  }

  async createCollection(collectionData: {
    nom: string;
    description?: string;
    couleur?: string;
  }): Promise<Collection | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('collections')
      .insert(collectionData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la collection:', error);
      return null;
    }
    
    return data;
  }

  // =====================================================
  // GESTION DES VENTES
  // =====================================================

  async createVente(venteData: {
    numero_vente: string;
    client_nom?: string;
    client_telephone?: string;
    client_email?: string;
    montant_total: number;
    montant_paye: number;
    methode_paiement: 'especes' | 'carte' | 'cheque' | 'virement';
    user_id?: string;
  }): Promise<Vente | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('ventes')
      .insert(venteData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la vente:', error);
      return null;
    }
    
    return data;
  }

  async createVenteDetail(detailData: {
    vente_id: string;
    declinaison_id: string;
    quantite: number;
    prix_unitaire: number;
  }): Promise<VenteDetail | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('vente_details')
      .insert(detailData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du détail de vente:', error);
      return null;
    }
    
    return data;
  }

  async getRecentVentes(limit: number = 10): Promise<Vente[]> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('ventes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Erreur lors de la récupération des ventes récentes:', error);
      return [];
    }
    
    return data || [];
  }

  // =====================================================
  // GESTION DES MOUVEMENTS DE STOCK
  // =====================================================

  async getStockMovements(limit: number = 50): Promise<StockMovement[]> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('stock_movements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Erreur lors de la récupération des mouvements de stock:', error);
      return [];
    }
    
    return data || [];
  }

  // =====================================================
  // STATISTIQUES
  // =====================================================

  async getStockStats(): Promise<{
    totalArticles: number;
    totalDeclinaisons: number;
    stockBas: number;
    valeurStock: number;
  }> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    // Compter les articles
    const { count: totalArticles } = await supabaseAdmin
      .from('articles')
      .select('*', { count: 'exact', head: true });
    
    // Compter les déclinaisons
    const { count: totalDeclinaisons } = await supabaseAdmin
      .from('declinaisons')
      .select('*', { count: 'exact', head: true });
    
    // Compter les déclinaisons avec stock bas
    const { count: stockBas } = await supabaseAdmin
      .from('declinaisons')
      .select('*', { count: 'exact', head: true })
      .lte('quantite', 'quantite_min');
    
    // Calculer la valeur du stock
    const { data: declinaisons } = await supabaseAdmin
      .from('declinaisons')
      .select(`
        quantite,
        article:articles (prix_achat)
      `);
    
    const valeurStock = declinaisons?.reduce((total, decl) => {
      const prixAchat = decl.article?.prix_achat || 0;
      return total + (prixAchat * decl.quantite);
    }, 0) || 0;
    
    return {
      totalArticles: totalArticles || 0,
      totalDeclinaisons: totalDeclinaisons || 0,
      stockBas: stockBas || 0,
      valeurStock
    };
  }

  async getStockAlerts(): Promise<(Declinaison & { article: Article })[]> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('declinaisons')
      .select(`
        *,
        article:articles (*)
      `)
      .lte('quantite', 'quantite_min');
    
    if (error) {
      console.error('Erreur lors de la récupération des alertes de stock:', error);
      return [];
    }
    
    return data || [];
  }

  // =====================================================
  // GESTION DES PHOTOS
  // =====================================================

  async createArticlePhoto(photoData: {
    article_id: string;
    url: string;
    alt_text?: string;
    is_primary?: boolean;
  }): Promise<ArticlePhoto | null> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabaseAdmin
      .from('article_photos')
      .insert(photoData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la photo:', error);
      return null;
    }
    
    return data;
  }

  async deleteArticlePhoto(id: string): Promise<boolean> {
    if (!supabaseAdmin) throw new Error('Supabase non configuré');
    
    const { error } = await supabaseAdmin
      .from('article_photos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      return false;
    }
    
    return true;
  }
}

export const supabaseService = new SupabaseService();

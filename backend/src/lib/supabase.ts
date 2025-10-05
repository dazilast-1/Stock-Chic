import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables Supabase manquantes - Mode démo activé');
}

// Client Supabase pour les opérations côté client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Client Supabase pour les opérations côté serveur (avec service role key)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Types pour TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          nom: string | null;
          prenom: string | null;
          role: 'gerant' | 'vendeur';
          avatar_url: string | null;
          telephone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nom?: string | null;
          prenom?: string | null;
          role?: 'gerant' | 'vendeur';
          avatar_url?: string | null;
          telephone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nom?: string | null;
          prenom?: string | null;
          role?: 'gerant' | 'vendeur';
          avatar_url?: string | null;
          telephone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          nom: string;
          description: string | null;
          couleur: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          description?: string | null;
          couleur?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          description?: string | null;
          couleur?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          nom: string;
          description: string | null;
          prix_achat: number | null;
          prix_vente: number;
          collection_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          description?: string | null;
          prix_achat?: number | null;
          prix_vente: number;
          collection_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          description?: string | null;
          prix_achat?: number | null;
          prix_vente?: number;
          collection_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      declinaisons: {
        Row: {
          id: string;
          article_id: string;
          taille: string | null;
          couleur: string | null;
          quantite: number;
          quantite_min: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          taille?: string | null;
          couleur?: string | null;
          quantite?: number;
          quantite_min?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          taille?: string | null;
          couleur?: string | null;
          quantite?: number;
          quantite_min?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      article_photos: {
        Row: {
          id: string;
          article_id: string;
          url: string;
          alt_text: string | null;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          url: string;
          alt_text?: string | null;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          url?: string;
          alt_text?: string | null;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      ventes: {
        Row: {
          id: string;
          numero_vente: string;
          client_nom: string | null;
          client_telephone: string | null;
          client_email: string | null;
          montant_total: number;
          montant_paye: number;
          methode_paiement: 'especes' | 'carte' | 'cheque' | 'virement';
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          numero_vente: string;
          client_nom?: string | null;
          client_telephone?: string | null;
          client_email?: string | null;
          montant_total: number;
          montant_paye: number;
          methode_paiement: 'especes' | 'carte' | 'cheque' | 'virement';
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          numero_vente?: string;
          client_nom?: string | null;
          client_telephone?: string | null;
          client_email?: string | null;
          montant_total?: number;
          montant_paye?: number;
          methode_paiement?: 'especes' | 'carte' | 'cheque' | 'virement';
          user_id?: string | null;
          created_at?: string;
        };
      };
      vente_details: {
        Row: {
          id: string;
          vente_id: string;
          declinaison_id: string;
          quantite: number;
          prix_unitaire: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vente_id: string;
          declinaison_id: string;
          quantite: number;
          prix_unitaire: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          vente_id?: string;
          declinaison_id?: string;
          quantite?: number;
          prix_unitaire?: number;
          created_at?: string;
        };
      };
      stock_movements: {
        Row: {
          id: string;
          declinaison_id: string;
          type: 'entree' | 'sortie' | 'ajustement';
          quantite: number;
          raison: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          declinaison_id: string;
          type: 'entree' | 'sortie' | 'ajustement';
          quantite: number;
          raison?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          declinaison_id?: string;
          type?: 'entree' | 'sortie' | 'ajustement';
          quantite?: number;
          raison?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

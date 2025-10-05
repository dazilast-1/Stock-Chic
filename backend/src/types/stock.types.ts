// Types personnalisés pour les collections
export type CollectionType = 'HIVER_2024' | 'ETE_2024' | 'AUTOMNE_2024' | 'PRINTEMPS_2025';

// Types personnalisés pour les tailles
export type TailleType = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | 'Unique';

// Types personnalisés pour les mouvements de stock
export type MouvementType = 'ENTREE' | 'SORTIE_VENTE' | 'SORTIE_PERTE' | 'AJUSTEMENT' | 'RETOUR_CLIENT';

// Types personnalisés pour les rôles utilisateur
export type UserRole = 'gerant' | 'vendeur';

// Interface pour l'utilisateur
export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  profile_photo?: string;
  created_at: string;
}

// Interface pour l'utilisateur sans mot de passe (pour les réponses API)
export interface UserPublic {
  id: string;
  email: string;
  role: UserRole;
  profile_photo?: string;
  created_at: string;
}

// Interface pour les photos d'articles
export interface ArticlePhoto {
  id: string;
  article_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  created_at: string;
}

// Interface pour l'article
export interface Article {
  id: string;
  reference: string;
  nom: string;
  marque?: string;
  collection: CollectionType;
  prix_achat: number;
  prix_vente: number;
  photos?: ArticlePhoto[];
  created_at: string;
}

// Interface pour la déclinaison
export interface Declinaison {
  id: string;
  article_id: string;
  taille: TailleType;
  couleur: string;
  quantite: number;
  quantite_min: number;
  code_barre?: string;
}

// Interface pour l'article avec ses déclinaisons
export interface ArticleWithDeclinaisons extends Article {
  declinaisons: Declinaison[];
}

// Interface pour la création d'un article
export interface CreateArticleRequest {
  reference: string;
  nom: string;
  marque?: string;
  collection: CollectionType;
  prix_achat: number;
  prix_vente: number;
  declinaisons: Omit<Declinaison, 'id' | 'article_id'>[];
  photos?: Omit<ArticlePhoto, 'id' | 'article_id' | 'created_at'>[];
}

// Interface pour la mise à jour d'un article
export interface UpdateArticleRequest {
  nom?: string;
  marque?: string;
  collection?: CollectionType;
  prix_achat?: number;
  prix_vente?: number;
}

// Interface pour l'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: UserRole;
}

// Interface pour la réponse d'authentification
export interface AuthResponse {
  token: string;
  user: UserPublic;
}

// Interface pour le payload JWT
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Interface pour la réponse API standard
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Interface pour la pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Interface pour la réponse paginée
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Interface pour une vente
export interface Vente {
  id: string;
  numero_vente: string;
  client_nom?: string;
  client_email?: string;
  client_telephone?: string;
  items: VenteItem[];
  montant_total: number;
  montant_paye: number;
  montant_rendu: number;
  mode_paiement: 'ESPECES' | 'CARTE' | 'CHEQUE' | 'VIREMENT' | 'MOBILE_MONEY';
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'ANNULEE';
  notes?: string;
  vendeur_id: string;
  created_at: string;
}

// Interface pour un item de vente
export interface VenteItem {
  id: string;
  vente_id: string;
  article_id: string;
  declinaison_id: string;
  article_nom: string;
  article_reference: string;
  taille: TailleType;
  couleur: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
}

// Interface pour créer une vente
export interface CreateVenteRequest {
  client_nom?: string;
  client_email?: string;
  client_telephone?: string;
  items: {
    article_id: string;
    declinaison_id: string;
    quantite: number;
    prix_unitaire: number;
  }[];
  montant_paye: number;
  mode_paiement: 'ESPECES' | 'CARTE' | 'CHEQUE' | 'VIREMENT' | 'MOBILE_MONEY';
  notes?: string;
}

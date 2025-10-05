// Types personnalisés pour les collections
export type CollectionType = 'HIVER_2024' | 'ETE_2024' | 'AUTOMNE_2024' | 'PRINTEMPS_2025';

// Types personnalisés pour les tailles
export type TailleType = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | 'Unique';

// Types personnalisés pour les rôles utilisateur
export type UserRole = 'gerant' | 'vendeur';

// Interface pour les photos d'articles
export interface ArticlePhoto {
  id: string;
  article_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  created_at: string;
}

// Interface pour l'utilisateur
export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile_photo?: string;
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
  updated_at?: string;
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
  created_at: string;
  updated_at?: string;
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
  declinaisons: Omit<Declinaison, 'id' | 'article_id' | 'created_at' | 'updated_at'>[];
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
  user: User;
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

// Interface pour les alertes de stock
export interface StockAlert {
  article_id: string;
  reference: string;
  nom: string;
  marque?: string;
  declinaison_id: string;
  taille: TailleType;
  couleur: string;
  quantite: number;
  quantite_min: number;
  quantite_manquante: number;
}

// Interface pour le contexte d'authentification
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Interface pour les options de formulaire
export interface FormOption {
  value: string;
  label: string;
}

// Constantes pour les options de formulaire
export const COLLECTION_OPTIONS: FormOption[] = [
  { value: 'HIVER_2024', label: 'Hiver 2024' },
  { value: 'ETE_2024', label: 'Été 2024' },
  { value: 'AUTOMNE_2024', label: 'Automne 2024' },
  { value: 'PRINTEMPS_2025', label: 'Printemps 2025' },
];

export const TAILLE_OPTIONS: FormOption[] = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

export const ROLE_OPTIONS: FormOption[] = [
  { value: 'vendeur', label: 'Vendeur' },
  { value: 'gerant', label: 'Gérant' },
];


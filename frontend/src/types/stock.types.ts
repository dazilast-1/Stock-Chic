export interface StockMovement {
  id: string;
  articleId: string;
  type: 'entree' | 'sortie' | 'ajustement';
  quantite: number;
  motif: string;
  date: string;
  userId: string;
  article?: {
    id: string;
    nom: string;
    reference: string;
  };
}

export interface StockAlert {
  id: string;
  articleId: string;
  type: 'stock_bas' | 'rupture' | 'expiration';
  niveau: 'warning' | 'danger' | 'critical';
  quantite: number;
  quantiteMin: number;
  date: string;
  traite: boolean;
  article?: {
    id: string;
    nom: string;
    reference: string;
    photo?: string;
  };
}

export interface Declinaison {
  id: string;
  articleId: string;
  taille?: string;
  couleur?: string;
  prix?: number;
  stock?: number;
}

export interface ArticleWithDeclinaisons {
  id: string;
  nom: string;
  reference: string;
  description?: string;
  prix: number;
  stock: number;
  categorie?: string;
  fournisseur?: string;
  photo?: string;
  declinaisons?: Declinaison[];
}

export interface CartItem {
  id: string;
  articleId: string;
  declinaisonId?: string;
  quantite: number;
  prixUnitaire: number;
  article: {
    id: string;
    nom: string;
    reference: string;
    photo?: string;
  };
  declinaison?: {
    id: string;
    taille?: string;
    couleur?: string;
    quantite: number;
  };
}

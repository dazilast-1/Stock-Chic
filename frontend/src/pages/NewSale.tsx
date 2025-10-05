import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  CreditCard, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Search,
  X
} from 'lucide-react';
import { apiClient } from '../api/client';
import type { ArticleWithDeclinaisons, Declinaison } from '../types';

interface CartItem {
  article_id: string;
  declinaison_id: string;
  article_nom: string;
  article_reference: string;
  taille: string;
  couleur: string;
  quantite: number;
  prix_unitaire: number;
  stock_disponible: number;
}

const NewSale: React.FC = () => {
  const queryClient = useQueryClient();
  
  // États du formulaire
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientNom, setClientNom] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientTelephone, setClientTelephone] = useState('');
  const [modePaiement, setModePaiement] = useState<'ESPECES' | 'CARTE' | 'CHEQUE' | 'VIREMENT' | 'MOBILE_MONEY'>('ESPECES');
  const [montantPaye, setMontantPaye] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [numeroVente, setNumeroVente] = useState('');

  // Récupérer les articles
  const { data: articlesResponse, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await apiClient.get('/articles');
      return response.data;
    },
  });

  const articles: ArticleWithDeclinaisons[] = Array.isArray(articlesResponse?.data?.data) 
    ? articlesResponse.data.data 
    : [];

  // Filtrer les articles selon la recherche
  const filteredArticles = articles.filter(article =>
    article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.marque?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutation pour créer une vente
  const createVenteMutation = useMutation({
    mutationFn: async (venteData: any) => {
      const response = await apiClient.post('/ventes', venteData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['ventes'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      
      setNumeroVente(data.data.numero_vente);
      setShowSuccess(true);
      
      // Réinitialiser le formulaire
      setCart([]);
      setClientNom('');
      setClientEmail('');
      setClientTelephone('');
      setMontantPaye('');
      setNotes('');
      setSearchTerm('');
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setShowSuccess(false), 5000);
    },
  });

  // Ajouter un article au panier
  const addToCart = (article: ArticleWithDeclinaisons, declinaison: Declinaison) => {
    const existingItem = cart.find(
      item => item.article_id === article.id && item.declinaison_id === declinaison.id
    );

    if (existingItem) {
      if (existingItem.quantite < declinaison.quantite) {
        setCart(cart.map(item =>
          item.article_id === article.id && item.declinaison_id === declinaison.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        ));
      }
    } else {
      if (declinaison.quantite > 0) {
        setCart([...cart, {
          article_id: article.id,
          declinaison_id: declinaison.id,
          article_nom: article.nom,
          article_reference: article.reference,
          taille: declinaison.taille,
          couleur: declinaison.couleur,
          quantite: 1,
          prix_unitaire: article.prix_vente,
          stock_disponible: declinaison.quantite,
        }]);
      }
    }
  };

  // Modifier la quantité d'un article
  const updateQuantity = (declinaison_id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.declinaison_id === declinaison_id) {
        const newQuantite = item.quantite + delta;
        if (newQuantite > 0 && newQuantite <= item.stock_disponible) {
          return { ...item, quantite: newQuantite };
        }
      }
      return item;
    }));
  };

  // Supprimer un article du panier
  const removeFromCart = (declinaison_id: string) => {
    setCart(cart.filter(item => item.declinaison_id !== declinaison_id));
  };

  // Calculer le total
  const montantTotal = cart.reduce((sum, item) => sum + (item.prix_unitaire * item.quantite), 0);
  const montantRendu = Math.max(0, parseFloat(montantPaye || '0') - montantTotal);

  // Soumettre la vente
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Le panier est vide');
      return;
    }

    if (parseFloat(montantPaye || '0') < montantTotal) {
      alert('Le montant payé est insuffisant');
      return;
    }

    const venteData = {
      client_nom: clientNom || undefined,
      client_email: clientEmail || undefined,
      client_telephone: clientTelephone || undefined,
      items: cart.map(item => ({
        article_id: item.article_id,
        declinaison_id: item.declinaison_id,
        quantite: item.quantite,
        prix_unitaire: item.prix_unitaire,
      })),
      montant_paye: parseFloat(montantPaye),
      mode_paiement: modePaiement,
      notes: notes || undefined,
    };

    createVenteMutation.mutate(venteData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle Vente</h1>
          <p className="text-gray-600 mt-1">Enregistrez une nouvelle transaction</p>
        </div>
        <ShoppingCart className="h-8 w-8 text-indigo-600" />
      </div>

      {/* Message de succès */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-800">Vente enregistrée avec succès !</h3>
            <p className="text-sm text-green-700 mt-1">
              Numéro de vente : <span className="font-semibold">{numeroVente}</span>
            </p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-800">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection des articles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sélectionner les articles</h2>
            
            {/* Barre de recherche */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Liste des articles */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredArticles.map(article => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{article.nom}</h3>
                      <p className="text-sm text-gray-500">
                        {article.reference} {article.marque && `• ${article.marque}`}
                      </p>
                      <p className="text-lg font-semibold text-indigo-600 mt-1">
                        {article.prix_vente.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                  
                  {/* Déclinaisons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {article.declinaisons.map(declinaison => (
                      <button
                        key={declinaison.id}
                        onClick={() => addToCart(article, declinaison)}
                        disabled={declinaison.quantite === 0}
                        className={`p-2 rounded-lg text-sm border transition-colors ${
                          declinaison.quantite === 0
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{declinaison.taille} - {declinaison.couleur}</div>
                        <div className="text-xs">
                          {declinaison.quantite > 0 ? `Stock: ${declinaison.quantite}` : 'Rupture'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panier et informations */}
        <div className="space-y-4">
          {/* Panier */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Panier ({cart.length} {cart.length > 1 ? 'articles' : 'article'})
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={item.declinaison_id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.article_nom}</h4>
                        <p className="text-xs text-gray-500">
                          {item.taille} - {item.couleur}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.declinaison_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.declinaison_id, -1)}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantite}</span>
                        <button
                          onClick={() => updateQuantity(item.declinaison_id, 1)}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                          disabled={item.quantite >= item.stock_disponible}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {(item.prix_unitaire * item.quantite).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-indigo-600">{montantTotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Formulaire de vente */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de vente</h2>
            
            {/* Informations client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline h-4 w-4 mr-1" />
                Nom du client (optionnel)
              </label>
              <input
                type="text"
                value={clientNom}
                onChange={(e) => setClientNom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="client@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
              <input
                type="tel"
                value={clientTelephone}
                onChange={(e) => setClientTelephone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Mode de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CreditCard className="inline h-4 w-4 mr-1" />
                Mode de paiement
              </label>
              <select
                value={modePaiement}
                onChange={(e) => setModePaiement(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="ESPECES">Espèces</option>
                <option value="CARTE">Carte bancaire</option>
                <option value="CHEQUE">Chèque</option>
                <option value="VIREMENT">Virement</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
              </select>
            </div>

            {/* Montant payé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Montant payé *
              </label>
              <input
                type="number"
                step="0.01"
                value={montantPaye}
                onChange={(e) => setMontantPaye(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
              {montantPaye && parseFloat(montantPaye) >= montantTotal && (
                <p className="text-sm text-green-600 mt-1">
                  Monnaie à rendre : {montantRendu.toFixed(2)} €
                </p>
              )}
              {montantPaye && parseFloat(montantPaye) < montantTotal && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Montant insuffisant
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Informations complémentaires..."
              />
            </div>

            {/* Bouton de validation */}
            <button
              type="submit"
              disabled={cart.length === 0 || !montantPaye || parseFloat(montantPaye) < montantTotal || createVenteMutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {createVenteMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Valider la vente
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSale;

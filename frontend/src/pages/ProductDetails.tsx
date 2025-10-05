import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingCart, 
  Star,
  Heart,
  Share2,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { apiClient } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ArticleWithDeclinaisons } from '../types/stock.types';

interface ProductPhoto {
  id: string;
  article_id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  created_at: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [article, setArticle] = useState<ArticleWithDeclinaisons | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedDeclinaison, setSelectedDeclinaison] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/articles/${id}`);
      if (response.data && response.data.data) {
        setArticle(response.data.data);
        // Sélectionner automatiquement la première déclinaison
        if (response.data.data.declinaisons && response.data.data.declinaisons.length > 0) {
          setSelectedDeclinaison(response.data.data.declinaisons[0].id);
        }
        // Sélectionner la photo principale
        if (response.data.data.photos && response.data.data.photos.length > 0) {
          const primaryPhoto = response.data.data.photos.find((photo: ProductPhoto) => photo.is_primary);
          setSelectedPhoto(primaryPhoto ? primaryPhoto.url : response.data.data.photos[0].url);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!article || !window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await apiClient.delete(`/articles/${article.id}`);
      navigate('/articles');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'article');
    }
  };

  const handleAddToCart = () => {
    if (!article || !selectedDeclinaisonData) {
      alert('Veuillez sélectionner une déclinaison');
      return;
    }

    addToCart(article, selectedDeclinaisonData, quantity);
    alert(`${article.nom} (${selectedDeclinaisonData.taille} - ${selectedDeclinaisonData.couleur}) ajouté au panier !`);
  };

  const getStockStatus = (quantite: number, quantiteMin: number) => {
    if (quantite === 0) return { status: 'Épuisé', color: 'text-red-600 bg-red-100', icon: AlertTriangle };
    if (quantite <= quantiteMin) return { status: 'Stock bas', color: 'text-orange-600 bg-orange-100', icon: AlertTriangle };
    return { status: 'En stock', color: 'text-green-600 bg-green-100', icon: CheckCircle };
  };

  const selectedDeclinaisonData = article?.declinaisons.find(d => d.id === selectedDeclinaison);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article non trouvé</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">L'article que vous recherchez n'existe pas.</p>
        <Link to="/articles">
          <Button>Retour au catalogue</Button>
        </Link>
      </div>
    );
  }

  const primaryPhoto = article.photos?.find(photo => photo.is_primary) || article.photos?.[0];
  const stockStatus = selectedDeclinaisonData ? getStockStatus(selectedDeclinaisonData.quantite, selectedDeclinaisonData.quantite_min) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/articles')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{article.nom}</h1>
            <p className="text-gray-600 dark:text-gray-400">Référence: {article.reference}</p>
          </div>
        </div>
        
        {user?.role === 'gerant' && (
          <div className="flex space-x-2">
            <Link to={`/articles/${article.id}/edit`}>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Modifier</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section Photos */}
        <div className="space-y-4">
          {/* Photo principale */}
          <div className="relative">
            <img
              src={selectedPhoto || primaryPhoto?.url || '/placeholder-product.jpg'}
              alt={primaryPhoto?.alt_text || article.nom}
              className="w-full h-96 object-cover rounded-lg shadow-lg cursor-pointer"
              onClick={() => setShowPhotoModal(true)}
            />
            {stockStatus && (
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${stockStatus.color}`}>
                <stockStatus.icon className="w-4 h-4" />
                <span>{stockStatus.status}</span>
              </div>
            )}
          </div>

          {/* Miniatures des photos */}
          {article.photos && article.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {article.photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.alt_text}
                  className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    selectedPhoto === photo.url ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPhoto(photo.url)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section Détails */}
        <div className="space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Informations produit</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Marque</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{article.marque}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Collection</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{article.collection}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Prix d'achat</label>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{article.prix_achat.toFixed(2)} €</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Prix de vente</label>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{article.prix_vente.toFixed(2)} €</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Marge</label>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {((article.prix_vente - article.prix_achat) / article.prix_achat * 100).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sélection déclinaison */}
          {article.declinaisons && article.declinaisons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Déclinaisons disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {article.declinaisons.map((declinaison) => {
                    const status = getStockStatus(declinaison.quantite, declinaison.quantite_min);
                    return (
                      <div
                        key={declinaison.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedDeclinaison === declinaison.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedDeclinaison(declinaison.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {declinaison.taille} - {declinaison.couleur}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Stock: {declinaison.quantite} | Seuil: {declinaison.quantite_min}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${status.color}`}>
                            <status.icon className="w-3 h-3" />
                            <span>{status.status}</span>
                          </div>
                        </div>
                        {declinaison.code_barre && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Code-barres: {declinaison.code_barre}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center space-x-2"
              disabled={!selectedDeclinaisonData || selectedDeclinaisonData.quantite === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal photo */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedPhoto}
              alt={article.nom}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

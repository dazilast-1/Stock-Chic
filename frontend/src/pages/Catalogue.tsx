import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Package, 
  Edit, 
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';
import { ArticleWithDeclinaisons, CollectionType } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { COLLECTION_OPTIONS } from '../types';

const Catalogue: React.FC = () => {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState<ArticleWithDeclinaisons[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<CollectionType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Charger les articles
  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getArticles({
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        collection: selectedCollection || undefined,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
      
      setArticles(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [currentPage, searchTerm, selectedCollection]);

  // Supprimer un article
  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await apiClient.deleteArticle(id);
      loadArticles(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Calculer le stock total d'un article
  const getTotalStock = (article: ArticleWithDeclinaisons) => {
    return article.declinaisons.reduce((total, declinaison) => total + declinaison.quantite, 0);
  };

  // Vérifier si l'article a des alertes de stock
  const hasStockAlerts = (article: ArticleWithDeclinaisons) => {
    return article.declinaisons.some(d => d.quantite <= d.quantite_min);
  };

  // Obtenir une couleur basée sur la collection
  const getCollectionColor = (collection: string) => {
    const colors = {
      'Vêtements': 'bg-blue-500',
      'Chaussures': 'bg-green-500',
      'Accessoires': 'bg-purple-500',
      'Sac': 'bg-orange-500',
      'Montre': 'bg-pink-500',
      'Parfum': 'bg-indigo-500',
    };
    return colors[collection as keyof typeof colors] || 'bg-gray-500';
  };

  // Obtenir une icône basée sur la collection
  const getCollectionIcon = (collection: string) => {
    const icons = {
      'Vêtements': '👕',
      'Chaussures': '👟',
      'Accessoires': '✨',
      'Sac': '👜',
      'Montre': '⌚',
      'Parfum': '🌸',
    };
    return icons[collection as keyof typeof icons] || '📦';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header moderne */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Stock Chic
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tableau de bord
                </Link>
                <Link to="/catalogue" className="text-blue-600 font-medium">
                  Catalogue
                </Link>
                <Link to="/ventes" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Ventes
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {user?.email}
              </span>
              <span className="badge badge-primary">
                {user?.role === 'gerant' ? 'Gérant' : 'Vendeur'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200"
              >
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec titre moderne */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nouveau Catalogue
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection complète de produits élégants et tendances
          </p>
          <div className="flex justify-center mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
              📦 {articles.length} articles disponibles
            </div>
          </div>
        </div>

        {/* Barre d'outils moderne */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Recherche et filtres */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher un article..."
                  className="pl-10 bg-white/80 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                placeholder="Toutes les collections"
                className="w-full sm:w-48 bg-white/80"
                options={[
                  { value: '', label: 'Toutes les collections' },
                  ...COLLECTION_OPTIONS
                ]}
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value as CollectionType | '')}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  📱
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  📋
                </Button>
              </div>
              <Link to="/articles/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 shadow-lg">
                  <Plus className="w-4 h-4" />
                  <span>Nouvel article</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Grille de produits moderne */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par ajouter votre premier article au catalogue.
              </p>
              <Link to="/articles/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un article
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
              {articles.map((article) => (
                <div key={article.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Image du produit */}
                  <div className="h-48 relative overflow-hidden">
                    {article.photos && article.photos.length > 0 ? (
                      <>
                        <img 
                          src={`http://localhost:3001${article.photos[0].url}`}
                          alt={article.photos[0].alt_text || article.nom}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                      </>
                    ) : (
                      <div className={`h-full ${getCollectionColor(article.collection)} flex items-center justify-center`}>
                        <div className="text-white text-6xl opacity-80">
                          {getCollectionIcon(article.collection)}
                        </div>
                      </div>
                    )}
                    
                    {/* Badges et informations */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 text-xl">
                      {getCollectionIcon(article.collection)}
                    </div>
                    {hasStockAlerts(article) && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                        <div className="text-xs text-gray-600">Stock total</div>
                        <div className="text-lg font-bold text-gray-900">{getTotalStock(article)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {article.nom}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{article.reference}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCollectionColor(article.collection)} text-white`}>
                            {article.collection}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{article.marque || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Prix */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Prix d'achat</div>
                        <div className="text-sm font-medium text-gray-700">€{article.prix_achat}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Prix de vente</div>
                        <div className="text-lg font-bold text-blue-600">€{article.prix_vente}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link to={`/articles/${article.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-white/80 hover:bg-blue-50 hover:border-blue-200">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      <Link to={`/articles/${article.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-white/80 hover:bg-green-50 hover:border-green-200">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </Link>
                      {user?.role === 'gerant' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteArticle(article.id)}
                          className="bg-white/80 hover:bg-red-50 hover:border-red-200 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination moderne */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-white/80 hover:bg-blue-50"
                >
                  ← Précédent
                </Button>
                
                <div className="flex items-center space-x-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? 'bg-blue-600' : 'bg-white/80 hover:bg-blue-50'}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-white/80 hover:bg-blue-50"
                >
                  Suivant →
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Catalogue;
import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCcw, 
  Plus,
  Minus,
  Package,
  Calendar,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { apiClient } from '../api/client';
import Button from '../components/ui/Button';

interface StockMovement {
  id: string;
  date: string;
  type: 'ENTREE' | 'SORTIE_VENTE' | 'SORTIE_PERTE' | 'AJUSTEMENT' | 'RETOUR_CLIENT';
  article: string;
  declinaison: string;
  quantite: number;
  motif: string;
}

const StockMovements: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/stock/movements');
      setMovements(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'ENTREE':
        return <ArrowUpRight className="w-5 h-5 text-green-600" />;
      case 'SORTIE_VENTE':
        return <ArrowDownLeft className="w-5 h-5 text-blue-600" />;
      case 'SORTIE_PERTE':
        return <Minus className="w-5 h-5 text-red-600" />;
      case 'AJUSTEMENT':
        return <RotateCcw className="w-5 h-5 text-orange-600" />;
      case 'RETOUR_CLIENT':
        return <Plus className="w-5 h-5 text-purple-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'ENTREE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SORTIE_VENTE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SORTIE_PERTE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'AJUSTEMENT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'RETOUR_CLIENT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'ENTREE':
        return 'Entrée';
      case 'SORTIE_VENTE':
        return 'Sortie vente';
      case 'SORTIE_PERTE':
        return 'Sortie perte';
      case 'AJUSTEMENT':
        return 'Ajustement';
      case 'RETOUR_CLIENT':
        return 'Retour client';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const filteredMovements = movements.filter(movement => {
    const matchesFilter = filter === 'all' || movement.type === filter;
    const matchesSearch = movement.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.declinaison.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.motif.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mouvements de stock</h2>
          <p className="text-gray-600">Historique complet des mouvements d'inventaire</p>
        </div>
        <Button onClick={fetchMovements} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par article, déclinaison ou motif..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="ENTREE">Entrées</option>
                <option value="SORTIE_VENTE">Sorties vente</option>
                <option value="SORTIE_PERTE">Sorties perte</option>
                <option value="AJUSTEMENT">Ajustements</option>
                <option value="RETOUR_CLIENT">Retours client</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {movements.filter(m => m.type === 'ENTREE').length}
            </div>
            <div className="text-sm text-gray-600">Entrées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {movements.filter(m => m.type === 'SORTIE_VENTE').length}
            </div>
            <div className="text-sm text-gray-600">Sorties vente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {movements.filter(m => m.type === 'SORTIE_PERTE').length}
            </div>
            <div className="text-sm text-gray-600">Sorties perte</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {movements.filter(m => m.type === 'AJUSTEMENT').length}
            </div>
            <div className="text-sm text-gray-600">Ajustements</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {movements.filter(m => m.type === 'RETOUR_CLIENT').length}
            </div>
            <div className="text-sm text-gray-600">Retours</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des mouvements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-600" />
            <span>Historique des mouvements</span>
          </CardTitle>
          <CardDescription>
            {filteredMovements.length} mouvement(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMovements.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun mouvement trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                      {getMovementIcon(movement.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{movement.article}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getMovementColor(movement.type)}`}>
                          {getMovementLabel(movement.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{movement.declinaison}</p>
                      <p className="text-sm text-gray-500">{movement.motif}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      movement.quantite > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.quantite > 0 ? '+' : ''}{movement.quantite}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(movement.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockMovements;


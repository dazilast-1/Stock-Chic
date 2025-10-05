import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Calendar,
  PieChart,
  Activity,
  Target,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { apiClient } from '../api/client';

interface StatsOverview {
  totalArticles: number;
  totalDeclinaisons: number;
  totalStock: number;
  stockBas: number;
  valeurStock: number;
  articlesParCollection: {
    ETE_2024: number;
    HIVER_2024: number;
    AUTOMNE_2024: number;
    PRINTEMPS_2025: number;
  };
}

interface SalesReport {
  period: string;
  totalVentes: number;
  nombreVentes: number;
  panierMoyen: number;
  articlesVendus: number;
  evolution: string;
  topArticles: Array<{
    nom: string;
    quantite: number;
    chiffre: number;
  }>;
  ventesParJour: Array<{
    date: string;
    montant: number;
  }>;
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchStats();
    fetchSalesReport();
  }, [selectedPeriod]);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/stats/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const fetchSalesReport = async () => {
    try {
      const response = await apiClient.get(`/reports/sales?period=${selectedPeriod}`);
      setSalesReport(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement du rapport de ventes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

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
          <h2 className="text-3xl font-bold text-gray-900">Statistiques</h2>
          <p className="text-gray-600">Analyse complète de votre activité</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Année
          </button>
        </div>
      </div>

      {/* Statistiques générales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Articles en stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Déclinaisons</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDeclinaisons}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStock}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur du stock</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.valeurStock)}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rapport de ventes */}
      {salesReport && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Performance des ventes</span>
              </CardTitle>
              <CardDescription>
                Période: {selectedPeriod === 'week' ? 'Semaine' : selectedPeriod === 'month' ? 'Mois' : 'Année'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chiffre d'affaires</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(salesReport.totalVentes)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nombre de ventes</span>
                  <span className="text-lg font-semibold">{salesReport.nombreVentes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Panier moyen</span>
                  <span className="text-lg font-semibold">{formatCurrency(salesReport.panierMoyen)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Articles vendus</span>
                  <span className="text-lg font-semibold">{salesReport.articlesVendus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Évolution</span>
                  <span className={`text-lg font-semibold ${
                    salesReport.evolution.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {salesReport.evolution}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Top Articles</span>
              </CardTitle>
              <CardDescription>Articles les plus vendus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {salesReport.topArticles.map((article, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{article.nom}</p>
                      <p className="text-sm text-gray-600">{article.quantite} vendus</p>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(article.chiffre)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Répartition par collection */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <span>Répartition par collection</span>
            </CardTitle>
            <CardDescription>Distribution des articles par collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.articlesParCollection.ETE_2024}</p>
                <p className="text-sm text-gray-600">Été 2024</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.articlesParCollection.HIVER_2024}</p>
                <p className="text-sm text-gray-600">Hiver 2024</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{stats.articlesParCollection.AUTOMNE_2024}</p>
                <p className="text-sm text-gray-600">Automne 2024</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-2xl font-bold text-pink-600">{stats.articlesParCollection.PRINTEMPS_2025}</p>
                <p className="text-sm text-gray-600">Printemps 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Graphique des ventes par jour */}
      {salesReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Ventes par jour</span>
            </CardTitle>
            <CardDescription>Évolution des ventes sur la période</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {salesReport.ventesParJour.map((vente, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-gray-600">
                    {formatDate(vente.date)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(vente.montant / Math.max(...salesReport.ventesParJour.map(v => v.montant))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium">
                    {formatCurrency(vente.montant)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertes de stock */}
      {stats && stats.stockBas > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Alertes de stock bas</span>
            </CardTitle>
            <CardDescription className="text-orange-700">
              {stats.stockBas} déclinaisons nécessitent un réapprovisionnement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-orange-800">
                Il est recommandé de vérifier et réapprovisionner ces articles.
              </p>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Voir les détails
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Statistics;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  BarChart3,
  ShoppingCart,
  LogOut,
  DollarSign,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AnimatedStatCard from '../components/AnimatedStatCard';
import { apiClient } from '../api/client';

interface StatsOverview {
  totalArticles: number;
  totalDeclinaisons: number;
  totalStock: number;
  stockBas: number;
  valeurStock: number;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/stats/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
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

  // Données pour les cartes animées
  const animatedStats = stats ? [
    {
      title: 'Articles en stock',
      value: stats.totalArticles,
      change: 12,
      icon: <Package className="w-8 h-8" />,
      color: 'blue' as const,
      format: 'number' as const,
    },
    {
      title: 'Alertes stock bas',
      value: stats.stockBas,
      change: -5,
      icon: <AlertTriangle className="w-8 h-8" />,
      color: 'red' as const,
      format: 'number' as const,
    },
    {
      title: 'Valeur du stock',
      value: stats.valeurStock,
      change: 8,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'green' as const,
      format: 'currency' as const,
    },
    {
      title: 'Déclinaisons',
      value: stats.totalDeclinaisons,
      change: 15,
      icon: <Activity className="w-8 h-8" />,
      color: 'purple' as const,
      format: 'number' as const,
    },
  ] : [];

  const quickActions = [
    {
      title: 'Nouvel article',
      description: 'Ajouter un nouvel article au catalogue',
      icon: Plus,
      href: '/articles/new',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Catalogue',
      description: 'Voir tous les articles',
      icon: Package,
      href: '/articles',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      title: 'Alertes stock',
      description: 'Articles en rupture de stock',
      icon: AlertTriangle,
      href: '/alerts',
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      title: 'Rapports',
      description: 'Analyses et statistiques',
      icon: BarChart3,
      href: '/reports',
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Titre de la page */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h2>
        <p className="text-gray-600">
          Vue d'ensemble de votre stock et de vos ventes
        </p>
      </div>

      {/* Statistiques */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {animatedStats.map((stat, index) => (
            <AnimatedStatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
              format={stat.format}
            />
          ))}
        </div>
      )}

      {/* Actions rapides */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${action.bgColor}`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Alertes stock bas</span>
            </CardTitle>
            <CardDescription>
              Articles nécessitant un réapprovisionnement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">T-shirt Basic Blanc</p>
                  <p className="text-sm text-gray-600">Taille M - 2 restants</p>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  Stock bas
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">Jean Slim Noir</p>
                  <p className="text-sm text-gray-600">Taille L - 1 restant</p>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  Stock bas
                </span>
              </div>
              <Link to="/alerts">
                <Button variant="outline" className="w-full">
                  Voir toutes les alertes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Ventes récentes</span>
            </CardTitle>
            <CardDescription>
              Dernières transactions enregistrées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">Vente #1234</p>
                  <p className="text-sm text-gray-600">2 articles - €89.90</p>
                </div>
                <span className="text-sm text-green-600 font-medium">+€89.90</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">Vente #1233</p>
                  <p className="text-sm text-gray-600">1 article - €45.00</p>
                </div>
                <span className="text-sm text-green-600 font-medium">+€45.00</span>
              </div>
              <Link to="/sales">
                <Button variant="outline" className="w-full">
                  Voir toutes les ventes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

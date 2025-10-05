import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  AlertTriangle, 
  BarChart3,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Store,
  Activity,
  TrendingUp,
  DollarSign,
  UserCog
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const menuItems = [
    {
      label: t('nav.home'),
      icon: Store,
      path: '/',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: t('nav.catalogue'),
      icon: Package,
      path: '/articles',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: t('nav.newArticle'),
      icon: Plus,
      path: '/articles/new',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: t('nav.newSale'),
      icon: DollarSign,
      path: '/ventes/new',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: t('nav.stockAlerts'),
      icon: AlertTriangle,
      path: '/alerts',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: t('nav.statistics'),
      icon: BarChart3,
      path: '/statistics',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: t('nav.recentSales'),
      icon: ShoppingCart,
      path: '/sales',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: t('nav.stockMovements'),
      icon: Activity,
      path: '/stock-movements',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      label: 'Utilisateurs',
      icon: Users,
      path: '/users',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    ...(user?.role === 'gerant' ? [{
      label: t('nav.usersManagement'),
      icon: UserCog,
      path: '/users-management',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    }] : []),
    ...(user?.role === 'gerant' ? [{
      label: t('nav.settings'),
      icon: Settings,
      path: '/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    }] : []),
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm w-64">
      {/* Logo et titre */}
      <div className="flex items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">Stock Chic</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Gestion de stock</p>
          </div>
        </div>
      </div>

      {/* Informations utilisateur */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user.email}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.role === 'gerant' ? 'Gérant' : 'Vendeur'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="flex-1 px-2 sm:px-4 py-4 space-y-1 sm:space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 group ${
                active
                  ? `${item.bgColor} ${item.color} shadow-sm`
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 ${
                active ? item.color : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
              }`} />
              <span className="truncate">{item.label}</span>
              {active && (
                <div className={`ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bouton de déconnexion */}
      <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={logout}
          className="w-full flex items-center justify-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:border-red-300 text-xs sm:text-sm py-2 sm:py-2.5"
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="truncate">{t('nav.logout')}</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

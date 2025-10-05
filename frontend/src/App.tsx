import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { CartProvider } from './contexts/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalogue from './pages/Catalogue';
import ArticleForm from './pages/ArticleForm';
import Statistics from './pages/Statistics';
import RecentSales from './pages/RecentSales';
import StockMovements from './pages/StockMovements';
import StockAlerts from './pages/StockAlerts';
import Users from './pages/Users';
import Settings from './pages/Settings';
import NewSale from './pages/NewSale';
import VendorsManagement from './pages/VendorsManagement';
import UsersManagement from './pages/UsersManagement';
import ProductDetails from './pages/ProductDetails';
import Layout from './components/layout/Layout';

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Composant pour les routes protégées
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Composant pour les routes publiques (redirection si déjà connecté)
const PublicRoute: React.FC<{ children: React.ReactNode; redirectIfAuth?: boolean }> = ({ 
  children, 
  redirectIfAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && redirectIfAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <SidebarProvider>
            <CartProvider>
              <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
              {/* Routes publiques */}
              <Route 
                path="/" 
                element={
                  <PublicRoute redirectIfAuth={false}>
                    <Home />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />

              {/* Routes protégées avec layout */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="articles" element={<Catalogue />} />
                <Route path="articles/:id" element={<ProductDetails />} />
                <Route path="articles/new" element={<ArticleForm />} />
                <Route path="articles/:id/edit" element={<ArticleForm />} />
                <Route path="ventes/new" element={<NewSale />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="sales" element={<RecentSales />} />
                <Route path="stock-movements" element={<StockMovements />} />
                <Route path="alerts" element={<StockAlerts />} />
                <Route path="users" element={<Users />} />
                <Route path="vendors" element={<VendorsManagement />} />
                <Route path="users-management" element={<UsersManagement />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Route par défaut pour les utilisateurs connectés */}
              <Route path="/app" element={<Navigate to="/dashboard" replace />} />
              
              {/* Route 404 */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-secondary-900 mb-4">404</h1>
                      <p className="text-secondary-600 mb-6">Page non trouvée</p>
                      <a 
                        href="/dashboard" 
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Retour au tableau de bord
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
            </div>
          </Router>
              </AuthProvider>
            </CartProvider>
          </SidebarProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;

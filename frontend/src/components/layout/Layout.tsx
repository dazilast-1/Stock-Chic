import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from '../ThemeToggle';
import LanguageToggle from '../LanguageToggle';
import Cart from '../Cart';
import { useSidebar } from '../../contexts/SidebarContext';
import { useCart } from '../../contexts/CartContext';
import { Menu, X, ShoppingCart } from 'lucide-react';
import Button from '../ui/Button';

const Layout: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <div className={`hidden lg:block ${isSidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden`}>
        <Sidebar />
      </div>
      
      {/* Sidebar - Mobile (overlay) */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleSidebar} />
          <div className="relative w-80 h-full">
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        {/* Header avec toggles */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Bouton pour masquer/afficher le menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="flex items-center space-x-2"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isSidebarOpen ? 'Masquer le menu' : 'Afficher le menu'}
              </span>
            </Button>
            
            <div className="flex space-x-2 sm:space-x-4">
              {/* Bouton panier */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
              
              <LanguageToggle showLabel={false} />
              <ThemeToggle showLabel={false} />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Modal panier */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Layout;


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Traductions
const translations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.catalogue': 'Catalogue',
    'nav.newArticle': 'Nouvel article',
    'nav.newSale': 'Nouvelle vente',
    'nav.stockAlerts': 'Alertes stock',
    'nav.statistics': 'Statistiques',
    'nav.recentSales': 'Ventes récentes',
    'nav.stockMovements': 'Mouvements stock',
    'nav.freeFeatures': 'Fonctionnalités gratuites',
    'nav.users': 'Utilisateurs',
    'nav.usersManagement': 'Gestion Utilisateurs',
    'nav.settings': 'Paramètres',
    'nav.home': 'Accueil',
    'nav.logout': 'Déconnexion',
    'nav.toggleMenu': 'Afficher le menu',
    'nav.hideMenu': 'Masquer le menu',
    
    // Common
    'common.add': 'Ajouter',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.search': 'Rechercher',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.confirm': 'Confirmer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.close': 'Fermer',
    'common.view': 'Voir',
    'common.details': 'Détails',
    'common.actions': 'Actions',
    'common.status': 'Statut',
    'common.active': 'Actif',
    'common.inactive': 'Inactif',
    
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.totalArticles': 'Total Articles',
    'dashboard.totalStock': 'Total Stock',
    'dashboard.lowStock': 'Stock Bas',
    'dashboard.recentSales': 'Ventes Récentes',
    'dashboard.viewAllAlerts': 'Voir toutes les alertes',
    'dashboard.viewAllSales': 'Voir toutes les ventes',
    
    // Users Management
    'users.title': 'Gestion des Utilisateurs',
    'users.subtitle': 'Gérez les comptes administrateurs et vendeurs',
    'users.totalUsers': 'Total Utilisateurs',
    'users.administrators': 'Administrateurs',
    'users.sellers': 'Vendeurs',
    'users.activeUsers': 'Utilisateurs Actifs',
    'users.addUser': 'Ajouter un utilisateur',
    'users.firstName': 'Prénom',
    'users.lastName': 'Nom',
    'users.email': 'Email',
    'users.phone': 'Téléphone',
    'users.role': 'Rôle',
    'users.password': 'Mot de passe',
    'users.role.seller': 'Vendeur',
    'users.role.admin': 'Administrateur',
    'users.userList': 'Liste des Utilisateurs',
    'users.userFound': 'utilisateur(s) trouvé(s)',
    
    // Stock Alerts
    'alerts.title': 'Alertes de Stock',
    'alerts.subtitle': 'Articles nécessitant une attention',
    'alerts.totalAlerts': 'Total alertes',
    'alerts.outOfStock': 'Stock épuisé',
    'alerts.veryLowStock': 'Stock très bas',
    'alerts.lowStock': 'Stock bas',
    'alerts.replenish': 'Réapprovisionner',
    'alerts.processed': 'Traité',
    'alerts.ignore': 'Ignorer',
    'alerts.replenishStock': 'Réapprovisionner le stock',
    'alerts.quantityToAdd': 'Quantité à ajouter',
    'alerts.currentStock': 'Stock actuel',
    'alerts.replenishConfirm': 'Réapprovisionner',
    
    // Theme
    'theme.light': 'Mode clair',
    'theme.dark': 'Mode sombre',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.catalogue': 'Catalog',
    'nav.newArticle': 'New Article',
    'nav.newSale': 'New Sale',
    'nav.stockAlerts': 'Stock Alerts',
    'nav.statistics': 'Statistics',
    'nav.recentSales': 'Recent Sales',
    'nav.stockMovements': 'Stock Movements',
    'nav.freeFeatures': 'Free Features',
    'nav.users': 'Users',
    'nav.usersManagement': 'User Management',
    'nav.settings': 'Settings',
    'nav.home': 'Home',
    'nav.logout': 'Logout',
    'nav.toggleMenu': 'Show menu',
    'nav.hideMenu': 'Hide menu',
    
    // Common
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.view': 'View',
    'common.details': 'Details',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalArticles': 'Total Articles',
    'dashboard.totalStock': 'Total Stock',
    'dashboard.lowStock': 'Low Stock',
    'dashboard.recentSales': 'Recent Sales',
    'dashboard.viewAllAlerts': 'View all alerts',
    'dashboard.viewAllSales': 'View all sales',
    
    // Users Management
    'users.title': 'User Management',
    'users.subtitle': 'Manage administrator and seller accounts',
    'users.totalUsers': 'Total Users',
    'users.administrators': 'Administrators',
    'users.sellers': 'Sellers',
    'users.activeUsers': 'Active Users',
    'users.addUser': 'Add user',
    'users.firstName': 'First Name',
    'users.lastName': 'Last Name',
    'users.email': 'Email',
    'users.phone': 'Phone',
    'users.role': 'Role',
    'users.password': 'Password',
    'users.role.seller': 'Seller',
    'users.role.admin': 'Administrator',
    'users.userList': 'User List',
    'users.userFound': 'user(s) found',
    
    // Stock Alerts
    'alerts.title': 'Stock Alerts',
    'alerts.subtitle': 'Items requiring attention',
    'alerts.totalAlerts': 'Total alerts',
    'alerts.outOfStock': 'Out of stock',
    'alerts.veryLowStock': 'Very low stock',
    'alerts.lowStock': 'Low stock',
    'alerts.replenish': 'Replenish',
    'alerts.processed': 'Processed',
    'alerts.ignore': 'Ignore',
    'alerts.replenishStock': 'Replenish stock',
    'alerts.quantityToAdd': 'Quantity to add',
    'alerts.currentStock': 'Current stock',
    'alerts.replenishConfirm': 'Replenish',
    
    // Theme
    'theme.light': 'Light mode',
    'theme.dark': 'Dark mode',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Vérifier la langue sauvegardée dans localStorage
    const savedLanguage = localStorage.getItem('stockchic-language') as Language;
    return savedLanguage || 'fr';
  });

  useEffect(() => {
    // Sauvegarder la langue dans localStorage
    localStorage.setItem('stockchic-language', language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

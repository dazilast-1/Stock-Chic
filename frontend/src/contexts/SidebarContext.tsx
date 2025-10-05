import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpenState] = useState<boolean>(() => {
    // Vérifier l'état sauvegardé dans localStorage
    const savedState = localStorage.getItem('stockchic-sidebar-open');
    return savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    // Sauvegarder l'état dans localStorage
    localStorage.setItem('stockchic-sidebar-open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpenState(prev => !prev);
  };

  const setSidebarOpen = (open: boolean) => {
    setSidebarOpenState(open);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

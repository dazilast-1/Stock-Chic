import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ArticleWithDeclinaisons, Declinaison } from '../types/stock.types';

export interface CartItem {
  id: string;
  article: ArticleWithDeclinaisons;
  declinaison: Declinaison;
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (article: ArticleWithDeclinaisons, declinaison: Declinaison, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Charger le panier depuis localStorage
    const savedCart = localStorage.getItem('stockchic-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        return parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Sauvegarder le panier dans localStorage
    localStorage.setItem('stockchic-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (article: ArticleWithDeclinaisons, declinaison: Declinaison, quantity: number) => {
    const itemId = `${article.id}-${declinaison.id}`;
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      
      if (existingItem) {
        // Mettre à jour la quantité si l'item existe déjà
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Ajouter un nouvel item
        const newItem: CartItem = {
          id: itemId,
          article,
          declinaison,
          quantity,
          addedAt: new Date()
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.article.prix_vente * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

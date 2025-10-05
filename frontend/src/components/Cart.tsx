import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simuler le traitement de la commande
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici, vous pouvez ajouter la logique pour créer une vente
      alert(`Commande traitée avec succès ! Total: ${getTotalPrice().toFixed(2)} €`);
      
      clearCart();
      onClose();
    } catch (error) {
      alert('Erreur lors du traitement de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Panier ({getTotalItems()} article{getTotalItems() > 1 ? 's' : ''})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full max-h-[calc(90vh-140px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ajoutez des articles depuis le catalogue
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Image */}
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        {item.article.photos && item.article.photos.length > 0 ? (
                          <img
                            src={item.article.photos[0].url}
                            alt={item.article.nom}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-8 h-8 text-gray-400">📦</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {item.article.nom}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.declinaison.taille} - {item.declinaison.couleur}
                        </p>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {item.article.prix_vente.toFixed(2)} €
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          disabled={item.quantity >= item.declinaison.quantite}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {getTotalPrice().toFixed(2)} €
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1"
                  >
                    Vider le panier
                  </Button>
                  <Button
                    onClick={handleProcessOrder}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Traitement...' : 'Finaliser la commande'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

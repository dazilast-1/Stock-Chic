import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Package,
  ShoppingCart,
  RefreshCw,
  Eye,
  Plus,
  TrendingDown,
  CheckCircle,
  XCircle,
  Edit,
  Truck,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { apiClient } from '../api/client';
import Button from '../components/ui/Button';

interface StockAlert {
  article: {
    id: string;
    nom: string;
    reference: string;
  };
  declinaison: {
    id: string;
    taille: string;
    couleur: string;
    quantite: number;
    quantite_min: number;
    code_barre?: string;
  };
}

const StockAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [processedAlerts, setProcessedAlerts] = useState<Set<string>>(new Set());
  const [showReplenishmentModal, setShowReplenishmentModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<StockAlert | null>(null);
  const [replenishmentQuantity, setReplenishmentQuantity] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/articles/alerts/stock-bas');
      console.log('Alertes response:', response.data);
      
      // Adapter les données pour correspondre à l'interface attendue
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const adaptedAlerts = response.data.data.map((alert: any) => ({
          article: {
            id: alert.article_id,
            nom: alert.nom,
            reference: alert.reference
          },
          declinaison: {
            id: alert.declinaison_id,
            taille: alert.taille,
            couleur: alert.couleur,
            quantite: alert.quantite,
            quantite_min: alert.quantite_min,
            code_barre: alert.code_barre
          }
        }));
        setAlerts(adaptedAlerts);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAlert = (alertId: string) => {
    setProcessedAlerts(prev => new Set([...prev, alertId]));
    alert('Alerte marquée comme traitée !');
  };

  const handleReplenishStock = (alert: StockAlert) => {
    setSelectedAlert(alert);
    setReplenishmentQuantity('');
    setShowReplenishmentModal(true);
  };

  const confirmReplenishment = async () => {
    if (!selectedAlert || !replenishmentQuantity || parseInt(replenishmentQuantity) <= 0) {
      alert('Veuillez saisir une quantité valide');
      return;
    }

    try {
      // Simuler l'ajout de stock
      const newQuantity = selectedAlert.declinaison.quantite + parseInt(replenishmentQuantity);
      
      // Mettre à jour l'alerte localement
      setAlerts(prev => prev.map(alert => 
        alert.declinaison.id === selectedAlert.declinaison.id
          ? {
              ...alert,
              declinaison: {
                ...alert.declinaison,
                quantite: newQuantity
              }
            }
          : alert
      ));

      setShowReplenishmentModal(false);
      setSelectedAlert(null);
      setReplenishmentQuantity('');
      
      alert(`Stock réapprovisionné ! ${replenishmentQuantity} unités ajoutées. Nouveau stock : ${newQuantity}`);
    } catch (error) {
      console.error('Erreur lors du réapprovisionnement:', error);
      alert('Erreur lors du réapprovisionnement');
    }
  };

  const handleIgnoreAlert = (alertId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir ignorer cette alerte ?')) {
      setProcessedAlerts(prev => new Set([...prev, alertId]));
      alert('Alerte ignorée');
    }
  };

  const getAlertLevel = (quantite: number, quantiteMin: number) => {
    // Vérification de sécurité
    if (typeof quantite !== 'number' || typeof quantiteMin !== 'number') {
      return { level: 'medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    }
    
    if (quantite === 0) return { level: 'critical', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (quantite <= quantiteMin / 2) return { level: 'high', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { level: 'medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  };

  const getAlertLabel = (level: string) => {
    switch (level) {
      case 'critical': return 'Stock épuisé';
      case 'high': return 'Stock très bas';
      case 'medium': return 'Stock bas';
      default: return 'Stock bas';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Alertes de Stock</h2>
          <p className="text-gray-600">Articles nécessitant un réapprovisionnement</p>
        </div>
        <Button onClick={fetchAlerts} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total alertes</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock épuisé</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(alert => alert.declinaison.quantite === 0).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock très bas</p>
                <p className="text-2xl font-bold text-orange-600">
                  {alerts.filter(alert => {
                    const { level } = getAlertLevel(alert.declinaison.quantite, alert.declinaison.quantite_min);
                    return level === 'high';
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock bas</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.filter(alert => {
                    const { level } = getAlertLevel(alert.declinaison.quantite, alert.declinaison.quantite_min);
                    return level === 'medium';
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Articles en alerte</span>
          </CardTitle>
          <CardDescription>
            {alerts.length} article(s) nécessitant une attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune alerte de stock
              </h3>
              <p className="text-gray-600">
                Tous vos articles ont un stock suffisant. Excellent travail !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => {
                // Vérification de sécurité pour les données de l'alerte
                if (!alert || !alert.declinaison || !alert.article) {
                  return null;
                }
                
                const { level, color, bgColor } = getAlertLevel(
                  alert.declinaison.quantite || 0, 
                  alert.declinaison.quantite_min || 0
                );
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                        <Package className={`w-6 h-6 ${color}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{alert.article.nom}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${color}`}>
                            {getAlertLabel(level)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Référence: {alert.article.reference}
                        </p>
                        <p className="text-sm text-gray-500">
                          {alert.declinaison.taille} - {alert.declinaison.couleur}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${color}`}>
                        {alert.declinaison.quantite}
                      </div>
                      <div className="text-sm text-gray-500">
                        Seuil: {alert.declinaison.quantite_min}
                      </div>
                      <div className="text-xs text-gray-400">
                        Manque: {Math.max(0, alert.declinaison.quantite_min - alert.declinaison.quantite)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!processedAlerts.has(`${alert.article.id}-${alert.declinaison.id}`) ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => handleReplenishStock(alert)}
                          >
                            <Truck className="w-4 h-4" />
                            <span>Réapprovisionner</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => handleProcessAlert(`${alert.article.id}-${alert.declinaison.id}`)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Traité</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center space-x-1 text-gray-500"
                            onClick={() => handleIgnoreAlert(`${alert.article.id}-${alert.declinaison.id}`)}
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Ignorer</span>
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Traitée</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions recommandées */}
      {alerts.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">
              Actions recommandées
            </CardTitle>
            <CardDescription className="text-orange-700">
              Voici ce que nous vous recommandons de faire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">1</span>
                </div>
                <p className="text-orange-800">
                  Vérifiez les articles en stock épuisé et commandez immédiatement
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">2</span>
                </div>
                <p className="text-orange-800">
                  Planifiez les commandes pour les articles en stock bas
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">3</span>
                </div>
                <p className="text-orange-800">
                  Ajustez les seuils d'alerte si nécessaire
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de réapprovisionnement */}
      {showReplenishmentModal && selectedAlert && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Réapprovisionner le stock</h3>
              <button
                onClick={() => setShowReplenishmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Article: <span className="font-medium">{selectedAlert.article.nom}</span></p>
              <p className="text-sm text-gray-600 mb-2">Référence: <span className="font-medium">{selectedAlert.article.reference}</span></p>
              <p className="text-sm text-gray-600 mb-2">Déclinaison: <span className="font-medium">{selectedAlert.declinaison.taille} - {selectedAlert.declinaison.couleur}</span></p>
              <p className="text-sm text-gray-600 mb-4">Stock actuel: <span className="font-medium text-red-600">{selectedAlert.declinaison.quantite}</span></p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité à ajouter
              </label>
              <input
                type="number"
                min="1"
                value={replenishmentQuantity}
                onChange={(e) => setReplenishmentQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Quantité..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReplenishmentModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmReplenishment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Truck className="w-4 h-4" />
                <span>Réapprovisionner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAlerts;


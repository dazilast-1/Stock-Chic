import React, { useState } from 'react';
import { Users as UsersIcon, Plus, Edit, Trash2, Mail, Phone, Shield, Search, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'gerant' | 'vendeur';
  statut: 'actif' | 'inactif';
  dateCreation: string;
}

const VendorsManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    role: 'vendeur' as 'gerant' | 'vendeur',
  });

  // Données de démonstration
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      nom: 'Admin',
      prenom: 'Principal',
      email: 'admin@stockchic.com',
      telephone: '+33 6 12 34 56 78',
      role: 'gerant',
      statut: 'actif',
      dateCreation: '2024-01-01',
    },
    {
      id: '2',
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@stockchic.com',
      telephone: '+33 6 12 34 56 78',
      role: 'vendeur',
      statut: 'actif',
      dateCreation: '2024-01-15',
    },
    {
      id: '3',
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'pierre.martin@stockchic.com',
      telephone: '+33 6 98 76 54 32',
      role: 'vendeur',
      statut: 'actif',
      dateCreation: '2024-02-20',
    },
    {
      id: '4',
      nom: 'Bernard',
      prenom: 'Sophie',
      email: 'sophie.bernard@stockchic.com',
      telephone: '+33 6 45 67 89 01',
      role: 'vendeur',
      statut: 'inactif',
      dateCreation: '2024-03-10',
    },
    {
      id: '5',
      nom: 'Admin',
      prenom: 'Second',
      email: 'admin2@stockchic.com',
      telephone: '+33 6 55 66 77 88',
      role: 'gerant',
      statut: 'actif',
      dateCreation: '2024-03-15',
    },
  ]);

  // Vérifier si l'utilisateur est gérant
  if (user?.role !== 'gerant') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Seuls les gérants peuvent accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      role: formData.role,
      statut: 'actif',
      dateCreation: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '', role: 'vendeur' });
  };

  const handleEditVendor = () => {
    if (!selectedVendor || !formData.nom || !formData.prenom || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setVendors(vendors.map(v =>
      v.id === selectedVendor.id
        ? { ...v, nom: formData.nom, prenom: formData.prenom, email: formData.email, telephone: formData.telephone }
        : v
    ));

    setShowEditModal(false);
    setSelectedVendor(null);
    setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '' });
  };

  const handleDeleteVendor = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vendeur ?')) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  const toggleVendorStatus = (id: string) => {
    setVendors(vendors.map(v =>
      v.id === id ? { ...v, statut: v.statut === 'actif' ? 'inactif' : 'actif' } : v
    ));
  };

  const openEditModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      nom: vendor.nom,
      prenom: vendor.prenom,
      email: vendor.email,
      telephone: vendor.telephone,
      password: '',
    });
    setShowEditModal(true);
  };

  const activeVendors = vendors.filter(v => v.statut === 'actif').length;
  const inactiveVendors = vendors.filter(v => v.statut === 'inactif').length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Vendeurs</h1>
          <p className="text-gray-600 mt-1">Gérez les comptes vendeurs de votre boutique</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Ajouter un vendeur</span>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendeurs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{vendors.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendeurs Actifs</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{activeVendors}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendeurs Inactifs</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{inactiveVendors}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <UsersIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un vendeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des vendeurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Vendeurs</CardTitle>
          <CardDescription>{filteredVendors.length} vendeur(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {vendor.prenom[0]}{vendor.nom[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vendor.prenom} {vendor.nom}
                          </div>
                          <div className="text-sm text-gray-500">Vendeur</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {vendor.email}
                      </div>
                      {vendor.telephone && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {vendor.telephone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVendorStatus(vendor.id)}
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vendor.statut === 'actif'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors cursor-pointer`}
                      >
                        {vendor.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vendor.dateCreation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(vendor)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun vendeur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Ajouter un vendeur */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ajouter un vendeur</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="vendeur@stockchic.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '' });
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleAddVendor}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier un vendeur */}
      {showEditModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Modifier le vendeur</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedVendor(null);
                  setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe (laisser vide pour ne pas changer)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedVendor(null);
                  setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '' });
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleEditVendor}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsManagement;

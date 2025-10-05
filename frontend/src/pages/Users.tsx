import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  Plus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  Mail,
  Calendar,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

interface UserData {
  id: string;
  email: string;
  role: 'gerant' | 'vendeur';
  created_at: string;
  last_login?: string;
  status: 'active' | 'inactive';
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Données simulées pour la démo
  const users: UserData[] = [
    {
      id: '1',
      email: 'admin@stockchic.com',
      role: 'gerant',
      created_at: '2024-01-15T10:00:00Z',
      last_login: '2024-10-03T10:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      email: 'marie.dubois@boutique.com',
      role: 'vendeur',
      created_at: '2024-02-20T14:30:00Z',
      last_login: '2024-10-02T16:45:00Z',
      status: 'active'
    },
    {
      id: '3',
      email: 'pierre.martin@boutique.com',
      role: 'vendeur',
      created_at: '2024-03-10T09:15:00Z',
      last_login: '2024-09-28T11:20:00Z',
      status: 'inactive'
    },
    {
      id: '4',
      email: 'sophie.bernard@boutique.com',
      role: 'vendeur',
      created_at: '2024-04-05T13:45:00Z',
      last_login: '2024-10-01T08:30:00Z',
      status: 'active'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    return role === 'gerant' 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    gerants: users.filter(u => u.role === 'gerant').length,
    vendeurs: users.filter(u => u.role === 'vendeur').length
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
          <p className="text-gray-600">Gérez les accès et permissions de votre équipe</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter un utilisateur</span>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gérants</p>
                <p className="text-2xl font-bold text-purple-600">{stats.gerants}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendeurs</p>
                <p className="text-2xl font-bold text-blue-600">{stats.vendeurs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les rôles</option>
                <option value="gerant">Gérants</option>
                <option value="vendeur">Vendeurs</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UsersIcon className="w-5 h-5 text-gray-600" />
            <span>Utilisateurs</span>
          </CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{user.email}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                        {user.role === 'gerant' ? 'Gérant' : 'Vendeur'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Créé le {formatDate(user.created_at)}</span>
                      </div>
                      {user.last_login && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>Dernière connexion: {formatDate(user.last_login)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300">
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations sur les rôles */}
      <Card>
        <CardHeader>
          <CardTitle>Rôles et Permissions</CardTitle>
          <CardDescription>
            Comprendre les différents niveaux d'accès
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Gérant</h3>
              </div>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• Accès complet à toutes les fonctionnalités</li>
                <li>• Gestion des utilisateurs et permissions</li>
                <li>• Accès aux rapports et statistiques</li>
                <li>• Configuration des paramètres système</li>
                <li>• Gestion des commandes et fournisseurs</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <UsersIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Vendeur</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Consultation du stock et des articles</li>
                <li>• Enregistrement des ventes</li>
                <li>• Mise à jour des quantités en stock</li>
                <li>• Accès aux alertes de stock bas</li>
                <li>• Consultation des mouvements de stock</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;

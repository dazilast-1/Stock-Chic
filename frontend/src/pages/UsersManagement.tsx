import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Shield, 
  Search, 
  X,
  UserCheck,
  UserX,
  Crown,
  User,
  Upload,
  Image
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import FileInput from '../components/ui/FileInput';

interface UserData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'gerant' | 'vendeur';
  statut: 'actif' | 'inactif';
  dateCreation: string;
  profile_photo?: string;
}

const UsersManagement: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    role: 'vendeur' as 'gerant' | 'vendeur',
    profile_photo: '',
  });

  // Données de démonstration
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      nom: 'Admin',
      prenom: 'Principal',
      email: 'admin@stockchic.com',
      telephone: '+33 6 12 34 56 78',
      role: 'gerant',
      statut: 'actif',
      dateCreation: '2024-01-01',
      profile_photo: '/images/profiles/admin.jpg',
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
      profile_photo: '/images/profiles/marie.jpg',
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
      profile_photo: '/images/profiles/pierre.jpg',
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
      profile_photo: '/images/profiles/sophie.jpg',
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
      profile_photo: '/images/profiles/admin2.jpg',
    },
  ]);

  // Vérifier si l'utilisateur est gérant
  if (user?.role !== 'gerant') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Seuls les gérants peuvent gérer les utilisateurs.</p>
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

    const newUser: UserData = {
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
    setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '', role: 'vendeur', profile_photo: '' });
    alert('Utilisateur ajouté avec succès !');
  };

  const handleEditUser = (userData: UserData) => {
    setSelectedUser(userData);
    setFormData({
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      telephone: userData.telephone,
      password: '',
      role: userData.role,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser || !formData.nom || !formData.prenom || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setUsers(users.map(u =>
      u.id === selectedUser.id
        ? { 
            ...u, 
            nom: formData.nom, 
            prenom: formData.prenom, 
            email: formData.email, 
            telephone: formData.telephone,
            role: formData.role
          }
        : u
    ));

    setShowEditModal(false);
    setSelectedUser(null);
    setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '', role: 'vendeur', profile_photo: '' });
    alert('Utilisateur modifié avec succès !');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, statut: u.statut === 'actif' ? 'inactif' : 'actif' }
        : u
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== userId));
      alert('Utilisateur supprimé avec succès !');
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'gerant' ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    return role === 'gerant' ? 'text-purple-600 bg-purple-100' : 'text-blue-600 bg-blue-100';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('users.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('users.subtitle')}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>{t('users.addUser')}</span>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-primary-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administrateurs</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'gerant').length}</p>
            </div>
            <Crown className="w-8 h-8 text-purple-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendeurs</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'vendeur').length}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.statut === 'actif').length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <Input
          icon={Search}
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>{filteredUsers.length} utilisateur(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userData) => (
                  <tr key={userData.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          {userData.profile_photo ? (
                            <img
                              src={userData.profile_photo}
                              alt={`${userData.prenom} ${userData.nom}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-semibold">
                              {userData.prenom.charAt(0)}{userData.nom.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{userData.prenom} {userData.nom}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center space-x-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{userData.email}</span>
                      </div>
                      {userData.telephone && (
                        <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{userData.telephone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userData.role)}`}>
                        {getRoleIcon(userData.role)}
                        <span className="ml-1">{userData.role === 'gerant' ? 'Administrateur' : 'Vendeur'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant={userData.statut === 'actif' ? 'success' : 'destructive'}
                        size="sm"
                        onClick={() => handleToggleStatus(userData.id)}
                      >
                        {userData.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(userData.dateCreation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditUser(userData)}
                        >
                          <Edit className="w-4 h-4 mr-1" /> Modifier
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteUser(userData.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <Card className="p-6 w-full max-w-md mx-auto">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Ajouter un utilisateur</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Prénom *"
                  placeholder="Jean"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                />
                <Input
                  label="Nom *"
                  placeholder="Dupont"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
                <Input
                  label="Email *"
                  placeholder="utilisateur@stockchic.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Téléphone (optionnel)"
                  placeholder="+33 6 12 34 56 78"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
                <Select
                  label="Rôle *"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'gerant' | 'vendeur' })}
                  options={[
                    { value: 'vendeur', label: 'Vendeur' },
                    { value: 'gerant', label: 'Administrateur' },
                  ]}
                />
                <Input
                  label="Mot de passe *"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                
                {/* Upload photo de profil */}
                <FileInput
                  label="Photo de profil (optionnel)"
                  accept="image/*"
                  preview={formData.profile_photo || null}
                  onChange={(files) => {
                    const file = files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({ ...formData, profile_photo: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onRemovePreview={() => setFormData({ ...formData, profile_photo: '' })}
                />
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser}>Ajouter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <Card className="p-6 w-full max-w-md mx-auto">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Modifier l'utilisateur</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Prénom *"
                  placeholder="Jean"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                />
                <Input
                  label="Nom *"
                  placeholder="Dupont"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
                <Input
                  label="Email *"
                  placeholder="utilisateur@stockchic.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Téléphone (optionnel)"
                  placeholder="+33 6 12 34 56 78"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
                <Select
                  label="Rôle *"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'gerant' | 'vendeur' })}
                  options={[
                    { value: 'vendeur', label: 'Vendeur' },
                    { value: 'gerant', label: 'Administrateur' },
                  ]}
                />
                <Input
                  label="Nouveau mot de passe (optionnel)"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateUser}>Modifier</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;

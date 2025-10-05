import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save,
  Package,
  LogOut,
  Upload,
  Image,
  Star,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';
import { 
  CreateArticleRequest, 
  UpdateArticleRequest, 
  ArticleWithDeclinaisons,
  CollectionType,
  TailleType,
  TAILLE_OPTIONS,
  COLLECTION_OPTIONS
} from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface DeclinaisonForm {
  taille: TailleType;
  couleur: string;
  quantite: number;
  quantite_min: number;
  code_barre: string;
}

interface PhotoForm {
  file: File | null;
  url: string;
  alt_text: string;
  is_primary: boolean;
}

interface ArticleFormData {
  reference: string;
  nom: string;
  marque: string;
  collection: CollectionType;
  prix_achat: number;
  prix_vente: number;
  declinaisons: DeclinaisonForm[];
  photos: PhotoForm[];
}

const ArticleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<ArticleWithDeclinaisons | null>(null);
  const isEdit = !!id;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ArticleFormData>({
    defaultValues: {
      reference: '',
      nom: '',
      marque: '',
      collection: 'HIVER_2024',
      prix_achat: 0,
      prix_vente: 0,
      declinaisons: [
        {
          taille: 'M',
          couleur: '',
          quantite: 0,
          quantite_min: 5,
          code_barre: '',
        },
      ],
      photos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'declinaisons',
  });

  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({
    control,
    name: 'photos',
  });

  // Charger l'article en mode édition
  useEffect(() => {
    if (isEdit && id) {
      const loadArticle = async () => {
        try {
          const articleData = await apiClient.getArticleById(id);
          setArticle(articleData);
          
          reset({
            reference: articleData.reference,
            nom: articleData.nom,
            marque: articleData.marque || '',
            collection: articleData.collection,
            prix_achat: articleData.prix_achat,
            prix_vente: articleData.prix_vente,
            declinaisons: articleData.declinaisons.map(d => ({
              taille: d.taille,
              couleur: d.couleur,
              quantite: d.quantite,
              quantite_min: d.quantite_min,
              code_barre: d.code_barre || '',
            })),
          });
        } catch (error) {
          console.error('Erreur lors du chargement de l\'article:', error);
          navigate('/articles');
        }
      };

      loadArticle();
    }
  }, [id, isEdit, navigate, reset]);

  const onSubmit = async (data: ArticleFormData) => {
    try {
      setLoading(true);

      if (isEdit && id) {
        // Mise à jour
        const updateData: UpdateArticleRequest = {
          nom: data.nom,
          marque: data.marque,
          collection: data.collection,
          prix_achat: data.prix_achat,
          prix_vente: data.prix_vente,
        };
        await apiClient.updateArticle(id, updateData);
      } else {
        // Création
        const createData: CreateArticleRequest = {
          reference: data.reference,
          nom: data.nom,
          marque: data.marque,
          collection: data.collection,
          prix_achat: data.prix_achat,
          prix_vente: data.prix_vente,
          declinaisons: data.declinaisons.map(d => ({
            taille: d.taille,
            couleur: d.couleur,
            quantite: d.quantite,
            quantite_min: d.quantite_min,
            code_barre: d.code_barre || undefined,
          })),
        };
        await apiClient.createArticle(createData);
      }

      navigate('/articles');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour gérer les photos
  const handlePhotoUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setValue(`photos.${index}.file`, file);
      setValue(`photos.${index}.url`, url);
      setValue(`photos.${index}.alt_text`, file.name);
    };
    reader.readAsDataURL(file);
  };

  const addPhoto = () => {
    appendPhoto({
      file: null,
      url: '',
      alt_text: '',
      is_primary: photoFields.length === 0,
    });
  };

  const setPrimaryPhoto = (index: number) => {
    photoFields.forEach((_, i) => {
      setValue(`photos.${i}.is_primary`, i === index);
    });
  };

  const addDeclinaison = () => {
    append({
      taille: 'M',
      couleur: '',
      quantite: 0,
      quantite_min: 5,
      code_barre: '',
    });
  };

  const removeDeclinaison = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/articles')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-2xl font-bold text-secondary-900">
                {isEdit ? 'Modifier l\'article' : 'Nouvel article'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-600">
                {user?.email}
              </span>
              <span className="badge badge-primary">
                {user?.role === 'gerant' ? 'Gérant' : 'Vendeur'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Informations générales</span>
              </CardTitle>
              <CardDescription>
                Détails de base de l'article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Référence"
                  placeholder="REF-001"
                  error={errors.reference?.message}
                  disabled={isEdit}
                  {...register('reference', {
                    required: 'La référence est requise',
                    pattern: {
                      value: /^[A-Z0-9-_]+$/,
                      message: 'La référence ne peut contenir que des lettres majuscules, chiffres, tirets et underscores',
                    },
                  })}
                />
                <Input
                  label="Nom de l'article"
                  placeholder="T-shirt Basic"
                  error={errors.nom?.message}
                  {...register('nom', {
                    required: 'Le nom est requis',
                    minLength: {
                      value: 2,
                      message: 'Le nom doit contenir au moins 2 caractères',
                    },
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Marque"
                  placeholder="Nike, Adidas, etc."
                  error={errors.marque?.message}
                  {...register('marque')}
                />
                <Select
                  label="Collection"
                  options={COLLECTION_OPTIONS}
                  error={errors.collection?.message}
                  {...register('collection', {
                    required: 'La collection est requise',
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prix d'achat (€)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="25.00"
                  error={errors.prix_achat?.message}
                  {...register('prix_achat', {
                    required: 'Le prix d\'achat est requis',
                    min: {
                      value: 0,
                      message: 'Le prix d\'achat doit être positif',
                    },
                    valueAsNumber: true,
                  })}
                />
                <Input
                  label="Prix de vente (€)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="45.00"
                  error={errors.prix_vente?.message}
                  {...register('prix_vente', {
                    required: 'Le prix de vente est requis',
                    min: {
                      value: 0,
                      message: 'Le prix de vente doit être positif',
                    },
                    valueAsNumber: true,
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span>Photos du produit</span>
                  </CardTitle>
                  <CardDescription>
                    Ajoutez des photos pour votre article
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPhoto}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une photo</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {photoFields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucune photo ajoutée</p>
                  <p className="text-sm">Cliquez sur "Ajouter une photo" pour commencer</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photoFields.map((field, index) => (
                    <div key={field.id} className="relative border rounded-lg p-4">
                      {/* Aperçu de l'image */}
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {watch(`photos.${index}.url`) ? (
                          <img
                            src={watch(`photos.${index}.url`)}
                            alt={watch(`photos.${index}.alt_text`) || 'Aperçu'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Bouton de suppression */}
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Bouton photo principale */}
                      {watch(`photos.${index}.is_primary`) && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full p-1">
                          <Star className="w-3 h-3" />
                        </div>
                      )}

                      {/* Upload de fichier */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoUpload(index, file);
                          }
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />

                      {/* Alt text */}
                      <Input
                        label="Description de l'image"
                        placeholder="Description de la photo..."
                        className="mt-2"
                        {...register(`photos.${index}.alt_text`)}
                      />

                      {/* Bouton photo principale */}
                      {!watch(`photos.${index}.is_primary`) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPrimaryPhoto(index)}
                          className="w-full mt-2"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Définir comme photo principale
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Déclinaisons */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Déclinaisons</CardTitle>
                  <CardDescription>
                    Tailles, couleurs et quantités en stock
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDeclinaison}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-secondary-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-secondary-900">
                        Déclinaison {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDeclinaison(index)}
                          className="text-error-600 hover:text-error-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <Select
                        label="Taille"
                        options={TAILLE_OPTIONS}
                        error={errors.declinaisons?.[index]?.taille?.message}
                        {...register(`declinaisons.${index}.taille`, {
                          required: 'La taille est requise',
                        })}
                      />

                      <Input
                        label="Couleur"
                        placeholder="Blanc, Noir, etc."
                        error={errors.declinaisons?.[index]?.couleur?.message}
                        {...register(`declinaisons.${index}.couleur`, {
                          required: 'La couleur est requise',
                        })}
                      />

                      <Input
                        label="Quantité"
                        type="number"
                        min="0"
                        placeholder="10"
                        error={errors.declinaisons?.[index]?.quantite?.message}
                        {...register(`declinaisons.${index}.quantite`, {
                          required: 'La quantité est requise',
                          min: {
                            value: 0,
                            message: 'La quantité doit être positive',
                          },
                          valueAsNumber: true,
                        })}
                      />

                      <Input
                        label="Seuil minimum"
                        type="number"
                        min="0"
                        placeholder="5"
                        error={errors.declinaisons?.[index]?.quantite_min?.message}
                        {...register(`declinaisons.${index}.quantite_min`, {
                          required: 'Le seuil minimum est requis',
                          min: {
                            value: 0,
                            message: 'Le seuil minimum doit être positif',
                          },
                          valueAsNumber: true,
                        })}
                      />

                      <Input
                        label="Code-barres"
                        placeholder="1234567890123"
                        error={errors.declinaisons?.[index]?.code_barre?.message}
                        {...register(`declinaisons.${index}.code_barre`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/articles')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Mettre à jour' : 'Créer l\'article'}</span>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ArticleForm;

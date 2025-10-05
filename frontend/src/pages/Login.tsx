import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearErrors();
      
      if (isLoginMode) {
        await login(data.email, data.password);
      } else {
        await register(data.email, data.password);
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Une erreur est survenue',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Chic</h1>
          <p className="text-gray-600">
            Gestion de stock pour boutiques indépendantes
          </p>
        </div>

        {/* Formulaire */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLoginMode ? 'Connexion' : 'Inscription'}
            </CardTitle>
            <CardDescription>
              {isLoginMode 
                ? 'Connectez-vous à votre compte' 
                : 'Créez votre compte pour commencer'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <Input
                label="Adresse email"
                type="email"
                placeholder="votre@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...registerForm('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format d\'email invalide',
                  },
                })}
              />

              {/* Mot de passe */}
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-secondary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...registerForm('password', {
                  required: 'Le mot de passe est requis',
                  minLength: {
                    value: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères',
                  },
                })}
              />

              {/* Erreur générale */}
              {errors.root && (
                <div className="alert alert-error">
                  <p className="text-sm">{errors.root.message}</p>
                </div>
              )}

              {/* Bouton de soumission */}
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                size="lg"
              >
                {isLoginMode ? 'Se connecter' : 'S\'inscrire'}
              </Button>

              {/* Lien pour changer de mode */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    clearErrors();
                  }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                >
                  {isLoginMode 
                    ? 'Pas de compte ? Créer un compte' 
                    : 'Déjà un compte ? Se connecter'
                  }
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informations supplémentaires */}
        <div className="mt-8 text-center">
          <p className="text-sm text-secondary-500">
            Application de gestion de stock optimisée pour les tablettes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

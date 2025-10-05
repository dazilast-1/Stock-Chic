import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Award, 
  Star,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Shield,
  Clock,
  Heart,
  LogIn,
  Zap,
  Smartphone,
  Globe,
  Lock,
  Headphones,
  Download,
  Play,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  DollarSign,
  Calendar,
  Target,
  PieChart,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingDown,
  Eye,
  MousePointer,
  Database,
  Cloud,
  Wifi,
  CreditCard,
  FileText,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share2,
  MessageSquare,
  Video,
  Image,
  File,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Propriétaire, Boutique Élégance",
      content: "Stock Chic a révolutionné la gestion de ma boutique. Plus de perte de temps à chercher les articles, tout est organisé et accessible en quelques clics !",
      rating: 5,
      avatar: "MD"
    },
    {
      name: "Sophie Martin",
      role: "Gérante, Mode & Style",
      content: "L'interface est intuitive et les alertes de stock bas m'ont fait économiser des milliers d'euros. Je recommande vivement !",
      rating: 5,
      avatar: "SM"
    },
    {
      name: "Claire Rousseau",
      role: "Directrice, Fashion Store",
      content: "Depuis que j'utilise Stock Chic, mes ventes ont augmenté de 30%. La gestion des stocks n'a jamais été aussi simple.",
      rating: 5,
      avatar: "CR"
    },
    {
      name: "Julie Moreau",
      role: "Propriétaire, Chic & Moderne",
      content: "Un outil indispensable pour toute boutique qui se respecte. L'équipe support est également au top !",
      rating: 5,
      avatar: "JM"
    },
    {
      name: "Anne Petit",
      role: "Gérante, Style & Co",
      content: "Interface moderne, fonctionnalités complètes, et surtout : ça marche parfaitement ! Mes employés l'ont adopté immédiatement.",
      rating: 5,
      avatar: "AP"
    },
    {
      name: "Camille Durand",
      role: "Propriétaire, Fashion Corner",
      content: "Stock Chic m'a fait gagner un temps précieux. Je peux me concentrer sur mes clients au lieu de gérer manuellement mon stock.",
      rating: 5,
      avatar: "CD"
    }
  ];

  const stats = [
    {
      number: "500+",
      label: "Boutiques nous font confiance",
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      number: "98%",
      label: "Satisfaction client",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      number: "€2.5M",
      label: "Économies générées",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      number: "24/7",
      label: "Support disponible",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Analytics Avancés",
      description: "Tableaux de bord détaillés et rapports personnalisés pour optimiser vos ventes",
      details: [
        "Rapports de vente en temps réel",
        "Analyse des tendances saisonnières",
        "Prédictions de stock basées sur l'IA",
        "Export Excel/PDF automatique"
      ]
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Vos données sont protégées avec un chiffrement de niveau bancaire",
      details: [
        "Chiffrement AES-256",
        "Sauvegarde automatique quotidienne",
        "Conformité RGPD",
        "Authentification 2FA"
      ]
    },
    {
      icon: Users,
      title: "Gestion Multi-utilisateurs",
      description: "Collaborez avec votre équipe grâce aux rôles et permissions",
      details: [
        "Rôles personnalisables (Admin, Vendeur, Manager)",
        "Permissions granulaires",
        "Historique des actions",
        "Notifications en temps réel"
      ]
    },
    {
      icon: Award,
      title: "Interface Intuitive",
      description: "Design moderne et ergonomique, adopté en quelques minutes",
      details: [
        "Design responsive (mobile/tablette/desktop)",
        "Raccourcis clavier",
        "Thèmes personnalisables",
        "Formation incluse"
      ]
    },
    {
      icon: Smartphone,
      title: "Application Mobile",
      description: "Gérez votre stock depuis n'importe où avec notre app mobile",
      details: [
        "Scan de codes-barres",
        "Notifications push",
        "Mode hors-ligne",
        "Synchronisation automatique"
      ]
    },
    {
      icon: Zap,
      title: "Automatisation",
      description: "Automatisez vos processus pour gagner du temps",
      details: [
        "Alertes de stock bas automatiques",
        "Commandes fournisseurs automatiques",
        "Rapports programmés",
        "Intégrations API"
      ]
    }
  ];


  const integrations = [
    { name: 'Shopify', icon: '🛍️', description: 'Synchronisez avec votre boutique en ligne' },
    { name: 'WooCommerce', icon: '🛒', description: 'Intégration native WordPress' },
    { name: 'PrestaShop', icon: '🏪', description: 'Solution e-commerce française' },
    { name: 'Magento', icon: '⚡', description: 'Plateforme e-commerce avancée' },
    { name: 'Comptabilité', icon: '📊', description: 'Sage, Ciel, EBP' },
    { name: 'Transporteurs', icon: '🚚', description: 'Colissimo, Chronopost, DHL' },
    { name: 'Paiement', icon: '💳', description: 'Stripe, PayPal, Square' },
    { name: 'Marketing', icon: '📧', description: 'Mailchimp, Sendinblue' }
  ];

  const faqData = [
    {
      question: "Comment migrer mes données existantes ?",
      answer: "Notre équipe vous accompagne gratuitement dans la migration de vos données. Nous supportons l'import depuis Excel, CSV, et la plupart des logiciels de gestion existants. Le processus prend généralement 1-2 jours ouvrables."
    },
    {
      question: "L'application est-elle vraiment gratuite ?",
      answer: "Oui ! Stock Chic est entièrement gratuit pour votre boutique. Aucune limitation, aucun frais caché, aucune publicité. Toutes les fonctionnalités professionnelles sont incluses."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement AES-256, des sauvegardes automatiques quotidiennes, et sommes conformes au RGPD. Vos données sont stockées sur des serveurs européens sécurisés."
    },
    {
      question: "Puis-je utiliser Stock Chic hors ligne ?",
      answer: "Oui, notre application mobile fonctionne en mode hors-ligne. Les données sont synchronisées automatiquement dès que vous retrouvez une connexion internet."
    },
    {
      question: "Quel support technique proposez-vous ?",
      answer: "Nous offrons un support complet par email et chat en direct. Nos experts répondent généralement en moins de 2 heures en heures ouvrables. Le support est inclus gratuitement."
    },
    {
      question: "Puis-je personnaliser les rapports ?",
      answer: "Oui, vous pouvez créer des rapports personnalisés avec les métriques qui vous intéressent. Vous pouvez aussi programmer l'envoi automatique de ces rapports par email."
    },
    {
      question: "Stock Chic fonctionne-t-il sur mobile ?",
      answer: "Oui, nous avons une application mobile native pour iOS et Android. Vous pouvez gérer votre stock, scanner des codes-barres, et recevoir des notifications push."
    },
    {
      question: "Que se passe-t-il si je veux annuler ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Vos données restent accessibles pendant 30 jours après l'annulation pour vous permettre de les exporter."
    }
  ];

  const featureShowcase = [
    {
      title: "Tableau de bord intelligent",
      description: "Vue d'ensemble complète de votre activité",
      image: "📊",
      features: ["Métriques en temps réel", "Graphiques interactifs", "Alertes personnalisées"]
    },
    {
      title: "Gestion des stocks",
      description: "Contrôle total de votre inventaire",
      image: "📦",
      features: ["Codes-barres", "Alertes de stock bas", "Inventaire automatique"]
    },
    {
      title: "Analytics avancés",
      description: "Décisions basées sur les données",
      image: "📈",
      features: ["Rapports personnalisés", "Prédictions IA", "Tendances saisonnières"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header global */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Stock Chic</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Bonjour, {user?.email}
                  </span>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      Tableau de bord
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      S'inscrire
                    </Button>
                  </Link>
                </>
              )}
              <LanguageToggle showLabel={false} />
              <ThemeToggle showLabel={false} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl">
              <Store className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Stock Chic
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              La solution de gestion de stock moderne pour boutiques indépendantes. 
              <span className="text-blue-600 dark:text-blue-400 font-semibold"> Optimisez vos ventes</span> et 
              <span className="text-purple-600 dark:text-purple-400 font-semibold"> simplifiez votre quotidien</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="btn-primary text-lg px-8 py-4">
                      Accéder à mon tableau de bord
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-gray-600">
                    Bonjour {user?.email} ! 👋
                  </p>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="btn-primary text-lg px-8 py-4">
                      Commencer gratuitement
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                    Voir la démo
                  </Button>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} dark:bg-gray-700 mb-4`}>
                    <stat.icon className={`w-8 h-8 ${stat.color} dark:text-gray-300`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi choisir Stock Chic ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des fonctionnalités pensées pour les boutiques modernes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités Détaillées */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez toutes les fonctionnalités qui font de Stock Chic la solution la plus complète
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Section Démonstration Interactive */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Découvrez Stock Chic en Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Voyez comment Stock Chic peut transformer votre gestion de stock
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {featureShowcase.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-white shadow-lg border-2 border-blue-500' 
                        : 'bg-white/50 hover:bg-white hover:shadow-md'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{item.image}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.features.map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{featureShowcase[activeFeature].image}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {featureShowcase[activeFeature].title}
                </h3>
                <p className="text-gray-600">
                  {featureShowcase[activeFeature].description}
                </p>
              </div>
              
              <div className="space-y-4">
                {featureShowcase[activeFeature].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button className="btn-primary">
                  <Play className="w-4 h-4 mr-2" />
                  Voir la démo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités Complètes */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solution Complète et Gratuite
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Accédez à toutes les fonctionnalités professionnelles sans limitation. 
              Conçue spécialement pour votre boutique.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gestion Complète</h3>
                <p className="text-gray-600 mb-6">
                  Gestion de stock, ventes, utilisateurs, alertes et statistiques avancées
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Stock illimité</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Utilisateurs illimités</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Ventes illimitées</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics Avancés</h3>
                <p className="text-gray-600 mb-6">
                  Tableaux de bord détaillés et rapports en temps réel
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Statistiques en temps réel</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Rapports détaillés</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Alertes personnalisées</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sécurité & Support</h3>
                <p className="text-gray-600 mb-6">
                  Protection des données et support technique dédié
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Sauvegarde automatique</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Support prioritaire</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Mises à jour gratuites</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 100% Gratuit pour Votre Boutique
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Cette application est entièrement gratuite et conçue spécialement pour votre boutique. 
                Aucune limitation, aucun frais caché, aucune publicité.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-700">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-medium">Aucun coût</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-medium">Aucune limitation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-medium">Support inclus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Intégrations */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intégrations Puissantes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connectez Stock Chic à vos outils existants pour un workflow parfait
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {integration.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {integration.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Vous ne trouvez pas votre outil ? Nous développons de nouvelles intégrations régulièrement.
            </p>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Demander une intégration
            </Button>
          </div>
        </div>
      </div>

      {/* Section FAQ */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez les réponses à vos questions les plus courantes
            </p>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Vous avez d'autres questions ?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat en direct
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Nous écrire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à transformer votre boutique ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez plus de 500 boutiques qui font confiance à Stock Chic
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Accéder à l'application
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                    Commencer maintenant
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                  Contactez-nous
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>100% Gratuit</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Sans limitation</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Support inclus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Contact */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre équipe est là pour vous accompagner dans votre transformation digitale
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Parlons de votre projet
              </h3>
              <p className="text-gray-600 mb-8">
                Que vous soyez une petite boutique ou une grande entreprise, 
                nous avons la solution adaptée à vos besoins. Contactez-nous 
                pour une démonstration personnalisée.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Téléphone</h4>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">contact@stockchic.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Adresse</h4>
                    <p className="text-gray-600">123 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Demandez une démo
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez vos besoins..."
                  ></textarea>
                </div>
                
                <Button className="w-full btn-primary" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer la demande
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Stock Chic</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                La solution de gestion de stock moderne pour boutiques indépendantes. 
                Optimisez vos ventes et simplifiez votre quotidien.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">📘</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">🐦</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">💼</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">📸</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statut</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4 md:mb-0">
                <span>© 2024 Stock Chic. Tous droits réservés.</span>
                <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
                <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-white transition-colors">CGU</a>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Fait avec ❤️ en France</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

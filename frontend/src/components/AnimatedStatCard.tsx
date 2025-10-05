import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  format?: 'number' | 'currency' | 'percentage';
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'blue',
  format = 'number'
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-700'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-700'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-700'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-700'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-700'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      icon: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-700'
    }
  };

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString('fr-FR');
    }
  };

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  useEffect(() => {
    setIsAnimating(true);
    
    // Animation de comptage
    const startValue = Math.max(0, displayValue - Math.abs(value - displayValue) * 0.1);
    const endValue = value;
    const duration = 1500;
    const steps = 60;
    const stepValue = (endValue - startValue) / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newValue = startValue + (stepValue * currentStep);
      
      if (currentStep >= steps) {
        setDisplayValue(endValue);
        clearInterval(timer);
        setTimeout(() => setIsAnimating(false), 300);
      } else {
        setDisplayValue(Math.round(newValue));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div 
      className={`
        relative overflow-hidden rounded-lg border p-6 transition-all duration-300 hover:shadow-lg
        ${colorClasses[color].bg} ${colorClasses[color].border}
        ${isAnimating ? 'scale-105 shadow-md' : 'scale-100'}
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        hover:bg-white dark:hover:bg-gray-800
      `}
    >
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 hover:translate-x-full" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(displayValue)}
          </p>
          <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1 font-medium">
              {change > 0 ? '+' : ''}{change}% vs mois dernier
            </span>
          </div>
        </div>
        <div className={`${colorClasses[color].icon} transition-transform duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          {icon}
        </div>
      </div>
      
      {/* Barre de progression animée */}
      <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color].icon.replace('text-', 'bg-').replace('-600', '-500')} transition-all duration-1500 ease-out`}
          style={{ 
            width: `${Math.min(100, Math.max(0, (displayValue / Math.max(value, 1)) * 100))}%` 
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedStatCard;

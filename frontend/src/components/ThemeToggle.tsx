import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = true, 
  size = 'md' 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={toggleTheme}
        className={`
          ${sizeClasses[size]} 
          relative overflow-hidden rounded-lg 
          transition-all duration-300 ease-in-out
          border-2 border-transparent
          hover:border-gray-300 dark:hover:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800
          ${isDark 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-white hover:bg-gray-50 text-gray-800 shadow-sm'
          }
        `}
        aria-label={`Passer en mode ${isDark ? 'clair' : 'sombre'}`}
        title={`Passer en mode ${isDark ? 'clair' : 'sombre'}`}
      >
        {/* Animation de rotation */}
        <div className={`
          absolute inset-0 flex items-center justify-center
          transition-transform duration-500 ease-in-out
          ${isDark ? 'rotate-0' : 'rotate-180'}
        `}>
          {isDark ? (
            <Sun className={`${iconSizes[size]} transition-all duration-300`} />
          ) : (
            <Moon className={`${iconSizes[size]} transition-all duration-300`} />
          )}
        </div>
        
        {/* Effet de brillance au hover */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
          translate-x-[-100%] hover:translate-x-[100%]
          transition-transform duration-700 ease-in-out
        `} />
      </button>
      
      {showLabel && (
        <span className={`
          text-sm font-medium transition-colors duration-300
          ${isDark ? 'text-gray-300' : 'text-gray-700'}
        `}>
          {isDark ? 'Mode sombre' : 'Mode clair'}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;
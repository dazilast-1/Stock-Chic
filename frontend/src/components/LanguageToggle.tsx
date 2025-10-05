import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './ui/Button';
import Select from './ui/Select';

interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', showLabel = true }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Languages className="w-4 h-4" />
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
        options={[
          { value: 'fr', label: 'Français' },
          { value: 'en', label: 'English' }
        ]}
        className="min-w-[120px]"
      />
    </div>
  );
};

export default LanguageToggle;

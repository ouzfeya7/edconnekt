import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import MonthSelectorModal from './MonthSelectorModal';

interface MonthCardProps {
  value: string;
  onChange: (month: string) => void;
  disabled?: boolean;
}

const MonthCard: React.FC<MonthCardProps> = ({ value, onChange, disabled = false }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <>
      <div 
        className={`bg-white p-4 rounded-lg shadow-sm flex flex-col items-start w-full h-full transition-opacity duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && setIsModalOpen(true)}
      >
        <span className="block text-sm text-gray-500 font-medium">{t('month', 'Mois')}</span>
        <div className="flex items-center justify-between w-full mt-2">
          <span className="text-lg text-gray-900 font-medium">{value}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <MonthSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        currentValue={value}
      />
    </>
  );
};

export default MonthCard; 
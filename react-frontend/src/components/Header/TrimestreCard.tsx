import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EvaluationPeriodModal from './EvaluationPeriodModal';
import { ChevronDown } from 'lucide-react';

interface TrimestreCardProps {
  value: string;
  onChange?: (value: string) => void;
}

const TrimestreCard: React.FC<TrimestreCardProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = [
    { value: "Trimestre 1", label: t('term_1') },
    { value: "Trimestre 2", label: t('term_2') },
    { value: "Trimestre 3", label: t('term_3') },
  ];

  const displayValue = options.find(opt => opt.value === value)?.label || value;

  const handleApply = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <>
      <div 
        className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-start cursor-pointer w-full h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="block text-sm text-gray-500 font-medium">{t('evaluation_period')}</span>
        <div className="flex items-center justify-between w-full mt-2">
          <span className="text-lg text-gray-900 font-medium">{displayValue}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <EvaluationPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        currentValue={value}
    />
    </>
  );
};

export default TrimestreCard; 
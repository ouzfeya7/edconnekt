import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EvaluationPeriodModal from './EvaluationPeriodModal';
import { ChevronDown } from 'lucide-react';

interface TrimestreCardProps {
  value: string;
  onChange: (trimestre: string) => void;
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
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col justify-center cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <label className="block text-sm text-gray-500 font-medium">{t('evaluation_period')}</label>
        <div className="relative mt-2 flex items-center w-full">
          <span className="text-xl text-gray-800">{displayValue}</span>
          <ChevronDown className="h-5 w-5 text-gray-400 ml-auto" />
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
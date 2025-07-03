import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import EvaluationTypeModal from './EvaluationTypeModal';

interface EvaluationTypeCardProps {
  value: string;
  onChange: (value: string) => void;
}

const EvaluationTypeCard: React.FC<EvaluationTypeCardProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = [
    { value: "Continue", label: t('continuous', 'Continue') },
    { value: "Intégration", label: t('integration', 'Intégration') },
    { value: "Trimestrielle", label: t('term_based', 'Trimestrielle') },
  ];

  const displayValue = options.find(opt => opt.value === value)?.label || value;

  const handleApply = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col justify-center cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <label className="block text-sm text-gray-500 font-medium">{t('evaluation_type', 'Évaluation')}</label>
        <div className="relative mt-2 flex items-center w-full">
          <span className="text-xl text-gray-800">{displayValue}</span>
          <ChevronDown className="h-5 w-5 text-gray-400 ml-auto" />
        </div>
      </div>
      <EvaluationTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        currentValue={value}
    />
    </>
  );
};

export default EvaluationTypeCard; 
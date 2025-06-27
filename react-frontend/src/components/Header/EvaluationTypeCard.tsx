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
        className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-start cursor-pointer w-full h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="block text-sm text-gray-500 font-medium">{t('evaluation_type', 'Évaluation')}</span>
        <div className="flex items-center justify-between w-full mt-2">
          <span className="text-lg text-gray-900 font-medium">{displayValue}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
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
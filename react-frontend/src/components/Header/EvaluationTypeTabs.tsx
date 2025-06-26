import React from 'react';
import { useTranslation } from 'react-i18next';

interface EvaluationTypeTabsProps {
  value: string;
  onChange: (value: string) => void;
}

const EvaluationTypeTabs: React.FC<EvaluationTypeTabsProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const options = [
    { key: "Continue", label: t('continue_eval', 'Continue') },
    { key: "Intégration", label: t('integration', 'Intégration') },
    { key: "Trimestrielle", label: t('trimestrielle', 'Trimestrielle') },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col justify-center h-full">
      <span className="text-sm text-gray-500 mb-1">{t('evaluation', 'Évaluation')}</span>
      <div className="flex items-center bg-gray-100 rounded-md p-1">
        {options.map(option => (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            className={`flex-1 text-center text-sm font-semibold py-1.5 rounded-md transition-colors duration-200 focus:outline-none ${
              value === option.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EvaluationTypeTabs; 
import React from 'react';
import SelectCard from './SelectCard';
import { useTranslation } from 'react-i18next';

interface EvaluationTypeCardProps {
  value: string;
  onChange?: (value: string) => void;
}

const EvaluationTypeCard: React.FC<EvaluationTypeCardProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  const options = {
    "Continue": t('continue_eval'),
    "Intégration": t('integration'),
    "Trimestrielle": t('trimestrielle')
  };

  const displayValue = options[value as keyof typeof options] || value;
  const optionKeys = Object.keys(options);

  return (
    <SelectCard
      label={t('evaluation')}
      value={displayValue}
      options={optionKeys.map(key => ({
        value: key,
        label: options[key as keyof typeof options]
      }))}
      onChange={(selectedValue) => {
        const key = optionKeys.find(k => options[k as keyof typeof options] === selectedValue);
        if (onChange && key) {
          onChange(key);
        }
      }}
      displayTransformer={(v) => options[v as keyof typeof options] || v}
    />
  );
};

export default EvaluationTypeCard; 
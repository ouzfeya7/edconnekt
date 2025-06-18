import React from 'react';
import SelectCard from './SelectCard';

interface EvaluationTypeCardProps {
  value: string;
  onChange?: (value: string) => void;
}

const EvaluationTypeCard: React.FC<EvaluationTypeCardProps> = ({ value, onChange }) => {
  return (
    <SelectCard
      label="Evaluation"
      value={value}
      options={["Continue", "Intégration", "Trimestrielle"]}
      onChange={onChange}
    />
  );
};

export default EvaluationTypeCard; 
import React from 'react';
import SelectCard from './SelectCard';

interface TrimestreCardProps {
  value: string;
  onChange?: (value: string) => void;
}

const TrimestreCard: React.FC<TrimestreCardProps> = ({ value, onChange }) => {
  return (
    <SelectCard
      label="Période d'évaluation"
      value={value}
      options={["Trimestre 1", "Trimestre 2", "Trimestre 3"]}
      onChange={onChange}
    />
  );
};

export default TrimestreCard; 
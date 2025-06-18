import React from 'react';
import SelectCard from './SelectCard';

interface PdiCardProps {
  value: string;
  onChange?: (value: string) => void;
}

const PdiCard: React.FC<PdiCardProps> = ({ value, onChange }) => {
  return (
    <SelectCard
      label="PDI"
      value={value}
      options={["PDI 08-13", "PDI 14-19", "PDI 20-25"]}
      onChange={onChange}
      containerClassName="h-full"
    />
  );
};

export default PdiCard; 
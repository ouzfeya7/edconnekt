import React from 'react';
import SelectCard from './SelectCard';

interface ClassNameCardProps {
  value: string;
  onChange?: (value: string) => void;
  isEditable?: boolean;
}

const ClassNameCard: React.FC<ClassNameCardProps> = ({ value, onChange, isEditable = true }) => {
  if (!isEditable) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col justify-between h-full">
        <div>
          <span className="text-xs text-gray-500 block">Classe</span>
          <p className="text-sm font-semibold text-gray-800 mt-1 truncate">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <SelectCard
      label="Classe"
      value={value}
      options={["4e B", "4e A", "4e C"]}
      onChange={onChange}
      containerClassName="h-full"
    />
  );
};

export default ClassNameCard; 
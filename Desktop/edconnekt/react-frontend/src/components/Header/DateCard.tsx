import React from 'react';
import SelectCard from './SelectCard';

interface DateCardProps {
  value: string;
  onChange?: (value: string) => void;
}

const DateCard: React.FC<DateCardProps> = ({ value, onChange }) => {
  return (
    <SelectCard
      label="Date"
      value={value}
      options={[value]}
      onChange={onChange}
      containerClassName="h-full"
    />
  );
};

export default DateCard; 
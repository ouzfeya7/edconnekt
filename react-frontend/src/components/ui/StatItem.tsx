import React from 'react';

export interface StatItemProps {
  label: string;
  value: string | number;
  valueColor?: string;
  icon?: JSX.Element;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, valueColor = 'text-gray-700', icon }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <div className={`flex items-center text-2xl font-semibold ${valueColor}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {value}
    </div>
  </div>
);

export default StatItem; 
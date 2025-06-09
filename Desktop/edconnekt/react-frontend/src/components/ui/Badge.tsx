import React from 'react';

export interface BadgeProps {
  text: string;
  color?: string;
  bgColor?: string;
  icon?: JSX.Element;
}

const Badge: React.FC<BadgeProps> = ({ text, color = 'text-gray-700', bgColor = 'bg-gray-200', icon }) => (
  <span className={`flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${color} ${bgColor}`}>
    {icon && <span className="mr-1.5">{icon}</span>}
    {text}
  </span>
);

export default Badge; 
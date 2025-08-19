import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'gray';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  badge?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  disabled = false,
  className = '',
  badge
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      icon: 'text-blue-500',
      bgLight: 'bg-blue-50'
    },
    green: {
      bg: 'bg-green-500',
      hover: 'hover:bg-green-600',
      icon: 'text-green-500',
      bgLight: 'bg-green-50'
    },
    red: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      icon: 'text-red-500',
      bgLight: 'bg-red-50'
    },
    purple: {
      bg: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      icon: 'text-purple-500',
      bgLight: 'bg-purple-50'
    },
    orange: {
      bg: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      icon: 'text-orange-500',
      bgLight: 'bg-orange-50'
    },
    gray: {
      bg: 'bg-gray-500',
      hover: 'hover:bg-gray-600',
      icon: 'text-gray-500',
      bgLight: 'bg-gray-50'
    }
  };

  const colors = colorClasses[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative bg-white border border-gray-200 rounded-lg p-6 
        hover:shadow-lg transition-all duration-200 text-left group
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </div>
      )}

      {/* Icon */}
      <div className={`
        ${colors.bg} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 
        group-hover:scale-110 transition-transform duration-200
        ${disabled ? 'group-hover:scale-100' : ''}
      `}>
        <Icon className="w-6 h-6" />
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
          {description}
        </p>
      </div>

      {/* Hover effect */}
      <div className={`
        absolute inset-0 rounded-lg border-2 border-transparent 
        group-hover:border-gray-300 transition-colors duration-200
        ${disabled ? 'group-hover:border-transparent' : ''}
      `} />
    </button>
  );
};

export default ActionButton;

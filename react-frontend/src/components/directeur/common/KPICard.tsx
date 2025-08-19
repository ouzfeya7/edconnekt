import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  isCritical?: boolean;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  isCritical = false,
  className = ''
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      icon: 'text-green-500'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      icon: 'text-red-500'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      icon: 'text-purple-500'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      icon: 'text-orange-500'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 relative ${className}`}>
      {isCritical && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          ⚠️
        </div>
      )}
      <div className="flex items-center">
        <Icon className={`w-8 h-8 ${colors.icon} mr-3`} />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm ${colors.text}`}>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default KPICard;

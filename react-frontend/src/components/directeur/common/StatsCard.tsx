import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'gray';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
  className = '',
  onClick
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      icon: 'text-blue-500',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      icon: 'text-green-500',
      trend: 'text-green-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      icon: 'text-red-500',
      trend: 'text-red-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      icon: 'text-purple-500',
      trend: 'text-purple-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      icon: 'text-orange-500',
      trend: 'text-orange-600'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-600',
      icon: 'text-gray-500',
      trend: 'text-gray-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.gray;

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-lg p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${colors.icon}`} />
          <h3 className={`font-medium text-sm ${colors.text}`}>{title}</h3>
        </div>
        {trend && getTrendIcon()}
      </div>

      <div className="mb-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      {trend && (
        <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
          <span className="font-medium">
            {trend.direction === 'up' ? '+' : ''}{trend.value}%
          </span>
          <span>vs {trend.period}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;

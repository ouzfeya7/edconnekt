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
      accentText: 'text-blue-600',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-600'
    },
    green: {
      accentText: 'text-green-600',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-600'
    },
    red: {
      accentText: 'text-red-600',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-600'
    },
    purple: {
      accentText: 'text-purple-600',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-600'
    },
    orange: {
      accentText: 'text-orange-600',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-600'
    }
  } as const;

  const colors = colorClasses[color];

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-4 md:p-5 relative shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {isCritical && (
        <span className="absolute top-3 right-3" aria-label="Alerte">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </span>
      )}
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colors.badgeBg} ${colors.badgeText}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-semibold leading-tight text-slate-900">{value}</p>
          <p className={`text-sm ${colors.accentText} mt-0.5`}>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default KPICard;

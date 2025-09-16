import React from 'react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  onClick: () => void;
  className?: string;
}

const colorMap = {
  blue: { badgeBg: 'bg-blue-100', badgeText: 'text-blue-600' },
  green: { badgeBg: 'bg-green-100', badgeText: 'text-green-600' },
  red: { badgeBg: 'bg-red-100', badgeText: 'text-red-600' },
  purple: { badgeBg: 'bg-purple-100', badgeText: 'text-purple-600' },
  orange: { badgeBg: 'bg-orange-100', badgeText: 'text-orange-600' },
} as const;

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
  className = ''
}) => {
  const colors = colorMap[color];

  return (
    <button
      onClick={onClick}
      className={`w-full bg-white border border-slate-200 rounded-xl p-5 text-left shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors.badgeBg} ${colors.badgeText}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <span className="text-slate-300 group-hover:text-slate-400">→</span>
          </div>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;



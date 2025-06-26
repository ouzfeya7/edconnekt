import React from 'react';
import { useTranslation } from 'react-i18next';

interface StudentStats {
  total: number;
  present: number;
  retard: number;
  absent: number;
}

interface StatsCardProps {
  stats: StudentStats;
}

const StatDisplay = ({ value, color }: { value: string | number; color: string; }) => (
  <p className={`text-2xl font-medium ${color}`}>{value}</p>
);

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const { t } = useTranslation();
  const formatStat = (stat: number) => stat.toString().padStart(2, '0');

  const statItems = [
    { label: t('number_of_students', "Nombre d'élèves"), value: stats.total, color: 'text-slate-800' },
    { label: t('present', 'Présent'), value: formatStat(stats.present), color: 'text-teal-600' },
    { label: t('late', 'Retard'), value: formatStat(stats.retard), color: 'text-amber-600' },
    { label: t('absent', 'Absent'), value: formatStat(stats.absent), color: 'text-red-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col justify-center">
      <div className="flex justify-around items-center">
        {statItems.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex-1 text-left px-4">
               <p className="text-sm text-gray-500 font-medium mb-2 whitespace-nowrap">{item.label}</p>
              <StatDisplay value={item.value} color={item.color} />
      </div>
            {index < statItems.length - 1 && <div className="h-10 border-l border-gray-200" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatsCard; 
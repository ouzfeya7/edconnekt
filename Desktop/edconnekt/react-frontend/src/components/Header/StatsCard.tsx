import React from 'react';

interface StudentStats {
  total: number;
  present: number;
  retard: number;
  absent: number;
}

interface StatsCardProps {
  stats: StudentStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex items-center">
      {/* Section Nombre d'élèves */}
      <div className="pr-4 border-r border-gray-200">
        <p className="text-sm text-gray-500 font-medium">Nombre d'élèves</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
      </div>

      {/* Section Présent */}
      <div className="px-4 border-r border-gray-200 text-center">
        <p className="text-sm text-gray-500 font-medium">Present</p>
        <p className="text-2xl font-bold text-green-500 mt-1">{stats.present}</p>
      </div>

      {/* Section Retard */}
      <div className="px-4 border-r border-gray-200 text-center">
        <p className="text-sm text-gray-500 font-medium">Retard</p>
        <p className="text-2xl font-bold text-orange-500 mt-1">{stats.retard}</p>
      </div>

      {/* Section Absent */}
      <div className="pl-4 text-center">
        <p className="text-sm text-gray-500 font-medium">Absent</p>
        <p className="text-2xl font-bold text-red-500 mt-1">{stats.absent}</p>
      </div>
    </div>
  );
};

export default StatsCard; 
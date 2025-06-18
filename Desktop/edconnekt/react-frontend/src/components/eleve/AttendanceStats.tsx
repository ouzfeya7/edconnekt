import React from 'react';

interface StatItem {
  label: string;
  value: string; // e.g., "95%"
  color: string; // e.g., "text-emerald-600"
  baseColor?: string; // e.g., "#34D399" for emerald-600 for the chart
}

interface AttendanceStatsProps {
  stats: StatItem[];
}

interface DonutChartProps {
  stats: StatItem[];
  size?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ stats, size = 80, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercentage = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      {stats.map((stat, index) => {
        const percentage = parseFloat(stat.value.replace('%', ''));
        const displayPercentage = Math.min(percentage, 100 - accumulatedPercentage);
        // Calculate the length of the segment to draw
        const dashLength = (displayPercentage / 100) * circumference;
        // Calculate the offset for this segment
        const offset = circumference - (accumulatedPercentage / 100) * circumference;
        const strokeDasharray = `${dashLength} ${circumference - dashLength}`;

        accumulatedPercentage += displayPercentage;

        return (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stat.baseColor || 'currentColor'}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ stats }) => {
  const enrichedStats = stats.map(stat => {
    let baseColor = 'gray';
    if (stat.color.includes('emerald')) baseColor = '#10B981';
    else if (stat.color.includes('amber')) baseColor = '#F59E0B';
    else if (stat.color.includes('red')) baseColor = '#EF4444';
    return { ...stat, baseColor };
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4 h-full">
      <div className="flex-shrink-0">
        <DonutChart stats={enrichedStats} size={50} strokeWidth={7} />
      </div>
      <div className="flex flex-1 justify-around items-center">
        {enrichedStats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            <div className="flex flex-col items-center text-center px-2">
              <span className="text-xs text-slate-600 font-medium mb-1 whitespace-nowrap">{stat.label}</span>
              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            {index < enrichedStats.length - 1 && (
              <div className="h-10 w-px bg-gray-200 self-center"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </article>
  );
};

export default AttendanceStats;
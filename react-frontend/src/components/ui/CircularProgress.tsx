import React from 'react';

const getColorClass = (percentage: number): string => {
  if (percentage >= 90) return 'text-green-700'; // Très Bien Réussi (vert foncé)
  if (percentage >= 70) return 'text-green-500';  // Bien Réussi (vert clair)
  if (percentage >= 50) return 'text-yellow-500'; // Réussi (jaune)
  if (percentage >= 30) return 'text-orange-500'; // Peu Réussi (orange)
  return 'text-red-600'; // Pas Réussi (rouge)
};

const CircularProgress: React.FC<{ percentage: number, size?: number, strokeWidth?: number, showPercentage?: boolean }> = ({ percentage, size = 64, strokeWidth = 10, showPercentage = true }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, percentage)); 
  const offset = circumference - (progress / 100) * circumference;

  const colorClass = getColorClass(percentage);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle 
          className="text-gray-200" 
          strokeWidth={strokeWidth}
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="50" 
          cy="50"
        />
        <circle 
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="50" 
          cy="50"
        />
      </svg>
      {showPercentage && percentage !== undefined && (
        <span className={`absolute text-sm font-bold ${colorClass}`} style={{ fontSize: size / 4.5 }}>
          {percentage}%
        </span>
      )}
    </div>
  );
};

export default CircularProgress; 
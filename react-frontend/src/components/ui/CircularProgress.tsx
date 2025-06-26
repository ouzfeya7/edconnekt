import React from 'react';

const CircularProgress: React.FC<{ percentage: number, colorClass: string, showPercentage?: boolean }> = ({ percentage, colorClass, showPercentage = true }) => {
  const radius = 40; // Le rayon réel du cercle
  const circumference = 2 * Math.PI * radius;
  // S'assurer que le décalage ne cause pas de dépassement si le pourcentage est 0 ou 100
  const progress = Math.max(0, Math.min(100, percentage)); 
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle 
          className="text-gray-200" 
          strokeWidth="10" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="50" 
          cy="50"
        />
        <circle 
          className={colorClass} 
          strokeWidth="10" 
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
      {/* Afficher le pourcentage au centre seulement si ce n'est pas le stat "Remédiation" ou "Nombre d'élèves" */}
      {showPercentage && percentage !== undefined && <span className={`absolute text-sm font-semibold ${colorClass}`}>{percentage}%</span>}
    </div>
  );
};

export default CircularProgress; 
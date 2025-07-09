import React from 'react';
import CircularProgress from '../ui/CircularProgress';

interface EvaluationItemProps {
  title: string;
  subject: string;
  score: number;
}

const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'text-green-700'; // Très Bien Réussi
    if (score >= 70) return 'text-green-500'; // Bien Réussi
    if (score >= 50) return 'text-yellow-400'; // Réussi
    if (score >= 30) return 'text-orange-500'; // Peu Réussi
    return 'text-red-600'; // Pas Réussi
};

const EvaluationItem: React.FC<EvaluationItemProps> = ({ title, subject, score }) => {
  const colorClass = getScoreColorClass(score);

  return (
    <div className="flex items-center justify-between py-3">
      <div className="truncate">
        <p className="text-base font-semibold text-gray-800 truncate" title={title}>
          {title}
        </p>
        <p className="text-sm text-gray-500">{subject}</p>
      </div>
      <div className="w-16 h-16 flex-shrink-0">
        <CircularProgress percentage={score} colorClass={colorClass} />
      </div>
    </div>
  );
};

export default EvaluationItem; 
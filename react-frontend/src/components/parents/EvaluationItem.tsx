import React from 'react';
import CircularProgress from '../ui/CircularProgress';

interface EvaluationItemProps {
  title: string;
  subject: string;
  score: number;
}

const EvaluationItem: React.FC<EvaluationItemProps> = ({ title, subject, score }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="truncate">
        <p className="text-base font-semibold text-gray-800 truncate" title={title}>
          {title}
        </p>
        <p className="text-sm text-gray-500">{subject}</p>
      </div>
      <div className="w-16 h-16 flex-shrink-0">
        <CircularProgress percentage={score} />
      </div>
    </div>
  );
};

export default EvaluationItem; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facilitator } from '../../lib/mock-data';

interface FacilitatorCardProps {
  facilitator: Facilitator;
}

const ClassTag: React.FC<{ className: string }> = ({ className }) => {
  const tagColor = 'bg-gray-100 text-gray-600';
  const iconColor = 'bg-pink-500';

  const getInitials = (name: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${tagColor}`}>
      <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white ${iconColor}`}>
        {getInitials(className)}
      </span>
      {className}
    </span>
  );
};

const FacilitatorCard: React.FC<FacilitatorCardProps> = ({ facilitator }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/pdi/${facilitator.id}`);
  };

  return (
    <div className="flex h-full flex-col items-center rounded-2xl bg-white p-6 text-center shadow">
      <div className="mb-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-orange-400">
        <img src={facilitator.avatarUrl} alt={facilitator.name} className="h-full w-full object-cover" />
      </div>
      <h3 className="text-base font-bold text-gray-800">{facilitator.name}</h3>
      <p className="mb-4 text-sm text-gray-500">{facilitator.role}</p>
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {facilitator.classes.map((className, index) => (
          <ClassTag 
            key={index} 
            className={className} 
          />
        ))}
      </div>
      <button 
        onClick={handleViewDetails}
        className="mt-auto w-full rounded-lg bg-orange-50 py-3 px-4 font-semibold text-gray-700 transition-colors hover:bg-orange-100"
      >
        Voir détails
      </button>
    </div>
  );
};

export default FacilitatorCard; 
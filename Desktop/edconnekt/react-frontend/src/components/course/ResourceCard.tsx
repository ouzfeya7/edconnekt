import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  imageUrl: string;
  fileCount: number;
  onViewResource?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  imageUrl,
  fileCount,
  onViewResource,
}) => {
  return (
    <div 
      className={`flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl ${onViewResource ? 'cursor-pointer' : ''}`}
      onClick={onViewResource}
      role={onViewResource ? 'button' : undefined}
      tabIndex={onViewResource ? 0 : undefined}
      onKeyDown={onViewResource ? (e) => { if (e.key === 'Enter' || e.key === ' ') onViewResource(); } : undefined}
    >
      <div className="w-full h-36 bg-gray-200 overflow-hidden flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={`Ressource: ${title}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 truncate" title={title}>
          {title}
        </h2>
        <div className="flex items-center text-gray-500 text-xs mt-auto pt-1">
          <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-gray-400 stroke-1.5" />
          {fileCount}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard; 
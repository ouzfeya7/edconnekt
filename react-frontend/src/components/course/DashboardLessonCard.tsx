import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

interface DashboardLessonCardProps {
  id: string;
  title: string;
  subject: string;
  time: string;
  teacher: string;
  status?: 'completed' | 'active' | 'upcoming';
  onViewDetails: () => void;
}

const DashboardLessonCard: React.FC<DashboardLessonCardProps> = ({
  title,
  subject,
  time,
  teacher,
  status = 'active',
  onViewDetails
}) => {
  const getSubjectIcon = (subject: string) => {
    const icons: { [key: string]: string } = {
      'Mathématique': '📐',
      'Français': '📚',
      'Sciences': '🔬',
      'Histoire': '📜',
      'Géographie': '🌍',
      'Anglais': '🇬🇧',
      'Art': '🎨',
      'Sport': '⚽',
      'Musique': '🎵'
    };
    return icons[subject] || '📖';
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          badge: 'Terminée',
          badgeColor: 'bg-green-100 text-green-700',
          cardBorder: 'border-green-200',
        };
      case 'upcoming':
        return {
          badge: 'À venir',
          badgeColor: 'bg-blue-100 text-blue-700',
          cardBorder: 'border-blue-200',
        };
      default:
        return {
          badge: 'En cours',
          badgeColor: 'bg-orange-100 text-orange-700',
          cardBorder: 'border-orange-200',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div 
      className={`bg-white border ${statusConfig.cardBorder} rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer`}
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getSubjectIcon(subject)}</span>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-1" title={title}>
              {title}
            </h3>
            <p className="text-slate-500 text-xs">{subject}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.badgeColor}`}>
          {statusConfig.badge}
        </span>
      </div>

      {/* Informations essentielles */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Users className="w-3 h-3" />
          <span className="truncate">{teacher}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardLessonCard; 
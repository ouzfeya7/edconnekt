import React from 'react';

interface DashboardCourseCardProps {
  subject: string;
  teacher: string;
  progress: number;
  status: 'active' | 'completed' | 'upcoming';
  nextLessonDate?: string;
  onViewDetails: () => void;
  title?: string;
  time?: string;
  presentCount?: number;
  remediationCount?: number;
}

const DashboardCourseCard: React.FC<DashboardCourseCardProps> = ({ 
  subject,
  teacher,
  // progress,
  // status,
  // nextLessonDate,
  onViewDetails,
  title,
  time,
  presentCount,
  remediationCount
}) => {
  // const { t } = useTranslation();
  // Générer un avatar simple avec initiales
  const getTeacherInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div 
      onClick={onViewDetails}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-orange-300"
    >
      {/* Titre du cours */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 font-medium truncate">{subject}</p>
      </div>

      {/* Horaire */}
      <div className="mb-4">
        <p className="text-orange-500 font-semibold text-sm">{time}</p>
      </div>

      {/* Enseignant avec avatar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">
            {getTeacherInitials(teacher)}
          </span>
        </div>
        <span className="text-gray-700 font-medium truncate">{teacher}</span>
      </div>

      {/* Statistiques présents/remédiation */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 text-sm font-bold">{String(presentCount).padStart(2, '0')}</span>
          </div>
          <span className="text-sm text-gray-600 truncate">Présent</span>
        </div>
        
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-gray-700 text-sm font-bold">{String(remediationCount).padStart(2, '0')}</span>
          </div>
          <span className="text-sm text-gray-600 truncate">Remédiation</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCourseCard; 
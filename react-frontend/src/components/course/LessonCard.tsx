import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Props similaires à AssignmentCard, mais nous pourrions les affiner si nécessaire pour les leçons
interface LessonCardProps {
  id: string; // ID de la leçon pour la navigation
  title: string;
  subject: string; // Matière
  time: string;
  teacher: string;
  teacherImage?: string;
  presentCount: number; // Nouveau prop
  absentCount: number;  // Nouveau prop
}

const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  subject,
  time,
  teacher,
  teacherImage,
  presentCount,
  absentCount,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };

  const initials = getInitials(teacher);
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=ff8c00`;

  const handleViewDetailsClick = () => {
    navigate(`/lecons/${id}`); 
  };

  return (
    <article className="flex flex-col bg-white p-4 rounded-xl shadow-md h-full">
      <div className="flex-grow">
        <h3 className="font-bold text-gray-800 text-lg mb-1" title={title}>{title}</h3>
        <p className="text-gray-500 text-sm mb-2">{subject}</p>
        <p className="text-orange-400 font-bold text-sm mb-3">{time}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <img 
            src={teacherImage || avatarUrl} 
            alt={teacher} 
            className="w-8 h-8 rounded-full"
          />
          <span className="text-gray-700 text-sm font-medium">{teacher}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-xs">
              {String(presentCount).padStart(2, '0')}
            </span>
            <span className="text-gray-500 text-sm">{t('presents')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold text-xs">
              {String(absentCount).padStart(2, '0')}
            </span>
            <span className="text-gray-500 text-sm">{t('absents')}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
      <button 
        onClick={handleViewDetailsClick}
          className="w-full py-2 text-center bg-[#FEF3E7] text-gray-800 rounded-lg hover:bg-orange-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
          {t('view_details')}
      </button>
      </div>
    </article>
  );
};

export default LessonCard; 
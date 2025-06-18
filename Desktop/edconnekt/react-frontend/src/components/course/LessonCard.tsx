import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <article className="flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 mb-2" title={title}>{title}</h3>
        <p className="text-gray-500 text-sm mb-4">{subject}</p>
        <p className="text-orange-500 font-medium text-sm mb-4">{time}</p>
        
        <div className="flex items-center gap-3 mb-4"> {/* Augmentation du gap */}
          <img 
            src={teacherImage || avatarUrl} 
            alt={teacher} 
            className="w-8 h-8 rounded-full border border-gray-300"
          />
          <span className="text-gray-700 text-sm font-medium truncate">{teacher}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs mr-2">
              {presentCount}
            </span>
            <span className="text-gray-600 text-sm">Présents</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-700 font-bold text-xs mr-2">
              {absentCount}
            </span>
            <span className="text-gray-600 text-sm">Absents</span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleViewDetailsClick}
        className="mt-auto w-full py-2 text-center bg-[#FEF3E7] text-gray-700 rounded-md hover:bg-orange-100 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        Voir détails
      </button>
    </article>
  );
};

export default LessonCard; 
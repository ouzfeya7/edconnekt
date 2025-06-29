import React from 'react';
import { Clock, User, Users, UserCheck } from 'lucide-react';
import { useAuth } from '../../pages/authentification/useAuth';

interface CourseCardProps {
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  presentCount: number;
  absentCount: number;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  subject,
  startTime,
  endTime,
  presentCount,
  absentCount,
  onClick
}) => {
  const { user } = useAuth();

  const handleClick = onClick || (() => {});

  const getSubjectIcon = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('math')) return '🔢';
    if (subjectLower.includes('français') || subjectLower.includes('francais')) return '📚';
    if (subjectLower.includes('science')) return '🔬';
    if (subjectLower.includes('histoire')) return '🏛️';
    if (subjectLower.includes('géographie') || subjectLower.includes('geographie')) return '🌍';
    if (subjectLower.includes('anglais') || subjectLower.includes('english')) return '🇬🇧';
    if (subjectLower.includes('art')) return '🎨';
    if (subjectLower.includes('sport') || subjectLower.includes('motricité')) return '⚽';
    return '📖';
  };

  // Construire le nom complet de l'enseignant
  const teacherName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Enseignant';
  const teacherInitials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() 
    : 'NN';

  return (
    <article 
      className="relative overflow-hidden bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* En-tête du cours */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{getSubjectIcon(subject)}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{subject}</p>
          </div>
        </div>
      </div>

      {/* Horaires */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {startTime} - {endTime}
        </span>
      </div>

      {/* Enseignant */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-full font-bold text-xs">
          {teacherInitials}
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <User className="w-4 h-4" />
          {teacherName}
        </div>
      </div>

      {/* Statistiques de présence */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">{presentCount}</span>
          <span className="text-xs text-gray-600">présents</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-red-600" />
          <span className="text-sm font-semibold text-red-700">{absentCount}</span>
          <span className="text-xs text-gray-600">absents</span>
        </div>
      </div>
    </article>
  );
};

export default CourseCard; 
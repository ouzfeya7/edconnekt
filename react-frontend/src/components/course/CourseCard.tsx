import React from 'react';
import { 
  Clock, User, Users, UserCheck, BookOpen, Calculator, FlaskConical, 
  Landmark, Globe, Languages, Palette, Footprints, BookMarked, HeartHandshake, Book 
} from 'lucide-react';
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
    
    let IconComponent: React.ElementType = Book;
    let colorClasses = 'bg-slate-100 text-slate-600';

    if (subjectLower.includes('math')) {
        IconComponent = Calculator;
        colorClasses = 'bg-blue-100 text-blue-600';
    } else if (subjectLower.includes('français') || subjectLower.includes('francais')) {
        IconComponent = BookOpen;
        colorClasses = 'bg-red-100 text-red-600';
    } else if (subjectLower.includes('science')) {
        IconComponent = FlaskConical;
        colorClasses = 'bg-green-100 text-green-600';
    } else if (subjectLower.includes('histoire')) {
        IconComponent = Landmark;
        colorClasses = 'bg-amber-100 text-amber-700';
    } else if (subjectLower.includes('géographie') || subjectLower.includes('geographie')) {
        IconComponent = Globe;
        colorClasses = 'bg-cyan-100 text-cyan-600';
    } else if (subjectLower.includes('anglais') || subjectLower.includes('english')) {
        IconComponent = Languages;
        colorClasses = 'bg-indigo-100 text-indigo-600';
    } else if (subjectLower.includes('art')) {
        IconComponent = Palette;
        colorClasses = 'bg-purple-100 text-purple-600';
    } else if (subjectLower.includes('sport') || subjectLower.includes('motricité')) {
        IconComponent = Footprints;
        colorClasses = 'bg-orange-100 text-orange-600';
    } else if (subjectLower.includes('islamique')) {
        IconComponent = BookMarked;
        colorClasses = 'bg-emerald-100 text-emerald-700';
    } else if (subjectLower.includes('quran')) {
        IconComponent = BookMarked;
        colorClasses = 'bg-emerald-100 text-emerald-700';
    } else if (subjectLower.includes('vivre ensemble')) {
        IconComponent = HeartHandshake;
        colorClasses = 'bg-pink-100 text-pink-600';
    }

    return (
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colorClasses}`}>
            <IconComponent className="w-5 h-5" />
        </div>
    );
  };

  // Construire le nom complet de l'enseignant
  const teacherName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Enseignant';
  const teacherInitials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() 
    : 'NN';

  return (
    <article 
      className="relative overflow-hidden bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-orange-300"
      onClick={handleClick}
    >
      {/* En-tête du cours */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          {getSubjectIcon(subject)}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-orange-600 transition-colors">
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
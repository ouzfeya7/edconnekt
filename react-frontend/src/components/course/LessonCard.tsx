import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, User, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

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

  const initials = getInitials(teacher);
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=64748b`;

  const handleViewDetailsClick = () => {
    navigate(`/lecons/${id}`); 
  };

  const totalStudents = presentCount + absentCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden">
      {/* En-tête avec icône matière */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getSubjectIcon(subject)}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-sm line-clamp-2" title={title}>
              {title}
            </h3>
            <p className="text-slate-500 text-xs mt-1">{subject}</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-4 flex-1">
        {/* Informations temporelles */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-medium">{time}</span>
        </div>

        {/* Informations enseignant */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={teacherImage || avatarUrl} 
            alt={teacher} 
            className="w-8 h-8 rounded-full border-2 border-slate-100"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-slate-400" />
              <span className="text-slate-700 text-sm font-medium truncate">{teacher}</span>
            </div>
          </div>
        </div>

        {/* Statistiques de présence */}
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-xs font-medium">Taux de présence</span>
            <span className="text-slate-800 text-sm font-semibold">{attendanceRate}%</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${attendanceRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 text-xs font-medium">{presentCount}</span>
              </div>
              <span className="text-slate-500 text-xs">présents</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-500" />
                <span className="text-red-600 text-xs font-medium">{absentCount}</span>
              </div>
              <span className="text-slate-500 text-xs">absents</span>
            </div>
          </div>
        </div>

        {/* Bouton d'action */}
        <button 
          onClick={handleViewDetailsClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          <span>{t('view_details') || 'Voir détails'}</span>
          <ArrowRight className="w-4 h-4 transition-transform hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
};

export default LessonCard; 
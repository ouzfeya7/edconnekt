import React from 'react';
import { BookOpen, Clock, User, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  title?: string;
  subject: string;
  time?: string;
  teacher: string;
  presentCount?: number;
  absentCount?: number;
  onClick?: () => void;
  onViewDetails?: () => void;
  // Nouvelles propriétés pour un design plus riche
  theme?: string;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  nextLessonDate?: string;
  status?: 'active' | 'completed' | 'upcoming';
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  subject,
  time,
  teacher,
  presentCount = 0,
  absentCount = 0,
  onClick,
  onViewDetails,
  theme,
  progress = 75,
  totalLessons = 12,
  completedLessons = 9,
  nextLessonDate = "Lundi 25 Nov",
  status = 'active'
}) => {
  const handleClick = onClick || onViewDetails || (() => {});

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          icon: CheckCircle2,
          label: 'Terminé'
        };
      case 'upcoming':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          icon: Clock,
          label: 'À venir'
        };
      default:
        return {
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          textColor: 'text-slate-700',
          icon: BookOpen,
          label: 'En cours'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

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

  return (
    <article 
      className={`relative overflow-hidden ${statusConfig.bgColor} border-2 ${statusConfig.borderColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1 h-full flex flex-col`}
      onClick={handleClick}
    >
      {/* Badge de statut */}
      <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.textColor} bg-white/80`}>
        <StatusIcon className="w-3 h-3" />
        {statusConfig.label}
      </div>

      {/* Contenu principal - flex-grow pour pousser le bouton vers le bas */}
      <div className="flex-grow flex flex-col">
        {/* Icône de matière */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{getSubjectIcon(subject)}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              {title || subject}
            </h3>
            {theme && (
              <p className="text-sm text-slate-600 mt-1">{theme}</p>
            )}
          </div>
        </div>

        {/* Informations de l'enseignant */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-white/50 rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-slate-200 text-slate-700 rounded-full font-bold text-sm">
            {teacher.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
              <User className="w-3 h-3" />
              {teacher}
            </div>
            {time && (
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <Clock className="w-3 h-3" />
                {time}
              </div>
            )}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Progression</span>
            <span className="text-sm text-slate-600">{completedLessons}/{totalLessons} leçons</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-slate-400 to-slate-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right mt-1">
            <span className="text-xs text-slate-500">{progress}% complété</span>
          </div>
        </div>

        {/* Statistiques de présence */}
        {(presentCount > 0 || absentCount > 0) && (
          <div className="flex items-center justify-between mb-4 p-3 bg-white/50 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-700">{presentCount}</span>
                <span className="text-slate-600">présents</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-red-700">{absentCount}</span>
                <span className="text-slate-600">absents</span>
              </div>
            </div>
          </div>
        )}

        {/* Section flexible pour maintenir l'alignement */}
        <div className="flex-grow">
          {/* Prochaine leçon */}
          {status === 'active' && (
            <div className="mb-4 p-3 bg-white/50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Prochaine leçon</div>
              <div className="text-sm font-medium text-slate-700">{nextLessonDate}</div>
            </div>
          )}
          
          {/* Espace de remplissage pour les cours "À venir" */}
          {status === 'upcoming' && (
            <div className="mb-4 p-3 bg-white/50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Statut</div>
              <div className="text-sm font-medium text-slate-700">Cours non encore démarré</div>
            </div>
          )}
          
          {/* Espace de remplissage pour les cours "Terminés" */}
          {status === 'completed' && (
            <div className="mb-4 p-3 bg-white/50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Statut</div>
              <div className="text-sm font-medium text-slate-700">Cours terminé avec succès</div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton d'action - toujours en bas */}
      <button
        onClick={handleClick}
        className="w-full px-4 py-3 text-sm font-medium text-white bg-slate-600 border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md mt-auto"
      >
        Voir les détails
      </button>
    </article>
  );
};

export default CourseCard; 
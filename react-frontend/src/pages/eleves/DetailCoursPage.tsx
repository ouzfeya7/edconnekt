import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { ArrowLeft, BookOpen, Clock, User, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { getEnrichedCourses } from '../../lib/mock-student-data';

const DetailCoursPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>(); 
  const navigate = useNavigate();

  const enrichedCourses = getEnrichedCourses(navigate);
  const courseData = enrichedCourses.find(c => c.id === courseId);

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Cours non trouvé</h2>
          <p className="text-slate-500 mb-4">Le cours que vous recherchez n'existe pas.</p>
          <button 
            onClick={() => navigate('/mes-cours')}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  const getSubjectIcon = (subject: string) => {
    const icons: { [key: string]: string } = {
      'Mathématiques': '📐',
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border";
    
    if (status === 'active') {
      return `${baseClasses} bg-blue-50 text-blue-700 border-blue-200`;
    } else if (status === 'completed') {
      return `${baseClasses} bg-green-50 text-green-700 border-green-200`;
    } else if (status === 'upcoming') {
      return `${baseClasses} bg-amber-50 text-amber-700 border-amber-200`;
    }
    return `${baseClasses} bg-slate-50 text-slate-600 border-slate-200`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'En cours';
      case 'completed': return 'Terminé';
      case 'upcoming': return 'À venir';
      default: return 'Statut inconnu';
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* En-tête simplifié avec navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/mes-cours')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour aux cours</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getSubjectIcon(courseData.subject)}</span>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{courseData.title}</h1>
              <p className="text-slate-600 text-sm">{courseData.subject} • {courseData.theme}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section principale - Disposition uniforme */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Section À propos - Pleine largeur sur 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={getStatusBadge(courseData.status)}>
                  <CheckCircle className="w-3 h-3 mr-1.5" />
                  {getStatusLabel(courseData.status)}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-slate-800 mb-3">À propos de ce cours</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Cette leçon "{courseData.title}" fait partie du cours de {courseData.subject.toLowerCase()} 
                sur le thème "{courseData.theme}". Elle vous permettra de développer vos compétences et 
                connaissances de manière progressive. Vous trouverez ci-dessous toutes les informations 
                et ressources nécessaires.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{courseData.totalLessons} leçons</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Par {courseData.teacher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Prochaine leçon: {courseData.nextLessonDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale - Illustration et progression */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              {/* Illustration principale */}
              <div className="relative mb-6">
                <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">{getSubjectIcon(courseData.subject)}</span>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-slate-700">{courseData.subject}</span>
                </div>
            </div>

              {/* Progression visuelle */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Progression</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="w-full bg-white/60 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${courseData.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{courseData.progress}%</span>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  {courseData.completedLessons} sur {courseData.totalLessons} leçons terminées
                </div>
              </div>
            </div>
          </div>
          </div> 

        {/* Statistiques simplifiées */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide">Progression</h3>
                <p className="text-2xl font-bold text-slate-800">{courseData.progress}%</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${courseData.progress}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide">Leçons terminées</h3>
                <p className="text-2xl font-bold text-slate-800">{courseData.completedLessons}</p>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Sur {courseData.totalLessons} leçons au total
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide">Prochaine leçon</h3>
                <p className="text-lg font-bold text-slate-800">{courseData.nextLessonDate}</p>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Avec {courseData.teacher}
            </div>
          </div>
        </div>

        {/* Message d'information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Contenu du cours</h3>
          <p className="text-slate-500">
            Les leçons détaillées seront bientôt disponibles. 
            En attendant, vous pouvez suivre votre progression et voir les informations du cours ci-dessus.
          </p>
        </div>


      </div>
    </div>
  );
};

export default DetailCoursPage; 
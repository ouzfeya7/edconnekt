import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Clock, User, TrendingUp, Calendar, CheckCircle, Plus, FileText, Trash2,
  Calculator, FlaskConical, Landmark, Globe, Languages, Palette, Footprints, BookMarked, HeartHandshake, Book 
} from 'lucide-react';
import { getEnrichedCourses } from '../lib/mock-student-data';
import { useUser } from '../layouts/DashboardLayout';
import AddSupportModal, { NewSupportData } from '../components/course/AddSupportModal';


const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [isAddSupportModalOpen, setIsAddSupportModalOpen] = useState(false);

  const enrichedCourses = getEnrichedCourses(navigate);
  const courseData = enrichedCourses.find(c => c.id === courseId);

  // État local pour gérer les supports de cours
  const [courseSupports, setCourseSupports] = useState<{
    id: string;
    title: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
    fileType: string;
    createdBy: string;
    createdAt: string;
  }[]>([]);

  const isTeacher = user?.role === 'enseignant';

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAddSupport = (data: NewSupportData) => {
    // Créer une URL temporaire pour le fichier (en production, ce serait une URL de serveur)
    const fileUrl = URL.createObjectURL(data.file);
    const fileExtension = data.file.name.split('.').pop()?.toLowerCase() || '';
    
    const newSupport = {
      id: `support-${Date.now()}`,
      title: data.title,
      fileName: data.file.name,
      fileSize: formatFileSize(data.file.size),
      fileUrl: fileUrl,
      fileType: fileExtension,
      createdBy: user?.name || 'Enseignant',
      createdAt: new Date().toLocaleDateString('fr-FR')
    };
    setCourseSupports(prev => [newSupport, ...prev]);
    setIsAddSupportModalOpen(false);
  };

  const handleViewSupport = (support: typeof courseSupports[0]) => {
    // Fonction pour visualiser/télécharger le support
    if (support.fileType === 'pdf') {
      // Ouvrir le PDF dans un nouvel onglet
      window.open(support.fileUrl, '_blank');
    } else if (['doc', 'docx', 'ppt', 'pptx'].includes(support.fileType)) {
      // Pour les fichiers Office, on peut utiliser Office Online ou télécharger directement
      const link = document.createElement('a');
      link.href = support.fileUrl;
      link.download = support.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Autres types de fichiers - téléchargement direct
      const link = document.createElement('a');
      link.href = support.fileUrl;
      link.download = support.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!courseData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'ppt':
      case 'pptx':
        return '📊';
      default:
        return '📎';
    }
  };

  const handleDeleteSupport = (supportId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Empêche le clic de déclencher l'ouverture du fichier
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce support de cours ?')) {
      setCourseSupports(prev => prev.filter(support => support.id !== supportId));
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Modal d'ajout de support pour enseignants */}
      {isTeacher && (
        <AddSupportModal
          isOpen={isAddSupportModalOpen}
          onClose={() => setIsAddSupportModalOpen(false)}
          onApply={handleAddSupport}
        />
      )}

      {/* En-tête avec navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/mes-cours')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour aux cours</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getSubjectIcon(courseData.subject)}
              <div>
                <h1 className="text-xl font-bold text-slate-800">{courseData.title}</h1>
                <p className="text-slate-600 text-sm">{courseData.subject} • {courseData.theme}</p>
              </div>
            </div>

            {/* Bouton d'ajout de support pour enseignants */}
            {isTeacher && (
              <button
                onClick={() => setIsAddSupportModalOpen(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Ajouter un support</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          
                     {/* Section À propos - 3 colonnes */}
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
                {isTeacher 
                  ? `En tant qu'enseignant, vous pouvez gérer ce cours "${courseData.title}" de ${courseData.subject.toLowerCase()} sur le thème "${courseData.theme}". Ajoutez des supports pédagogiques, suivez la progression de vos élèves et adaptez votre enseignement selon leurs besoins.`
                  : `Cette leçon "${courseData.title}" fait partie du cours de ${courseData.subject.toLowerCase()} sur le thème "${courseData.theme}". Elle vous permettra de développer vos compétences et connaissances de manière progressive. Vous trouverez ci-dessous toutes les informations et ressources nécessaires.`
                }
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
                <div className="w-full h-32 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">{getSubjectIcon(courseData.subject)}</span>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-slate-700">{courseData.subject}</span>
                </div>
              </div>

              {/* Progression visuelle */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  {isTeacher ? 'Progression générale' : 'Votre progression'}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="w-full bg-white/60 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500" 
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

                 {/* Statistiques */}
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

        {/* Section supports de cours (visible pour les enseignants) */}
        {isTeacher && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800">Supports de cours</h2>
                <span className="text-sm text-slate-500">{courseSupports.length} support(s)</span>
              </div>
              <button
                onClick={() => setIsAddSupportModalOpen(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Ajouter un support
              </button>
            </div>
            
            {courseSupports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseSupports.map((support) => (
                  <div 
                    key={support.id} 
                    onClick={() => handleViewSupport(support)}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative"
                  >
                    {/* Bouton de suppression pour enseignants */}
                    {isTeacher && (
                      <button
                        onClick={(e) => handleDeleteSupport(support.id, e)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 opacity-0 group-hover:opacity-100 transition-all z-10"
                        title="Supprimer ce support"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <span className="text-xl">{getFileIcon(support.fileType)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors truncate" title={support.title}>{support.title}</h3>
                        <p className="text-sm text-slate-600 mb-2 truncate" title={support.fileName}>{support.fileName} • {support.fileSize}</p>
                        <div className="text-xs text-slate-500">
                          Ajouté par {support.createdBy} le {support.createdAt}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {support.fileType === 'pdf' ? 'Cliquer pour visualiser' : 'Cliquer pour télécharger'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun support de cours</h3>
                <p className="text-slate-500 mb-4">
                  Commencez par ajouter des supports pédagogiques pour enrichir ce cours.
                </p>
                <button
                  onClick={() => setIsAddSupportModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter mon premier support
                </button>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
};

export default CourseDetailPage;
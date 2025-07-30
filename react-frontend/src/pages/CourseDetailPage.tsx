import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Plus,
  FileText,
  Video,
  Image,
  Link,
  User,
  BookMarked,
  Globe,
  Palette,
  Footprints,
  HeartHandshake,
  Calculator,
  FlaskConical,
  Landmark,
  Languages,
  Calendar,
  File,
  HardDrive,
  Tag,
  Eye,
  Search
} from 'lucide-react';
import { getEnrichedCourses, EnrichedCourse } from '../lib/mock-student-data';
import { CourseResource } from '../services/courseResourceService';
import ResourceAssociationModal from '../components/course/ResourceAssociationModal';
import { useResources } from '../contexts/ResourceContext';

// Types améliorés
interface Lesson {
  id: string;
  title: string;
  date: string;
  duration: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  progress: number;
  resources: CourseResource[];
  competences: string[];
  objectives: string[];
  materials: string[];
}

interface CourseStats {
  totalLessons: number;
  completedLessons: number;
  totalResources: number;
  activeStudents: number;
  averageProgress: number;
  nextLessonDate: string;
  lastActivity: string;
}

// Interface pour les ressources affichées
interface DisplayResource {
  id: number;
  title: string;
  subject: string;
  description: string;
  addedDate: string;
  author: string;
  isArchived: boolean;
  imageUrl?: string;
  competence?: string;
  visibility?: "PRIVATE" | "CLASS" | "SCHOOL";
  fileType?: "PDF" | "DOCX" | "PPTX" | "VIDEO" | "IMAGE" | "LINK" | "AUDIO" | "DOC" | "PPT" | "XLS" | "XLSX" | "TXT" | "HTML" | "JSON" | "ZIP" | "FILE";
  fileSize?: number;
  version?: number;
  isPaid?: boolean;
}

// Fonction pour obtenir l'icône selon le type de fichier
const getIconForFileType = (fileType: string) => {
  switch (fileType) {
    case 'PDF':
    case 'DOCX':
    case 'PPTX':
      return FileText;
    case 'VIDEO':
      return Video;
    case 'IMAGE':
      return Image;
    case 'LINK':
      return Link;
    default:
      return FileText;
  }
};

// Fonction pour obtenir l'icône selon la matière
const getIconForSubject = (subject: string) => {
  switch (subject) {
    case 'Mathématiques':
      return Calculator;
    case 'Français':
      return BookOpen;
    case 'Anglais':
      return Languages;
    case 'Histoire':
      return Landmark;
    case 'Géographie':
      return Globe;
    case 'Sciences':
      return FlaskConical;
    case 'Arts plastiques':
      return Palette;
    case 'EPS':
      return Footprints;
    case 'Études islamiques':
      return HeartHandshake;
    case 'Quran':
      return BookMarked;
    case 'Vivre Ensemble':
      return Users;
    default:
      return BookOpen; // Icône par défaut
  }
};

// Couleurs pour les badges de matière
const subjectBadgeColors: { [key: string]: string } = {
  "Mathématiques": "bg-amber-100 text-amber-700",
  "Français": "bg-red-100 text-red-700",
  "Anglais": "bg-indigo-100 text-indigo-700",
  "Histoire": "bg-amber-100 text-amber-700",
  "Géographie": "bg-cyan-100 text-cyan-600",
  "Sciences": "bg-green-100 text-green-700",
  "Arts plastiques": "bg-purple-100 text-purple-700",
  "EPS": "bg-orange-100 text-orange-700",
  "Études islamiques": "bg-emerald-100 text-emerald-700",
  "Quran": "bg-emerald-100 text-emerald-700",
  "Vivre Ensemble": "bg-pink-100 text-pink-700"
};

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { resources } = useResources();
  
  // États principaux
  const [course, setCourse] = useState<EnrichedCourse | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  
  // États pour les ressources
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "free">("all");

  // Charger les données du cours
  useEffect(() => {
    const loadCourseData = async () => {
      setIsLoading(true);
      try {
  const enrichedCourses = getEnrichedCourses(navigate);
        const foundCourse = enrichedCourses.find(c => c.id === courseId);
        
        if (foundCourse) {
          setCourse(foundCourse);
          
          // Générer des leçons enrichies basées sur les données du cours
          const generatedLessons: Lesson[] = [
            {
              id: 'lesson-1',
              title: `${foundCourse.title} - Introduction`,
              date: '2024-01-15',
              duration: '45 min',
              description: `Introduction aux concepts de base de ${foundCourse.subject.toLowerCase()}`,
              status: 'completed',
              progress: 100,
              resources: [],
              competences: foundCourse.competences.slice(0, 2),
              objectives: ['Comprendre les concepts fondamentaux', 'Identifier les éléments principaux'],
              materials: ['Manuel scolaire', 'Fiches d\'exercices']
            },
            {
              id: 'lesson-2',
              title: `${foundCourse.title} - Approfondissement`,
              date: '2024-01-17',
              duration: '45 min',
              description: `Approfondissement des notions de ${foundCourse.subject.toLowerCase()}`,
              status: 'completed',
              progress: 100,
              resources: [],
              competences: foundCourse.competences.slice(2, 4),
              objectives: ['Appliquer les concepts', 'Résoudre des problèmes simples'],
              materials: ['Exercices pratiques', 'Vidéos explicatives']
            },
            {
              id: 'lesson-3',
              title: `${foundCourse.title} - Application`,
              date: '2024-01-19',
              duration: '45 min',
              description: `Application pratique des concepts de ${foundCourse.subject.toLowerCase()}`,
              status: 'active',
              progress: 75,
              resources: [],
              competences: foundCourse.competences.slice(4, 6),
              objectives: ['Créer et analyser', 'Développer des compétences avancées'],
              materials: ['Projets pratiques', 'Évaluations formatives']
            },
            {
              id: 'lesson-4',
              title: `${foundCourse.title} - Évaluation`,
              date: '2024-01-22',
              duration: '45 min',
              description: `Évaluation et consolidation de ${foundCourse.subject.toLowerCase()}`,
              status: 'upcoming',
              progress: 0,
              resources: [],
              competences: foundCourse.competences.slice(6),
              objectives: ['Évaluer et synthétiser', 'Consolider les acquis'],
              materials: ['Évaluations sommatives', 'Ressources de révision']
            }
          ];
          
          setLessons(generatedLessons);
          
          // Calculer les statistiques du cours basées sur les données réelles
          const courseResources = resources.filter(r => r.subject === foundCourse.subject && !r.isArchived);
          const stats: CourseStats = {
            totalLessons: foundCourse.totalLessons,
            completedLessons: foundCourse.completedLessons,
            totalResources: courseResources.length,
            activeStudents: 25,
            averageProgress: foundCourse.progress,
            nextLessonDate: foundCourse.nextLessonDate,
            lastActivity: '2024-01-19'
          };
          
          setCourseStats(stats);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du cours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId, navigate, resources]);

  const handleResourceAssociated = (resource: CourseResource) => {
    console.log('Ressource associée:', resource);
    // Rafraîchir les données si nécessaire
  };

  const handleQuickAssociation = (lessonId?: string) => {
    setSelectedLesson(lessonId ? lessons.find(l => l.id === lessonId) || null : null);
    setIsResourceModalOpen(true);
  };

  // Filtrer les ressources par matière du cours
  const courseResources = course ? resources.filter(r => r.subject === course.subject && !r.isArchived) : [];

  // Filtrer les ressources selon les critères
  const filteredResources = courseResources.filter((resource) => {
    if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (fileTypeFilter && resource.fileType !== fileTypeFilter) {
      return false;
    }
    if (visibilityFilter && resource.visibility !== visibilityFilter) {
      return false;
    }
    if (paymentFilter === "paid" && !resource.isPaid) return false;
    if (paymentFilter === "free" && resource.isPaid) return false;
    return true;
  });

  // Convertir les ressources en DisplayResource
  const displayedResources: DisplayResource[] = filteredResources.map((resource) => {
    return {
      id: resource.id,
      title: resource.title,
      subject: resource.subject,
      description: resource.description,
      addedDate: new Date().toLocaleDateString("fr-FR"),
      author: resource.author?.name || "Enseignant",
      isArchived: resource.isArchived,
      imageUrl: resource.imageUrl,
      competence: resource.competence,
      visibility: resource.visibility || "SCHOOL",
      fileType: resource.fileType || "PDF",
      fileSize: resource.fileSize || 2048576,
      version: resource.version || 1,
      isPaid: resource.isPaid
    };
  });

  // Composant pour afficher une ressource
  const ResourceListItem: React.FC<{ resource: DisplayResource }> = ({ resource }) => {
    const Icon = getIconForFileType(resource.fileType || "PDF");
    const badgeColor = subjectBadgeColors[resource.subject] || "bg-gray-600 text-white";

    const formatFileSize = (bytes?: number): string => {
      if (!bytes) return "N/A";
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleCardClick = () => {
      if (resource.isPaid) {
        navigate(`/paiement/${resource.id}`);
        return;
      }
      navigate(`/ressources/${resource.id}`);
    };

    return (
      <div
        className={`group bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden cursor-pointer ${
          resource.isPaid
            ? "border-yellow-300 hover:border-yellow-400 hover:shadow-lg"
            : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
        }`}
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-label={`Voir la ressource ${resource.title}`}
      >
        <div className="flex h-32">
          {/* Image/Thumbnail à gauche */}
          <div className="w-32 h-32 flex-shrink-0 bg-white border-r border-gray-200 relative">
            {resource.imageUrl ? (
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <Icon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            {resource.isPaid && (
              <div className="absolute bottom-2 right-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">F CFA</span>
                </div>
              </div>
            )}
          </div>

          {/* Contenu principal à droite */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            {/* En-tête avec titre et badges */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                    {resource.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold shadow-sm ${badgeColor}`}
                  >
                    {resource.subject}
                  </span>
                </div>
                {resource.isPaid && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-400 text-white text-xs font-bold">
                    Payant
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {resource.description && (
              <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                {resource.description}
              </div>
            )}

            {/* Métadonnées et actions */}
            <div className="flex items-center justify-between">
              {/* Métadonnées de base */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{resource.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{resource.addedDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Métadonnées techniques */}
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                    <File className="w-3 h-3" />
                    {resource.fileType || "PDF"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                    <HardDrive className="w-3 h-3" />
                    {resource.fileSize ? formatFileSize(resource.fileSize) : "2.5 MB"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-md text-xs font-medium text-blue-700">
                    <Tag className="w-3 h-3" />v{resource.version || 1}
                  </span>
                  {resource.visibility && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                        resource.visibility === "PRIVATE"
                          ? "bg-red-100 text-red-700"
                          : resource.visibility === "CLASS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      {resource.visibility === "PRIVATE"
                        ? "Privé"
                        : resource.visibility === "CLASS"
                        ? "Classe"
                        : "École"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuickResourceAssociation: React.FC<{ 
    courseId: string; 
    lessonId?: string;
    lessonTitle?: string;
  }> = ({ lessonId, lessonTitle }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {lessonTitle ? `Associer une ressource à "${lessonTitle}"` : 'Associer une ressource au cours'}
            </h2>
            <p className="text-gray-600 text-sm">
              {lessonTitle 
                ? 'Ajoutez des ressources spécifiques à cette leçon'
                : 'Ajoutez des ressources générales au cours'
              }
            </p>
          </div>
          <button
            onClick={() => handleQuickAssociation(lessonId)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Joindre ressource
          </button>
        </div>
      </div>
    );
  };

  const CourseStatsSection: React.FC = () => {
    if (!courseStats) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques du cours</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{courseStats.averageProgress}%</div>
            <div className="text-sm text-gray-600">Progression</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{courseStats.completedLessons}/{courseStats.totalLessons}</div>
            <div className="text-sm text-gray-600">Leçons terminées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{courseStats.activeStudents}</div>
            <div className="text-sm text-gray-600">Élèves actifs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{courseStats.nextLessonDate}</div>
            <div className="text-sm text-gray-600">Prochaine leçon</div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!course) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Cours non trouvé</h2>
          <p className="text-gray-500 mb-4">Le cours que vous recherchez n'existe pas.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const SubjectIcon = getIconForSubject(course.subject);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600">{course.domain} • {course.subject}</p>
              </div>
            </div>

            {/* Removed settings and edit course buttons */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vue d'ensemble unique */}
        <div className="space-y-6">
          {/* Association rapide de ressources */}
          <QuickResourceAssociation courseId={course.id} />
          
          {/* Statistiques du cours */}
          <CourseStatsSection />
          
          {/* Description complète du cours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                <SubjectIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Description du cours</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {course.theme}
                </p>
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span><strong>Domaine :</strong> {course.domain}</span>
                </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span><strong>Enseignant :</strong> {course.teacher}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span><strong>Classe :</strong> {course.classId.toUpperCase()}</span>
                    </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span><strong>Horaire :</strong> {course.time}</span>
                  </div>
                </div>
                
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Informations supplémentaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                  <strong>Progression :</strong> {course.progress}% ({course.completedLessons}/{course.totalLessons} leçons)
                    </div>
                <div>
                  <strong>Statut :</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'active' ? 'bg-green-100 text-green-700' :
                    course.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {course.status === 'active' ? 'En cours' :
                     course.status === 'completed' ? 'Terminé' : 'À venir'}
                  </span>
                  </div>
                <div>
                  <strong>Prochaine leçon :</strong> {course.nextLessonDate}
                </div>
                    <div>
                  <strong>Compétences visées :</strong> {course.competences.length} compétences
              </div>
            </div>
          </div>
        </div> 

          {/* Compétences visées */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Compétences visées</h2>
                <div className="flex flex-wrap gap-2">
                  {course.competences.map((competence, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                    >
                      {competence}
                    </span>
                  ))}
              </div>
              </div>

          {/* Ressources */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Ressources</h2>
              <button
                onClick={() => handleQuickAssociation()}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <Plus className="w-4 h-4" />
                Joindre ressource
              </button>
            </div>

            {/* Filtres */}
            <div className="mb-6 space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une ressource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Filtres avancés */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Tous les types</option>
                  <option value="PDF">PDF</option>
                  <option value="VIDEO">Vidéo</option>
                  <option value="IMAGE">Image</option>
                  <option value="LINK">Lien</option>
                </select>

                <select
                  value={visibilityFilter}
                  onChange={(e) => setVisibilityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Toutes les visibilités</option>
                  <option value="PRIVATE">Privé</option>
                  <option value="CLASS">Classe</option>
                  <option value="SCHOOL">École</option>
                </select>

                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as "all" | "paid" | "free")}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Toutes les ressources</option>
                  <option value="free">Gratuites</option>
                  <option value="paid">Payantes</option>
                </select>
              </div>
            </div>

            {/* Liste des ressources */}
              <div className="space-y-4">
              {displayedResources.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune ressource trouvée</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    {searchTerm 
                      ? `Aucune ressource ne correspond à "${searchTerm}". Essayez de modifier votre recherche.`
                      : "Il n'y a pas encore de ressources pour ce cours."
                    }
                  </p>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Effacer la recherche
                    </button>
            )}
          </div>
              ) : (
                displayedResources.map((resource) => (
                  <ResourceListItem key={resource.id} resource={resource} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'association de ressources */}
      <ResourceAssociationModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        courseId={course.id}
        lessonId={selectedLesson?.id}
        onResourceAssociated={handleResourceAssociated}
      />
    </div>
  );
};

export default CourseDetailPage;
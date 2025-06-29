import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  BookOpen, 
  Calendar,
  Clock,
  CheckCircle,
  User,
  FileText,
  Target,
  TrendingUp,
  ArrowLeft,
  Calculator,
  Beaker,
  Globe,
  MapPin,
  Upload,
  Paperclip,
  Book,
  Users,
  Palette,
  Activity,
  Download,
  Play
} from 'lucide-react';
import { getStudentAssignments, StudentAssignment } from '../../lib/mock-student-data';

// Fonction pour obtenir l'icône selon la matière
const getSubjectIcon = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'mathématiques': return Calculator;
    case 'français': return FileText;
    case 'sciences': return Beaker;
    case 'anglais': return Globe;
    case 'histoire': return BookOpen;
    case 'géographie': return MapPin;
    case 'études islamiques': return Book;
    case 'quran': return Book;
    case 'vivre ensemble': return Users;
    case 'arts plastiques': return Palette;
    case 'eps': return Activity;
    default: return BookOpen;
  }
};

// Fonction pour obtenir la couleur selon le domaine
const getDomainColor = (domain: string) => {
  switch (domain) {
    case 'Langues et Communication': return 'bg-blue-500';
    case 'STEM': return 'bg-green-500';
    case 'Sciences Humaines': return 'bg-purple-500';
    case 'Créativité & Sport': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};

// Fonction pour obtenir l'icône selon le type de ressource
const getResourceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf': return FileText;
    case 'audio': return Play;
    case 'materiel': return Target;
    default: return Download;
  }
};

// Fonction pour obtenir le devoir par ID
const getAssignmentById = (id: string): StudentAssignment | null => {
  const assignments = getStudentAssignments();
  return assignments.find(a => a.id.toString() === id) || null;
};

const DevoirDetailPage: React.FC = () => {
  const { devoirId } = useParams<{ devoirId: string }>();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const assignment = getAssignmentById(devoirId || '');

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Devoir non trouvé</h1>
          <p className="text-slate-600 mb-4">Le devoir demandé n'existe pas ou a été supprimé.</p>
          <Link 
            to="/devoirs" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors shadow"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            Retour aux devoirs
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'overdue': return 'En retard';
      default: return 'En attente';
    }
  };

  const getScoreColor = (expectedScore?: number) => {
    if (!expectedScore) return 'text-gray-500';
    if (expectedScore >= 75) return 'text-green-600';
    if (expectedScore >= 50) return 'text-orange-500';
    return 'text-red-600';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      setIsSubmitted(true);
      // Ici, on pourrait envoyer le fichier au serveur
      setTimeout(() => {
        navigate('/devoirs');
      }, 2000);
    }
  };

  const SubjectIcon = getSubjectIcon(assignment.subject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6">
        {/* Fil d'ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <Link to="/devoirs" className="hover:text-slate-800">Mes devoirs</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">{assignment.title}</span>
        </div>

        {/* En-tête du devoir */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Icône de matière */}
            <div className={`w-16 h-16 rounded-xl ${getDomainColor(assignment.domain)} flex items-center justify-center flex-shrink-0`}>
              <SubjectIcon className="w-8 h-8 text-white" />
            </div>

            {/* Informations principales */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    {assignment.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="font-medium">{assignment.subject}</span>
                    <span>•</span>
                    <span>{assignment.domain}</span>
                    <span>•</span>
                    <span className="font-medium">Compétence : {assignment.competence}</span>
                  </div>
      </div>

                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(assignment.status)}`}>
                  {getStatusText(assignment.status)}
                </div>
              </div>

              {/* Métriques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Échéance</p>
                    <p className="font-medium text-slate-800">{assignment.dueDate}</p>
                  </div>
                </div>
                
                {assignment.expectedScore && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Score attendu</p>
                      <p className={`font-medium ${getScoreColor(assignment.expectedScore)}`}>
                        {assignment.expectedScore}%
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Domaine</p>
                    <p className="font-medium text-slate-800">{assignment.domain}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Matière</p>
                    <p className="font-medium text-slate-800">{assignment.subject}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Description
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {assignment.description}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Instructions
              </h2>
              <div className="space-y-3">
                {assignment.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-slate-600">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ressources */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Ressources nécessaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignment.resources.map((resource, index) => {
                  const ResourceIcon = getResourceIcon(resource.type);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <ResourceIcon className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-800">{resource.name}</p>
                        <p className="text-sm text-slate-500 capitalize">{resource.type}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Soumission */}
            {assignment.status === 'pending' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Soumettre mon travail
                </h3>
                
                {!isSubmitted ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600 mb-1">Cliquez pour choisir un fichier</p>
                        <p className="text-xs text-slate-500">PDF, DOC, JPG, PNG (max 10MB)</p>
                      </label>
                    </div>
                    
                    {selectedFile && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Paperclip className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800 font-medium">{selectedFile.name}</span>
                      </div>
                    )}
                    
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedFile}
                      className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow"
                    >
                      Soumettre le devoir
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h4 className="font-semibold text-green-800 mb-1">Devoir soumis !</h4>
                    <p className="text-sm text-green-600">Votre travail a été envoyé avec succès</p>
                  </div>
                )}
              </div>
            )}

            {/* Informations complémentaires */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Compétence évaluée</p>
                    <p className="font-medium text-slate-800">{assignment.competence}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Domaine</p>
                    <p className="font-medium text-slate-800">{assignment.domain}</p>
                  </div>
                </div>

                {assignment.expectedScore && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Score attendu</p>
                      <p className={`font-medium ${getScoreColor(assignment.expectedScore)}`}>
                        {assignment.expectedScore}%
            </p>
          </div>
        </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/devoirs"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux devoirs
                </Link>
                
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  <User className="w-4 h-4" />
                  Contacter l'enseignant
                </button>
              </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DevoirDetailPage; 
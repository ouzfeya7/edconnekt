import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResources as useRemoteResources } from '../hooks/useResources';
import { useRestoreResource } from '../hooks/useRestoreResource';
import { useAuth } from '../pages/authentification/useAuth';
import { 
  ArrowLeft, Search, FileText, Archive, RefreshCw, Filter, 
  Calendar, User, HardDrive, Eye, Lock, Users, Globe, 
  Download, RotateCcw, Trash2, MoreVertical, Info, AlertCircle,
  ChevronLeft, ChevronRight, Plus, FolderOpen, Clock
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { ResourceStatus } from '../api/resource-service/api';
import { subjectIdToNameMap } from './RessourcesPage';

// Data for domains and subjects, matching RessourcesPage exactly
const domainsData: { [key: string]: string[] } = {
  "LANGUES ET COMMUNICATION": ["Anglais", "Français"],
  "SCIENCES HUMAINES": ["Études islamiques", "Géographie", "Histoire", "Lecture arabe", "Qran", "Vivre dans son milieu", "Vivre ensemble", "Wellness"],
  "STEM": ["Mathématiques"],
  "CREATIVITE ARTISTIQUE / SPORTIVE": ["Arts plastiques", "EPS", "Motricité", "Musique", "Théâtre/Drama"],
};

const domainNames = [
  "LANGUES ET COMMUNICATION",
  "SCIENCES HUMAINES",
  "STEM",
  "CREATIVITE ARTISTIQUE / SPORTIVE",
];

// Couleurs subtiles spécifiques à chaque matière
const subjectColors: { [key: string]: string } = {
  "Arts plastiques": "bg-indigo-400", "EPS": "bg-sky-400", "Motricité": "bg-cyan-400",
  "Musique": "bg-violet-400", "Théâtre/Drama": "bg-purple-400", "Anglais": "bg-emerald-400",
  "Français": "bg-green-400", "Mathématiques": "bg-amber-400", "Études islamiques": "bg-teal-400",
  "Géographie": "bg-blue-400", "Histoire": "bg-slate-400", "Lecture arabe": "bg-lime-400",
  "Qran": "bg-rose-400", "Vivre dans son milieu": "bg-stone-400", "Vivre ensemble": "bg-pink-400",
  "Wellness": "bg-orange-400",
};

const subjectBadgeColors: { [key: string]: string } = {
  "Arts plastiques": "bg-indigo-50 text-indigo-700", "EPS": "bg-sky-50 text-sky-700",
  "Motricité": "bg-cyan-50 text-cyan-700", "Musique": "bg-violet-50 text-violet-700",
  "Théâtre/Drama": "bg-purple-50 text-purple-700", "Anglais": "bg-emerald-50 text-emerald-700",
  "Français": "bg-green-50 text-green-700", "Mathématiques": "bg-amber-50 text-amber-700",
  "Études islamiques": "bg-teal-50 text-teal-700", "Géographie": "bg-blue-50 text-blue-700",
  "Histoire": "bg-slate-50 text-slate-700", "Lecture arabe": "bg-lime-50 text-lime-700",
  "Qran": "bg-rose-50 text-rose-700", "Vivre dans son milieu": "bg-stone-50 text-stone-700",
  "Vivre ensemble": "bg-pink-50 text-pink-700", "Wellness": "bg-orange-50 text-orange-700",
};

const getIconForSubject = (subject: string) => {
    switch (subject) {
    case "Arts plastiques": return FileText;
    case "EPS": return FileText;
    case "Motricité": return FileText;
    case "Musique": return FileText;
    case "Théâtre/Drama": return FileText;
    case "Anglais": return FileText;
    case "Français": return FileText;
    case "Mathématiques": return FileText;
    case "Études islamiques": return FileText;
    case "Géographie": return FileText;
    case "Histoire": return FileText;
    case "Lecture arabe": return FileText;
    case "Qran": return FileText;
    case "Vivre dans son milieu": return FileText;
    case "Vivre ensemble": return FileText;
    case "Wellness": return FileText;
        default: return FileText;
    }
};

interface ArchivedResource {
    id: number;
    title: string;
    subject: string;
  description: string;
  imageUrl?: string;
    isArchived: boolean;
  isPaid?: boolean;
  visibility?: 'PRIVATE' | 'CLASS' | 'SCHOOL';
  fileType?: string;
  fileSize?: number;
  author?: {
    id: string;
    name: string;
    role: string;
  };
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  archivedAt?: string;
}

interface ArchivedResourceListItemProps {
  resource: ArchivedResource;
  onRestore: () => void;
  canModify: boolean;
}

const ArchivedResourceListItem: React.FC<ArchivedResourceListItemProps> = ({ 
  resource, 
  onRestore, 
  canModify 
}) => {
    const Icon = getIconForSubject(resource.subject);
    const bgColor = subjectColors[resource.subject] || "bg-gray-400";
    const badgeColor = subjectBadgeColors[resource.subject] || "bg-gray-50 text-gray-700";
  const navigate = useNavigate();

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVisibilityIcon = (visibility?: string) => {
    switch (visibility) {
      case 'PRIVATE': return <Lock className="w-4 h-4" />;
      case 'CLASS': return <Users className="w-4 h-4" />;
      case 'SCHOOL': return <Globe className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = (visibility?: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'Privé';
      case 'CLASS': return 'Classe';
      case 'SCHOOL': return 'École';
      default: return 'Inconnu';
    }
  };

  const getVisibilityColor = (visibility?: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'bg-red-100 text-red-700';
      case 'CLASS': return 'bg-blue-100 text-blue-700';
      case 'SCHOOL': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

    return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-6">
                <div className="flex items-start gap-6">
          {/* Image/Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {resource.imageUrl ? (
                <img 
                  src={resource.imageUrl} 
                  alt={resource.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon className="w-8 h-8 text-gray-400" />
              )}
            </div>
                    </div>
                    
                    {/* Contenu principal */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                                    {resource.title}
                                </h3>
                                
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
                                        {resource.subject}
                                    </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                    <Archive className="w-3 h-3 mr-1" />
                                        Archivé
                                    </span>
                  {resource.isPaid && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                      Payant
                    </span>
                  )}
                  {resource.visibility && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getVisibilityColor(resource.visibility)}`}>
                      {getVisibilityIcon(resource.visibility)}
                      {getVisibilityLabel(resource.visibility)}
                    </span>
                  )}
                                </div>
                                
                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {resource.description}
                </p>

                {/* Métadonnées */}
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                    <span>{resource.author?.name || 'Enseignant'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                    <span>Créé le {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Archivé le {resource.archivedAt || new Date().toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    <span>{resource.fileSize ? formatFileSize(resource.fileSize) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            
              {/* Actions */}
                            {canModify && (
                <div className="flex items-center gap-2">
                                    <Dialog>
                                    <DialogTrigger asChild>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                                        <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Actions</DialogTitle>
                                        </DialogHeader>
                      <div className="space-y-2">
                        <button 
                          onClick={() => navigate(`/ressources/${resource.id}`)}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span>Voir les détails</span>
                        </button>
                        <button 
                          onClick={() => {/* Télécharger */}}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
                        >
                          <Download className="w-4 h-4 text-green-500" />
                          <span>Télécharger</span>
                                                </button>
                                                <button 
                           onClick={onRestore}
                           className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
                                                >
                           <RotateCcw className="w-4 h-4 text-orange-500" />
                           <span>Restaurer</span>
                                                </button>
                        
                      </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function ArchivesPage() {
    const navigate = useNavigate();
  const restoreMutation = useRestoreResource();
  const { roles } = useAuth();
    
    const canModifyResources = roles.includes('enseignant') || roles.includes('directeur') || roles.includes('administrateur');
    
    const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'subject'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<number | string | null>(null);
  
  const itemsPerPage = 8;

  const {
    data: archivedResources,
    isLoading: isLoading,
    error: error,
  } = useRemoteResources({
    status: ResourceStatus.Archived,
    limit: 100, // TODO: Implement proper pagination
  });

  // Tri des ressources (côté client pour l'instant)
  const sortedResources = [...(archivedResources || [])].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'subject':
        aValue = (subjectIdToNameMap[a.subject_id] || String(a.subject_id)).toLowerCase();
        bValue = (subjectIdToNameMap[b.subject_id] || String(b.subject_id)).toLowerCase();
        break;
      case 'date':
      default:
        aValue = new Date(a.createdAt || '').getTime();
        bValue = new Date(b.createdAt || '').getTime();
        break;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
    });

    useEffect(() => {
        setCurrentPage(1);
  }, [searchTerm, selectedDomain, selectedSubject]);

  const totalPages = Math.ceil(sortedResources.length / itemsPerPage);
  const paginatedResources = sortedResources.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

  const handleRestore = (resourceId: number | string) => {
    restoreMutation.mutate(String(resourceId), {
      onSuccess: () => {
    setShowRestoreConfirm(null);
      }
    });
  };



  const getSubjectsForDomain = (domain: string) => {
    return domain === 'all' ? [] : domainsData[domain] || [];
  };

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/ressources')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ressources Archivées</h1>
                <p className="text-gray-600 mt-1">
                  {archivedResources?.length || 0} ressource{archivedResources?.length !== 1 ? 's' : ''} archivée{archivedResources?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                placeholder="Rechercher dans les archives..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                </div>

            {/* Domaine */}
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setSelectedSubject('all');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            >
              <option value="all">Tous les domaines</option>
              {domainNames.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>

            {/* Matière */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              disabled={selectedDomain === 'all'}
            >
              <option value="all">Toutes les matières</option>
              {getSubjectsForDomain(selectedDomain).map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Tri */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort as 'date' | 'title' | 'subject');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            >
              <option value="date-desc">Plus récentes</option>
              <option value="date-asc">Plus anciennes</option>
              <option value="title-asc">Titre A-Z</option>
              <option value="title-desc">Titre Z-A</option>
              <option value="subject-asc">Matière A-Z</option>
              <option value="subject-desc">Matière Z-A</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Archive className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total archivées</p>
                <p className="text-2xl font-bold text-gray-900">{archivedResources?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">PDF</p>
                <p className="text-2xl font-bold text-gray-900">
                  {archivedResources?.filter(r => r.fileType === 'PDF').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Enseignants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(archivedResources?.map(r => r.author?.name)).size || 0}
                </p>
                    </div>
                </div>
            </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HardDrive className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Espace utilisé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {archivedResources?.reduce((sum, r) => sum + (r.fileSize || 0), 0) > 0 
                    ? Math.round(archivedResources?.reduce((sum, r) => sum + (r.fileSize || 0), 0) / (1024 * 1024)) + ' MB'
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des ressources */}
            <div className="space-y-6">
                {paginatedResources.length > 0 ? (
                    paginatedResources.map(resource => (
                        <ArchivedResourceListItem 
                            key={resource.id} 
                            resource={{
                              id: resource.id,
                              title: resource.title,
                              subject: subjectIdToNameMap[resource.subject_id] || String(resource.subject_id),
                              description: resource.description || "",
                              isArchived: true,
                              visibility: resource.visibility,
                              fileSize: resource.size_bytes,
                              author: {id: resource.author_user_id, name: resource.author_user_id, role: ""},
                              createdAt: resource.created_at,
                              updatedAt: resource.updated_at,
                              version: resource.version,
                              archivedAt: resource.updated_at, // Using updated_at for now
                            }}
                  onRestore={() => setShowRestoreConfirm(resource.id)}
                            canModify={canModifyResources}
                        />
                    ))
                ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="max-w-md mx-auto">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune ressource archivée</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedDomain !== 'all' || selectedSubject !== 'all'
                    ? 'Aucune ressource ne correspond à vos critères de recherche.'
                    : 'Aucune ressource n\'est actuellement archivée.'
                  }
                </p>
                {(searchTerm || selectedDomain !== 'all' || selectedSubject !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDomain('all');
                      setSelectedSubject('all');
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages} • {sortedResources.length} ressource{sortedResources.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
                        </div>
                    </div>
                )}
            </div>

      {/* Modal de confirmation de restauration */}
      {showRestoreConfirm && (
        <Dialog open={!!showRestoreConfirm} onOpenChange={() => setShowRestoreConfirm(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Confirmer la restauration</DialogTitle>
              <div className="text-gray-600 mt-2">
                Voulez-vous vraiment restaurer cette ressource ? Elle sera de nouveau visible sur la page principale des ressources.
              </div>
            </DialogHeader>
            <DialogFooter className="gap-3 mt-6">
              <DialogClose asChild>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 font-medium transition">
                  Annuler
                </button>
              </DialogClose>
              <DialogClose asChild>
                                 <button 
                   onClick={() => handleRestore(showRestoreConfirm)}
                   className="flex-1 bg-green-500 text-white px-4 py-2.5 rounded-xl hover:bg-green-600 font-medium transition flex items-center justify-center gap-2"
                 >
                   <RotateCcw className="w-4 h-4" />
                   Restaurer
                 </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      
        </div>
    );
}

export default ArchivesPage; 
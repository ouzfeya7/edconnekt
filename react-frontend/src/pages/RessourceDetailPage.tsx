import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../pages/authentification/useAuth";
import { useAppRolesFromIdentity } from "../hooks/useAppRolesFromIdentity";
import { useState, useEffect, useMemo } from "react";
import { useResourceDetail } from "../hooks/useResourceDetail";
import { useResourceAudit } from "../hooks/useResourceAudit";
import { useArchiveResource } from "../hooks/useArchiveResource";
import { useRestoreResource } from "../hooks/useRestoreResource";
import { useResources as useRemoteResources } from "../hooks/useResources"; // Pour les ressources similaires
import { useDownloadResourceFile } from "../hooks/useDownloadResourceFile";
import toast from "react-hot-toast";
import { useReferentials, useReferentialTree } from "../hooks/competence/useReferentials";
import type { ReferentialListResponse, ReferentialResponse, ReferentialTree, DomainTree, SubjectTree } from "../api/competence-service/api";
import {
  User,
  BookOpen,
  FileText,
  Download,
  Eye,
  Calendar,
  File,
  HardDrive,
  Edit,
  Archive,
  History,
  ChevronRight,
  Users,
  Lock,
  Globe,
  RotateCcw,
  Folder,
  FileImage,
  FileVideo,
  Presentation,
  X,
} from "lucide-react";


const RessourceDetailPage = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();

  const { user, roles } = useAuth();
  const { capabilities } = useAppRolesFromIdentity();
  const { data: resource, isLoading, error } = useResourceDetail(resourceId!);
  const { data: auditLogs } = useResourceAudit(resourceId!);
  const archiveMutation = useArchiveResource();
  const restoreMutation = useRestoreResource();
  const downloadMutation = useDownloadResourceFile();
  // Pour les ressources similaires, on peut utiliser le hook existant
  const { data: similarResourcesData } = useRemoteResources({ subjectId: resource?.subject_id });

  // Charger un référentiel pour mapper subject_id -> nom (UUID)
  const { data: referentials } = useReferentials({ state: 'PUBLISHED' });
  const [selectedReferentialId, setSelectedReferentialId] = useState<string | undefined>(undefined);
  const [selectedVersionNumber, setSelectedVersionNumber] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!selectedReferentialId && (referentials as ReferentialListResponse | undefined)?.items?.length) {
      const ref = (referentials as ReferentialListResponse).items[0] as ReferentialResponse;
      setSelectedReferentialId(ref.id);
      setSelectedVersionNumber(ref.version_number);
    }
  }, [referentials, selectedReferentialId]);
  const { data: refTree } = useReferentialTree(selectedReferentialId || '', selectedVersionNumber);
  const subjectIdToNameMap = useMemo(() => {
    const m = new Map<string, string>();
    const tree = refTree as ReferentialTree | undefined;
    (tree?.domains || []).forEach((d: DomainTree) => (d.subjects || []).forEach((s: SubjectTree) => m.set(s.id, s.name)));
    return m;
  }, [refTree]);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'journal'>('details');
  
  // Permissions
  const canModifyResources = capabilities.canManageResources || roles.includes("administrateur");
  const canViewAudit = capabilities.isAdminStaff || capabilities.isTeacher || roles.includes("administrateur");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {/* Simple loader */}
        <div className="text-center">
          <p>Chargement de la ressource...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ressource introuvable
          </h2>
          <p className="text-gray-600 mb-4">
            La ressource que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <button
            onClick={() => navigate("/ressources")}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Retour aux ressources
          </button>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined || bytes === null) return "Non disponible";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };



  // Fonction pour obtenir l'extension correcte basée sur le type
  const getFileExtension = (mimeType?: string): string => {
    if (!mimeType) return 'bin';
    const parts = mimeType.split('/');
    return parts[parts.length - 1];
  };

  const getVisibilityIcon = (visibility?: string) => {
    switch (visibility) {
      case "PRIVATE":
        return <Lock className="w-4 h-4" />;
      case "CLASS":
        return <Users className="w-4 h-4" />;
      case "SCHOOL":
        return <Globe className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = (visibility?: string) => {
    switch (visibility) {
      case "PRIVATE":
        return "Privé";
      case "CLASS":
        return "Classe";
      case "SCHOOL":
        return "École";
      default:
        return "Inconnu";
    }
  };

  const getVisibilityColor = (visibility?: string) => {
    switch (visibility) {
      case "PRIVATE":
        return "bg-red-100 text-red-700";
      case "CLASS":
        return "bg-blue-100 text-blue-700";
      case "SCHOOL":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File className="w-5 h-5" />;
    
    if (mimeType.startsWith('image/')) return <FileImage className="w-5 h-5 text-green-500" />;
    if (mimeType.startsWith('video/')) return <FileVideo className="w-5 h-5 text-red-500" />;
    if (mimeType === 'application/pdf') return <FileText className="w-5 h-5 text-red-600" />;
    if (mimeType.includes('wordprocessingml')) return <FileText className="w-5 h-5 text-blue-600" />;
    if (mimeType.includes('presentationml')) return <Presentation className="w-5 h-5 text-orange-500" />;
    
        return <File className="w-5 h-5 text-gray-500" />;
  };

  // Fonction pour ouvrir le visualiseur intégré
  const handleView = () => {
    // if (!resource.presigned_url) return;
    // setViewerUrl(resource.presigned_url);
    // setIsViewerOpen(true);
    alert("Fonctionnalité de visualisation non encore implémentée.");
  };

  // Fonction pour télécharger un fichier
  const handleDownload = () => {
    if (!resource) return;
    const ext = getFileExtension(resource.mime_type);
    const suggestedFilename = `${resource.title}.${ext}`;
    downloadMutation.mutate(
      { resourceId: String(resource.id), suggestedFilename },
      {
        onError: () => toast.error("Téléchargement impossible"),
        onSuccess: () => toast.success("Téléchargement lancé"),
      }
    );
  };

  // Fonction pour fermer le visualiseur
  const closeViewer = () => {
    setIsViewerOpen(false);
    setViewerUrl('');
  };

  

  // Composant pour l'onglet Détails
  const DetailsTab = () => (
    <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Fichiers de la ressource */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-500" />
                Fichiers de la ressource
              </h2>
              
              <div className="space-y-3">
                {/* Fichier principal */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    {getFileIcon(resource.mime_type)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {resource.title}.{getFileExtension(resource.mime_type)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatFileSize(resource.size_bytes)} • 
                        {resource.mime_type || "Fichier"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleView}
                      className="text-gray-400 hover:text-gray-600 transition"
                      title="Aperçu"
                      disabled
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition flex items-center gap-1 text-sm"
                      disabled={downloadMutation.isPending}
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ressources similaires */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Ressources similaires
              </h2>
              <div className="space-y-3">
                {(similarResourcesData || [])
                  .filter(
                    (r) =>
                      r.id !== resource.id && r.subject_id === resource.subject_id
                  )
                  .slice(0, 3)
                  .map((similarResource) => (
                    <div
                      key={similarResource.id}
                      onClick={() => navigate(`/ressources/${similarResource.id}`)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(similarResource.mime_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {similarResource.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {subjectIdToNameMap.get(String(similarResource.subject_id)) || "Matière inconnue"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {similarResource.mime_type || "Fichier"} • {formatFileSize(similarResource.size_bytes)}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                {(similarResourcesData || []).filter(r => r.id !== resource.id && r.subject_id === resource.subject_id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune ressource similaire trouvée</p>
                  </div>
                )}
              </div>
            </div>
    </div>
  );

  // Composant pour l'onglet Historique des versions
  const HistoryTab = () => (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-500" />
                  Historique des versions (Non implémenté par l'API)
                </h2>
                
        <div className="text-center py-8 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>La gestion des versions n'est pas encore disponible.</p>
        </div>
          </div>
  );

  // Composant pour l'onglet Journal
  const JournalTab = () => {
    return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-500" />
          Journal des actions
        </h2>
        
        {!auditLogs || auditLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune action enregistrée pour cette ressource</p>
                </div>
        ) : (
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="border-l-4 border-gray-200 pl-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                    log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                    log.action === 'ARCHIVE' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800' // 'RESTORE' n'est pas un statut d'audit, c'est un UPDATE
                  }`}>
                    {log.action}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleDateString("fr-FR", {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="text-gray-700 mb-2">
                  Action réalisée par l'utilisateur : {log.actor_id} (Rôle: {log.actor_role})
                </div>
                                {log.diff && Object.keys(log.diff).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Champs modifiés
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {Object.entries(log.diff).map(([key, value]) => (
                          <div key={key} className="bg-white p-2 rounded border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1 font-semibold">{key}</div>
                          <div className="text-gray-800 font-mono break-all">{JSON.stringify(value)}</div>
                            </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => navigate("/ressources")}
              className="hover:text-orange-500 transition"
            >
              Ressources
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{subjectIdToNameMap.get(String(resource.subject_id)) || "Matière"}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {resource.title}
              {resource.status === 'ARCHIVED' && (
                <span className="text-gray-500 ml-2">(Archivée)</span>
              )}
                  </span>
          </nav>
                </div>
              </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* En-tête de la ressource */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="flex-shrink-0 w-64 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              {getFileIcon(resource.mime_type)}
            </div>

            {/* Informations principales */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {resource.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {subjectIdToNameMap.get(String(resource.subject_id)) || "Matière"}
                    </span>
                    {/* isPaid n'est pas dans le modèle API */}
                    {resource.visibility && (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getVisibilityColor(
                          resource.visibility
                        )}`}
                      >
                        {getVisibilityIcon(resource.visibility)}
                        {getVisibilityLabel(resource.visibility)}
                      </span>
                    )}
                    {resource.status === 'ARCHIVED' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <Archive className="w-3 h-3" />
                        Archivée
                      </span>
                    )}
                  </div>
                </div>

                {/* Boutons d'actions */}
            {canModifyResources && (
                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigate(`/ressources/creer?edit=true&resourceId=${resource.id}`);
                    }}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (resource.status === 'ARCHIVED') {
                        restoreMutation.mutate(resource.id, {
                          onSuccess: () => {
                            toast.success('Ressource restaurée');
                            navigate("/ressources");
                          },
                          onError: () => toast.error('Échec de la restauration'),
                        });
                      } else {
                        const confirm = window.confirm("Archiver cette ressource ? Vous pourrez la restaurer ultérieurement.");
                        if (!confirm) return;
                        archiveMutation.mutate(resource.id, {
                          onSuccess: () => {
                            toast.success('Ressource archivée');
                            navigate("/ressources");
                          },
                          onError: () => toast.error("Échec de l'archivage"),
                        });
                      }
                    }}
                      className={`text-white px-3 py-2 rounded-lg transition flex items-center gap-2 text-sm ${
                      resource.status === 'ARCHIVED'
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {resource.status === 'ARCHIVED' ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        Restaurer
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        Archiver
                      </>
                    )}
                  </button>
              </div>
            )}
              </div>

              {/* Métadonnées rapides */}
              <div className="space-y-4">
                {/* Informations principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500 text-xs">Créé par</div>
                      <div className="font-medium text-gray-900">{resource.author_user_id === user?.id ? `${user.firstName} ${user.lastName}`: resource.author_user_id}</div>
                        </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500 text-xs">Ajouté le</div>
                      <div className="font-medium text-gray-900">{new Date(resource.created_at).toLocaleDateString("fr-FR")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500 text-xs">Type de fichier</div>
                      <div className="font-medium text-gray-900">{resource.mime_type || "Inconnu"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500 text-xs">Taille</div>
                      <div className="font-medium text-gray-900">
                        {formatFileSize(resource.size_bytes)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations techniques */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">v</span>
                            </div>
                      <div>
                        <div className="text-gray-500 text-xs">Version</div>
                        <div className="font-medium text-gray-900">v{resource.version}</div>
                            </div>
                      </div>
                    <div className="flex items-center gap-2">
                      {getVisibilityIcon(resource.visibility)}
                      <div>
                        <div className="text-gray-500 text-xs">Visibilité</div>
                        <div className="font-medium text-gray-900">
                          {getVisibilityLabel(resource.visibility)}
                    </div>
                </div>
                          </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-gray-500 text-xs">Créé le</div>
                        <div className="font-medium text-gray-900">
                          {new Date(resource.created_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-gray-500 text-xs">Modifié le</div>
                        <div className="font-medium text-gray-900">
                          {new Date(resource.updated_at).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets - Pleine largeur */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Navigation des onglets */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Détails
              </button>
              {canModifyResources && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Historique des versions
                </button>
              )}
              {canViewAudit && (
                <button
                  onClick={() => setActiveTab('journal')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'journal'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Journal
                </button>
              )}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === 'details' && <DetailsTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'journal' && <JournalTab />}
          </div>
        </div>
      </div>

      {/* Modal de visualisation */}
      {isViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
            {/* En-tête du modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {getFileIcon(resource.mime_type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {resource.mime_type || "Fichier"} • {formatFileSize(resource.size_bytes)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition flex items-center gap-1 text-sm"
                  disabled={downloadMutation.isPending}
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
                <button
                  onClick={closeViewer}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenu du visualiseur */}
            <div className="flex-1 p-4 overflow-hidden">
              {viewerUrl && (
                <div className="w-full h-full flex items-center justify-center">
                  {resource.mime_type === 'application/pdf' ? (
                    <iframe
                      src={viewerUrl}
                      className="w-full h-full border-0 rounded"
                      title="Visualiseur PDF"
                    />
                  ) : resource.mime_type?.startsWith('image/') ? (
                    <div className="flex items-center justify-center h-full w-full overflow-hidden">
                      <img
                        src={viewerUrl}
                        alt={resource.title}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto'
                        }}
                      />
                    </div>
                  ) : resource.mime_type?.startsWith('video/') ? (
                    <video
                      src={viewerUrl}
                      controls
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : resource.mime_type?.startsWith('audio/') ? (
                    <div className="flex items-center justify-center h-full">
                      <audio
                        src={viewerUrl}
                        controls
                        className="w-full max-w-md"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Aperçu non disponible pour ce type de fichier
                        </p>
                        <button
                          onClick={handleDownload}
                          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                          disabled={downloadMutation.isPending}
                        >
                          Télécharger pour voir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RessourceDetailPage;

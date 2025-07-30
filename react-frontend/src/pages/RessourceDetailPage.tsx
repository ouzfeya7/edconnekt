import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useResources } from "../contexts/ResourceContext";
import { useAuth } from "../pages/authentification/useAuth";
import { useEffect, useState } from "react";
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
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    resources,
    getAuditLogs,
    archiveResource,
    unarchiveResource,
    getFilesByResourceId,
    getVersionsByResourceId,
    restoreVersion,
  } = useResources();
  const { roles } = useAuth();
  const resource = resources.find((r) => r.id === Number(resourceId));

  const [hasRedirected, setHasRedirected] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'journal'>('details');
  
  // Permissions
  const canModifyResources =
    roles.includes("enseignant") ||
    roles.includes("directeur") ||
    roles.includes("administrateur");
  const canViewAudit =
    roles.includes("directeur") || 
    roles.includes("administrateur") || 
    roles.includes("enseignant");

  // Données enrichies
  const auditLogs = getAuditLogs();
  const resourceVersions = getVersionsByResourceId(Number(resourceId));

  useEffect(() => {
    if (!resource || hasRedirected) return;

    let paid: number[] = [];
    const paidResourcesString = localStorage.getItem("paidResources");
    if (paidResourcesString) {
      paid = paidResourcesString
        .split(",")
        .map(Number)
        .filter((item) => !isNaN(item));
    }

    if (resource.isPaid && !paid.includes(Number(resourceId))) {
      if (!location.pathname.startsWith("/paiement")) {
        navigate(`/paiement/${resourceId}`);
        setHasRedirected(true);
      }
    }
  }, [resourceId, resource, navigate, location.pathname, hasRedirected]);

  if (!resource) {
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
    if (!bytes) return "Non disponible";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };



  // Fonction pour obtenir l'extension correcte basée sur le type
  const getFileExtension = (fileType?: string): string => {
    if (!fileType) return 'pdf';
    
    switch (fileType.toUpperCase()) {
      case 'PDF':
        return 'pdf';
      case 'DOCX':
      case 'DOC':
        return 'docx';
      case 'PPTX':
      case 'PPT':
        return 'pptx';
      case 'XLSX':
      case 'XLS':
        return 'xlsx';
      case 'IMAGE':
        return 'jpg';
      case 'VIDEO':
        return 'mp4';
      case 'AUDIO':
        return 'mp3';
      case 'TXT':
        return 'txt';
      case 'HTML':
        return 'html';
      case 'JSON':
        return 'json';
      case 'ZIP':
        return 'zip';
      default:
        return 'file';
    }
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

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="w-5 h-5" />;
    
    const type = fileType.toUpperCase();
    switch (type) {
      case 'IMAGE':
        return <FileImage className="w-5 h-5 text-green-500" />;
      case 'VIDEO':
        return <FileVideo className="w-5 h-5 text-red-500" />;
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'DOCX':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'PPTX':
        return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'LINK':
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Fonction pour ouvrir le visualiseur intégré
  const handleView = (resourceId: number) => {
    const currentResource = resources.find(r => r.id === resourceId);
    if (!currentResource) return;

    // Si on a un fichier uploadé stocké, créer une URL pour la visualisation
    if (currentResource.uploadedFile) {
      const url = URL.createObjectURL(currentResource.uploadedFile);
      setViewerUrl(url);
      setIsViewerOpen(true);
      return;
    }
    
    // Si on a une URL directe, l'utiliser
    if (currentResource.fileUrl && currentResource.fileUrl !== '#') {
      setViewerUrl(currentResource.fileUrl);
      setIsViewerOpen(true);
      return;
    }
    
    // Pour les autres cas, ouvrir dans un nouvel onglet
    handleDownload(resourceId);
  };

  // Fonction pour télécharger un fichier
  const handleDownload = (resourceId: number, fileName?: string) => {
    const currentResource = resources.find(r => r.id === resourceId);
    if (!currentResource) return;

    // Récupérer les fichiers associés à cette ressource
    const resourceFiles = getFilesByResourceId(resourceId);
    const resourceVersions = getVersionsByResourceId(resourceId);
    
    // Si on a un fichier uploadé stocké, l'utiliser
    if (currentResource.uploadedFile) {
      const url = URL.createObjectURL(currentResource.uploadedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentResource.uploadedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
    
    // Si on a une URL directe, l'utiliser
    if (currentResource.fileUrl && currentResource.fileUrl !== '#') {
      window.open(currentResource.fileUrl, '_blank');
      return;
    }
    
    // Si on a des fichiers associés, utiliser le premier
    if (resourceFiles.length > 0 && resourceFiles[0].url !== '#') {
      window.open(resourceFiles[0].url, '_blank');
      return;
    }
    
    // Si on a des versions, utiliser la plus récente
    if (resourceVersions.length > 0) {
      window.open(resourceVersions[0].fileUrl, '_blank');
      return;
    }
    
    // Fallback : créer un fichier de démonstration selon le type
    const fileType = currentResource.fileType?.toLowerCase() || 'pdf';
    let demoContent = '';
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    // Créer du contenu approprié selon le type de fichier
    switch (fileType) {
      case 'pdf':
        // Créer un PDF factice (base64 d'un PDF minimal)
        demoContent = 'JVBERi0xLjQKJcOkw7zDtsO4DQoxIDAgb2JqDQo8PA0KL1R5cGUgL0NhdGFsb2cNCi9QYWdlcyAyIDAgUg0KPj4NCmVuZG9iag0KMiAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDENCi9LaWRzIFsgMyAwIFIgXQ0KPj4NCmVuZG9iag0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDIgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDQgMCBSDQo+Pg0KPj4NCi9Db250ZW50cyA1IDAgUg0KPj4NCmVuZG9iag0KNCAwIG9iag0KPDwNCi9UeXBlIC9Gb250DQovU3VidHlwZSAvVHlwZTENCi9CYXNlRm9udCAvSGVsdmV0aWNhDQo+Pg0KZW5kb2JqDQo1IDAgb2JqDQo8PA0KL0xlbmd0aCA0NA0KPj4NCnN0cmVhbQ0KQlQNCjEyIDAgVGYNCjAgMCAwIHJnDQowIDAgMCAwIFENCi9GMSAxMiBUZg0KMCBUag0KKEJvbmpvdXIgISkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KeHJlZg0KMCA2DQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTAgMDAwMDAgbg0KMDAwMDAwMDA3OSAwMDAwMCBuDQowMDAwMDAwMTczIDAwMDAwIG4NCjAwMDAwMDAzMDEgMDAwMDAgbg0KMDAwMDAwMDM4MCAwMDAwMCBuDQp0cmFpbGVyDQo8PA0KL1NpemUgNg0KL1Jvb3QgMSAwIFINCj4+DQpzdGFydHhyZWYNCjQ5Mg0KJSVFT0Y=';
        mimeType = 'application/pdf';
        extension = 'pdf';
        break;
      case 'docx':
      case 'doc':
        // Créer un DOCX factice (base64 d'un DOCX minimal)
        demoContent = 'UEsDBBQAAAAIAAxqj1YAAAAAAAAAAAAAAAAJAAAAeGwvUEsDBBQAAAAIAAxqj1YAAAAAAAAAAAAAAAAKAAAAeGwvX3JlbHMvUEsDBBQAAAAIAAxqj1YAAAAAAAAAAAAAAAAOAAAAeGwvX3JlbHMvZG9jdW1lbnQueG1sUEsDBBQAAAAIAAxqj1YAAAAAAAAAAAAAAAAJAAAAZG9jUHJvcHMvUEsDBBQAAAAIAAxqj1YAAAAAAAAAAAAAAAAJAAAAZG9jUHJvcHMvYXBwLnhtbFBLAQIUABQAAAAIAAxqj1YAAAAAAAAAAAAAAAAJAAAAAAAAAAAAEAAAAAAAAAB4bC9QSwECFAAUAAAACAAMao9WAAAAAAAAAAAAAAAACgAAAAAAAAAAABAAAAB4bC9fcmVscy9QSwECFAAUAAAACAAMao9WAAAAAAAAAAAAAAAADgAAAAAAAAAAABAAAAB4bC9fcmVscy9kb2N1bWVudC54bWxQSwECFAAUAAAACAAMao9WAAAAAAAAAAAAAAAACQAAAAAAAAAAABAAAABkb2NQcm9wcy9QSwECFAAUAAAACAAMao9WAAAAAAAAAAAAAAAACQAAAAAAAAAAABAAAABkb2NQcm9wcy9hcHAueG1sUEsFBgAAAAAEAAQA9QAAAPUAAAAA';
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        extension = 'docx';
        break;
      case 'pptx':
      case 'ppt':
        demoContent = 'Présentation PowerPoint de démonstration\n\nSlide 1: Introduction\n- Titre: ' + (fileName || currentResource.title) + '\n- Auteur: Démonstration\n\nSlide 2: Contenu\n- Point 1\n- Point 2\n- Point 3\n\nSlide 3: Conclusion\n- Merci de votre attention';
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      case 'xlsx':
      case 'xls':
        demoContent = 'Données de démonstration\n\nColonne A\tColonne B\tColonne C\nDonnée 1\tDonnée 2\tDonnée 3\nDonnée 4\tDonnée 5\tDonnée 6\n\nFichier: ' + (fileName || currentResource.title);
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
        // Créer une image factice (base64 d'une image 1x1 pixel)
        demoContent = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        mimeType = 'image/png';
        extension = 'png';
        break;
      default:
        demoContent = `Contenu de démonstration pour ${fileName || currentResource.title}\n\nType de fichier: ${fileType}\nRessource: ${currentResource.title}\nMatière: ${currentResource.subject}\n\nCeci est un fichier de démonstration. Dans une vraie application, ce serait le vrai contenu du fichier.`;
        mimeType = 'text/plain';
        extension = 'txt';
    }
    
    const blob = new Blob([demoContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `${currentResource.title}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fonction pour fermer le visualiseur
  const closeViewer = () => {
    setIsViewerOpen(false);
    setViewerUrl('');
  };

  const handleRestoreVersion = async (resourceId: number, versionNumber: number) => {
    try {
      restoreVersion(resourceId, versionNumber);
      alert("Version restaurée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la restauration de la version:", error);
      alert("Impossible de restaurer la version.");
    }
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
                    {getFileIcon(resource.fileType)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {resource.title}.{getFileExtension(resource.fileType)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {resource.fileSize ? formatFileSize(resource.fileSize) : "2.5 MB"} • 
                        {resource.fileType || "PDF"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleView(resource.id)}
                      className="text-gray-400 hover:text-gray-600 transition"
                      title="Aperçu"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDownload(resource.id, `${resource.title}.${resource.fileType?.toLowerCase() || 'pdf'}`)}
                      className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition flex items-center gap-1 text-sm"
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
                {resources
                  .filter(
                    (r) =>
                      r.id !== resource.id && r.subject === resource.subject
                  )
                  .slice(0, 3)
                  .map((similarResource) => (
                    <div
                      key={similarResource.id}
                      onClick={() => navigate(`/ressources/${similarResource.id}`)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                    >
                      <img
                        src={similarResource.imageUrl}
                        alt={similarResource.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {similarResource.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {similarResource.subject}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {similarResource.fileType || "PDF"} • {similarResource.fileSize ? formatFileSize(similarResource.fileSize) : "2.5 MB"}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                {resources.filter(r => r.id !== resource.id && r.subject === resource.subject).length === 0 && (
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
                  Historique des versions
                </h2>
                
      {resourceVersions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune version antérieure trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
                  {resourceVersions.map((version) => {
                    const isCurrentVersion = version.versionNumber === resource.version;
                    return (
                      <div key={version.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              Version {version.versionNumber}
                            </span>
                            {isCurrentVersion && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                (Actuelle)
                              </span>
                            )}
                            {!isCurrentVersion && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                (Archivée)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!isCurrentVersion && (
                              <button 
                                onClick={() => handleRestoreVersion(resource.id, version.versionNumber)}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition flex items-center gap-1 text-sm"
                                title="Restaurer cette version"
                              >
                                <RotateCcw className="w-4 h-4" />
                        Restaurer
                              </button>
                            )}
                          </div>
                        </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{version.uploadedBy}</span>
                          </div>
                  <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(version.uploadedAt).toLocaleDateString("fr-FR")}</span>
                          </div>
                                    <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                            <span>{formatFileSize(version.fileSize)}</span>
                          </div>
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4" />
                    <span>{version.fileType || resource.fileType || "PDF"}</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-700 font-medium mb-1">
                    Description des changements :
                  </div>
                  <div className="text-gray-600">
                            {version.changeDescription}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
  );

  // Composant pour l'onglet Journal
  const JournalTab = () => {
    const resourceLogs = auditLogs.filter(log => log.resourceId === Number(resourceId));
    
    return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-500" />
          Journal des actions
        </h2>
        
        {resourceLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune action enregistrée pour cette ressource</p>
                </div>
        ) : (
          <div className="space-y-4">
            {resourceLogs.map((log) => (
              <div key={log.id} className="border-l-4 border-gray-200 pl-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                    log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                    log.action === 'ARCHIVE' ? 'bg-orange-100 text-orange-800' :
                    log.action === 'RESTORE' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.action}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleDateString("fr-FR", {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="text-gray-700 mb-2">
                  {log.details}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Par {log.userId !== 'unknown' ? log.userId : log.userRole}
                </div>
                                {log.changes && Object.keys(log.changes).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Champs modifiés
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(log.changes).map(([key, value]) => {
                        // Fonction pour formater les valeurs
                        const formatValue = (val: unknown, fieldName?: string): string => {
                          if (val === null || val === undefined) return "Non défini";
                          if (typeof val === 'object') return "Objet complexe";
                          
                          // Traitement spécial pour la taille du fichier
                          if (fieldName === 'fileSize' && typeof val === 'number') {
                            return formatFileSize(val);
                          }
                          
                          if (typeof val === 'string' && val.length > 30) {
                            return val.substring(0, 30) + "...";
                          }
                          return String(val);
                        };

                        // Fonction pour traduire les noms de champs
                        const translateField = (field: string): string => {
                          const translations: { [key: string]: string } = {
                            title: "Titre",
                            subject: "Matière",
                            description: "Description",
                            visibility: "Visibilité",
                            fileType: "Type de fichier",
                            fileSize: "Taille du fichier",
                            imageUrl: "Image de couverture",
                            uploadedFile: "Fichier uploadé",
                            author: "Auteur",
                            competence: "Compétence",
                            isPaid: "Payant",
                            version: "Version",
                            classId: "Classe"
                          };
                          return translations[field] || field;
                        };

                        return (
                          <div key={key} className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">
                              {translateField(key)}
                            </div>
                            <div className="text-sm text-gray-700 font-mono break-all">
                              {formatValue(value, key)}
                            </div>
                          </div>
                        );
                      })}
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
            <span className="text-gray-900">{resource.subject}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {resource.title}
              {resource.isArchived && (
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
            <div className="flex-shrink-0">
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-64 h-48 object-cover rounded-lg shadow-md"
              />
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
                      {resource.subject}
                    </span>
                    {resource.isPaid && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Payant
                      </span>
                    )}
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
                    {resource.isArchived && (
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
                      // Préparer les données pour le formulaire d'édition
                      const editData = {
                        id: resource.id,
                        title: resource.title,
                        subject: resource.subject,
                        description: resource.description,
                        imageUrl: resource.imageUrl,
                        isPaid: resource.isPaid || false,
                        visibility: resource.visibility || "PRIVATE",
                        competence: resource.competence,
                        fileType: resource.fileType,
                        fileSize: resource.fileSize,
                        version: resource.version || 1,
                        classId: resource.classId,
                      };

                      // Champs en lecture seule pour l'édition
                      const readOnlyFields: (keyof typeof editData)[] = [
                        "id",
                        "subject",
                        "fileType",
                      ];

                      // Encoder les données pour l'URL
                      const encodedData = encodeURIComponent(
                        JSON.stringify(editData)
                      );
                      const encodedReadOnly = encodeURIComponent(
                        JSON.stringify(readOnlyFields)
                      );

                      navigate(
                        `/ressources/creer?edit=true&data=${encodedData}&readOnly=${encodedReadOnly}`
                      );
                    }}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (resource.isArchived) {
                        // Restaurer la ressource
                        unarchiveResource(Number(resourceId));
                        navigate("/ressources");
                      } else {
                        // Archiver la ressource
                        archiveResource(Number(resourceId));
                        navigate("/ressources");
                      }
                    }}
                      className={`text-white px-3 py-2 rounded-lg transition flex items-center gap-2 text-sm ${
                      resource.isArchived
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {resource.isArchived ? (
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
                      <div className="font-medium text-gray-900">Enseignant</div>
                        </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500 text-xs">Ajouté le</div>
                      <div className="font-medium text-gray-900">{new Date().toLocaleDateString("fr-FR")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500 text-xs">Type de fichier</div>
                      <div className="font-medium text-gray-900">{resource.fileType || "PDF"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500 text-xs">Taille</div>
                      <div className="font-medium text-gray-900">
                        {resource.fileSize
                          ? formatFileSize(resource.fileSize)
                          : "2.5 MB"}
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
                        <div className="font-medium text-gray-900">v{resource.version || 1}</div>
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
                          {new Date().toLocaleDateString("fr-FR")}
                </div>
              </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-gray-500 text-xs">Modifié le</div>
                        <div className="font-medium text-gray-900">
                          {new Date().toLocaleDateString("fr-FR")}
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
              {canModifyResources && resourceVersions.length > 0 && (
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
                {getFileIcon(resource.fileType)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {resource.fileType || "PDF"} • {resource.fileSize ? formatFileSize(resource.fileSize) : "2.5 MB"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(resource.id, `${resource.title}.${resource.fileType?.toLowerCase() || 'pdf'}`)}
                  className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition flex items-center gap-1 text-sm"
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
                  {resource.fileType === 'PDF' ? (
                    <iframe
                      src={viewerUrl}
                      className="w-full h-full border-0 rounded"
                      title="Visualiseur PDF"
                    />
                  ) : resource.fileType === 'IMAGE' ? (
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
                  ) : resource.fileType === 'VIDEO' ? (
                    <video
                      src={viewerUrl}
                      controls
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : resource.fileType === 'LINK' ? (
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
                          onClick={() => handleDownload(resource.id, `${resource.title}.${resource.fileType?.toLowerCase() || 'pdf'}`)}
                          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
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

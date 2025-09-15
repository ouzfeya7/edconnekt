/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FolderDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Palette,
  Music,
  Bike,
  Theater,
  Move,
  Languages,
  Sigma,
  Globe,
  ScrollText,
  BookOpenCheck,
  BookMarked,
  Home,
  Users,
  HeartPulse,
  FileText,
  Calendar,
  User,
  File,
  HardDrive,
  Tag,
  Eye,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useResources as useRemoteResources } from "../hooks/useResources";
import { useArchiveResource } from "../hooks/useArchiveResource";
import { useAuth } from "../pages/authentification/useAuth"; // Utiliser useAuth
import { Visibility, ResourceStatus, ResourceOut } from "../api/resource-service/api";


import AuditTrail from "../components/ressources/AuditTrail";

// Data for domains and subjects, mirroring AddResourcePage
const domainsData: { [key: string]: string[] } = {
  "LANGUES ET COMMUNICATION": ["Anglais", "Français"],
  "SCIENCES HUMAINES": [
    "Études islamiques",
    "Géographie",
    "Histoire",
    "Lecture arabe",
    "Qran",
    "Vivre dans son milieu",
    "Vivre ensemble",
    "Wellness",
  ],
  STEM: ["Mathématiques"],
  "CREATIVITE ARTISTIQUE / SPORTIVE": [
    "Arts plastiques",
    "EPS",
    "Motricité",
    "Musique",
    "Théâtre/Drama",
  ], // Renommé
};
const domainNames = [
  "LANGUES ET COMMUNICATION",
  "SCIENCES HUMAINES",
  "STEM",
  "CREATIVITE ARTISTIQUE / SPORTIVE",
];

export const subjectNameToIdMap: { [key: string]: number } = {
  "Anglais": 1,
  "Français": 2,
  "Études islamiques": 3,
  "Géographie": 4,
  "Histoire": 5,
  "Lecture arabe": 6,
  "Qran": 7,
  "Vivre dans son milieu": 8,
  "Vivre ensemble": 9,
  "Wellness": 10,
  "Mathématiques": 11,
  "Arts plastiques": 12,
  "EPS": 13,
  "Motricité": 14,
  "Musique": 15,
  "Théâtre/Drama": 16,
};

export const subjectIdToNameMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(subjectNameToIdMap).map(([name, id]) => [id, name])
);

// Couleurs subtiles spécifiques à chaque matière (utilisées dans d'autres composants)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const subjectColors: { [key: string]: string } = {
  // CRÉATIVITÉ & SPORT - Teintes bleu-violet
  "Arts plastiques": "bg-indigo-400",
  EPS: "bg-sky-400",
  Motricité: "bg-cyan-400",
  Musique: "bg-violet-400",
  "Théâtre/Drama": "bg-purple-400",

  // LANGUES ET COMMUNICATION - Teintes vert
  Anglais: "bg-emerald-400",
  Français: "bg-green-400",

  // STEM - Teintes orange-rouge
  Mathématiques: "bg-amber-400",

  // SCIENCES HUMAINES - Teintes rose-brun
  "Études islamiques": "bg-teal-400",
  Géographie: "bg-blue-400",
  Histoire: "bg-slate-400",
  "Lecture arabe": "bg-lime-400",
  Qran: "bg-rose-400",
  "Vivre dans son milieu": "bg-stone-400",
  "Vivre ensemble": "bg-pink-400",
  Wellness: "bg-orange-400",
};

const subjectBadgeColors: { [key: string]: string } = {
  // CRÉATIVITÉ & SPORT
  "Arts plastiques": "bg-indigo-600 text-white",
  EPS: "bg-sky-600 text-white",
  Motricité: "bg-cyan-600 text-white",
  Musique: "bg-violet-600 text-white",
  "Théâtre/Drama": "bg-purple-600 text-white",

  // LANGUES ET COMMUNICATION
  Anglais: "bg-emerald-600 text-white",
  Français: "bg-red-600 text-white",

  // STEM
  Mathématiques: "bg-amber-600 text-white",

  // SCIENCES HUMAINES
  "Études islamiques": "bg-teal-600 text-white",
  Géographie: "bg-blue-600 text-white",
  Histoire: "bg-slate-600 text-white",
  "Lecture arabe": "bg-lime-600 text-white",
  Qran: "bg-rose-600 text-white",
  "Vivre dans son milieu": "bg-stone-600 text-white",
  "Vivre ensemble": "bg-pink-600 text-white",
  Wellness: "bg-orange-600 text-white",
};

const getIconForSubject = (subject: string) => {
  switch (subject) {
    case "Arts plastiques":
      return Palette;
    case "EPS":
      return Bike;
    case "Motricité":
      return Move;
    case "Musique":
      return Music;
    case "Théâtre/Drama":
      return Theater;
    case "Anglais":
      return Languages;
    case "Français":
      return Languages;
    case "Mathématiques":
      return Sigma;
    case "Études islamiques":
      return BookMarked;
    case "Géographie":
      return Globe;
    case "Histoire":
      return ScrollText;
    case "Lecture arabe":
      return BookOpenCheck;
    case "Qran":
      return BookMarked;
    case "Vivre dans son milieu":
      return Home;
    case "Vivre ensemble":
      return Users;
    case "Wellness":
      return HeartPulse;
    default:
      return FileText;
  }
};

interface DisplayResource {
  id: string | number;
  title: string;
  subject: string;
  description: string;
  addedDate: string;
  author: string;
  isArchived: boolean;
  imageUrl?: string;
  competence?: string;
  visibility?: "PRIVATE" | "CLASS" | "SCHOOL";
  fileType?: "PDF" | "DOCX" | "PPTX" | "VIDEO" | "IMAGE" | "LINK";
  fileSize?: number;
  authorDetails?: {
    id: string;
    name: string;
    role: string;
  };
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  classId?: string;
  isPaid?: boolean;
}

interface ResourceListItemProps {
  resource: DisplayResource;
  onArchive: () => void;
  isParent: boolean; // Indique si l'utilisateur est en lecture seule (parent/élève)
}

const ResourceListItem: React.FC<ResourceListItemProps> = ({
  resource,
  isParent,
}) => {
  const Icon = getIconForSubject(resource.subject);
  const badgeColor =
    subjectBadgeColors[resource.subject] || "bg-gray-600 text-white";
  const navigate = useNavigate();

  // Fonction pour formater la taille des fichiers
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "N/A";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  // Utiliser la nouvelle image pour EDD CP si le titre correspond
  const imageUrl = resource.title.includes("EDD CP")
    ? "https://editionsdidactikos.sn/wp-content/uploads/2025/06/Capture-decran-2025-06-23-a-16.24.24.png"
    : resource.imageUrl;

  // Affichage du badge Payant
  const isPaid = resource.isPaid;

  const handleCardClick = () => {
    if (isPaid) {
      // Redirection directe vers le système de paiement pour les ressources payantes
      navigate(`/paiement/${resource.id}`);
      return;
    }
    navigate(`/ressources/${resource.id}`);
  };

  return (
    <div
      className={`group bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden cursor-pointer ${
        isPaid
          ? "border-yellow-300 hover:border-yellow-400 hover:shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
      }`}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`Voir la ressource ${resource.title}`}
    >
      <div className="flex h-32">
        {/* Image/Thumbnail à gauche - Plus grande */}
        <div className="w-32 h-32 flex-shrink-0 bg-white border-r border-gray-200 relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <Icon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {/* Badge de matière supprimé du thumbnail */}
          {/* Indicateur de ressource payante */}
          {isPaid && (
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
              {isPaid && (
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
                  {resource.fileSize
                    ? formatFileSize(resource.fileSize)
                    : "2.5 MB"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-md text-xs font-medium text-blue-700">
                  <Tag className="w-3 h-3" />v{resource.version || 1}
                </span>
                {resource.visibility && !isParent && (
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

function RessourcesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, roles } = useAuth(); // Récupération des rôles de l'utilisateur
  const archiveMutation = useArchiveResource();

  // Détection des rôles pour masquer les fonctionnalités appropriées
  const canModifyResources =
    roles.includes("enseignant") ||
    roles.includes("directeur") ||
    roles.includes("administrateur");

  // Debug: afficher les rôles actuels
  console.log("Rôles actuels:", roles);
  console.log("Peut modifier les ressources:", canModifyResources);

  const [activeDomain, setActiveDomain] = useState(domainNames[0]); // Default to LANGUES ET COMMUNICATION
  const [activeSubject, setActiveSubject] = useState<string | null>(null); // No default subject selected
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "free">(
    "all"
  );

  // Nouveaux filtres avancés
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");
  const itemsPerPage = 20;

  const activeSubjectId = activeSubject ? String(subjectNameToIdMap[activeSubject]) : null;

  const {
    data: apiResources,
  } = useRemoteResources({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    visibility: (visibilityFilter as Visibility) || null,
    subjectId: activeSubjectId,
    status: ResourceStatus.Active,
  });

  // Removed isAddModalOpen state

  const handleDomainChange = (domain: string) => {
    setActiveDomain(domain);
    setActiveSubject(null);
  };

  // Mapping minimal de ResourceOut (API) -> DisplayResource
  const mapApiResourceToDisplay = (r: ResourceOut): DisplayResource => {
    // TODO: remplacer subject_id/competence_id par libellés dès que le mapping est fourni
    const fileTypeFromMime = (() => {
      const mt = r.mime_type as string;
      if (!mt) return "PDF" as const;
      if (mt.startsWith("image/")) return "IMAGE" as const;
      if (mt.startsWith("video/")) return "VIDEO" as const;
      if (mt.includes("pdf")) return "PDF" as const;
      if (mt.includes("presentation")) return "PPTX" as const;
      if (mt.includes("word")) return "DOCX" as const;
      return "PDF" as const;
    })();

    return {
      id: r.id,
      title: r.title,
      subject: subjectIdToNameMap[String(r.subject_id)] || String(r.subject_id),
      description: r.description ?? "",
      addedDate: new Date(r.created_at).toLocaleDateString("fr-FR"),
      author: r.author_user_id === user?.id ? `${user.firstName} ${user.lastName}` : r.author_user_id,
      isArchived: r.status === "ARCHIVED",
      visibility: r.visibility,
      fileType: fileTypeFromMime,
      fileSize: r.size_bytes,
      version: r.version,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  };

  const displayedResources: DisplayResource[] = (apiResources ?? [])
    .map(mapApiResourceToDisplay)
    .filter((resource) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        (resource.competence || "").toLowerCase().includes(searchLower) ||
        resource.author.toLowerCase().includes(searchLower)
      );
    })
    .filter((resource) => {
      if (paymentFilter === "all") return true;
      if (paymentFilter === "paid") return resource.isPaid;
      if (paymentFilter === "free") return !resource.isPaid;
    return true;
  });

  const totalPages = apiResources ? Math.ceil(displayedResources.length / itemsPerPage) : 1; // This will need to be adjusted once the API returns total count

  const handleArchive = (resourceId: string | number) => {
    archiveMutation.mutate(String(resourceId));
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header visuel moderne */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-6 shadow-sm border border-orange-200/50">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/15 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
            {t("ressources", "Ressources")}
          </h1>
          <div className="flex items-center gap-4">
            {/* Audit Trail - Direction uniquement */}
            <AuditTrail />

            {canModifyResources && (
              <button
                onClick={() => navigate("/ressources/archives")}
                className="flex items-center bg-white text-gray-800 font-semibold py-2 px-5 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
              >
                <FolderDown className="w-5 h-5 mr-2" />
                {t("archives", "Archives")}
              </button>
            )}
            {canModifyResources && (
              <button
                onClick={() => navigate("/ressources/creer")} // Navigate to the new page
                className="flex items-center bg-orange-500 text-white font-semibold py-2 px-5 border border-orange-400 rounded-lg shadow-sm hover:bg-orange-600 hover:border-orange-500 transition-all duration-150"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t("add_resource", "Ajouter une ressource")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bloc filtres dans une carte blanche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
        {/* Domaines de compétences */}
        <div className="flex space-x-4 overflow-x-auto pb-4 mb-4">
            {domainNames.map((domain) => (
              <button
                key={domain}
                onClick={() => handleDomainChange(domain)}
                className={`pb-2 text-sm font-semibold uppercase tracking-wider transition-colors focus:outline-none whitespace-nowrap ${
                  activeDomain === domain
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

        {/* Matières */}
        <div className="flex flex-wrap gap-2 mb-6">
          {domainsData[activeDomain].map((subject) => (
            <button
              key={subject}
              onClick={() =>
                setActiveSubject(activeSubject === subject ? null : subject)
              }
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 ease-in-out transform hover:scale-[1.02] whitespace-nowrap ${
                activeSubject === subject
                  ? "bg-[#184867] text-white shadow-lg"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Barre de séparation */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Barre de recherche unifiée */}
        <div className="mb-6">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
              placeholder="Rechercher par nom, description, compétence, auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-base"
              />
          </div>
            </div>

        {/* Filtres au même niveau */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {/* Filtre par statut payant */}
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Statut
            </label>
            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value as "all" | "paid" | "free")
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="free">Gratuit</option>
              <option value="paid">Payant</option>
            </select>
            </div>

            {/* Filtre par type de fichier */}
            <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Type
            </label>
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Tous les types</option>
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="PPTX">PPTX</option>
                <option value="VIDEO">Vidéo</option>
                <option value="IMAGE">Image</option>
                <option value="LINK">Lien</option>
              </select>
            </div>



          {/* Filtre par visibilité - Masqué pour les parents/élèves */}
          {canModifyResources ? (
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                Visibilité
              </label>
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Toutes les visibilités</option>
                <option value="PRIVATE">Privé</option>
                <option value="CLASS">Classe</option>
                <option value="SCHOOL">École</option>
              </select>
            </div>
          ) : (
                         /* Bouton de réinitialisation pour les parents/élèves */
            <div className="flex items-end">
              <button
                onClick={() => {
                   setSearchTerm("");
                  setFileTypeFilter("");
                   setPaymentFilter("all");
                }}
                className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          )}

                     {/* Bouton de réinitialisation pour les enseignants */}
           {canModifyResources && (
             <div className="flex items-end">
            <button
                 onClick={() => {
                   setSearchTerm("");
                   setFileTypeFilter("");
                   setVisibilityFilter("");
                   setPaymentFilter("all");
                 }}
                 className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 Réinitialiser
            </button>
             </div>
           )}
        </div>

        {/* Liste des ressources sous forme de lignes améliorée */}
        <div className="space-y-4 mt-6">
          {displayedResources.length > 0 ? (
            displayedResources.map((resource) => (
              <ResourceListItem
                key={typeof resource.id === 'string' ? resource.id : String(resource.id)}
                resource={resource}
                onArchive={() => handleArchive(resource.id)}
                isParent={!canModifyResources}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="max-w-md mx-auto">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune ressource trouvée
                </h3>
                <p className="text-gray-500">
                  Aucune ressource n'est disponible pour cette sélection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination stylée */}
        <div className="flex justify-between items-center mt-6 mb-2">
          <span className="text-sm text-gray-600 font-medium">{`Page ${currentPage} sur ${
            totalPages || 1
          }`}</span>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-l-md hover:bg-gray-100 disabled:opacity-50 border-r border-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-r-md hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modale d'ajout de ressource - Removed */}
    </div>
  );
}

export default RessourcesPage;

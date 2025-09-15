import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Bike,
  Move,
  Music,
  Theater,
  Languages,
  Sigma,
  BookMarked,
  Globe,
  ScrollText,
  BookOpenCheck,
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
} from 'lucide-react';

interface RemediationResource {
  id: string;
  remediationId: string;
  resourceId: number;
  title: string;
  description: string;
  subject: string;
  imageUrl: string;
  fileType: string;
  fileSize: number;
  visibility: string;
  addedBy: string;
  addedAt: string;
  isActive: boolean;
  isPaid?: boolean;
}

interface RemediationResourceCardProps {
  resource: RemediationResource;
}

// Couleurs des badges par matière (copiées de RessourcesPage.tsx)
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

// Fonction pour obtenir l'icône selon la matière (copiée de RessourcesPage.tsx)
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

const RemediationResourceCard: React.FC<RemediationResourceCardProps> = ({ resource }) => {
  const Icon = getIconForSubject(resource.subject);
  const badgeColor = subjectBadgeColors[resource.subject] || "bg-gray-600 text-white";
  const navigate = useNavigate();

  // Fonction pour formater la taille du fichier
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
      navigate(`/paiement/${resource.resourceId}`);
      return;
    }
    navigate(`/ressources/${resource.resourceId}`);
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
                <span className="font-medium">{resource.addedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(resource.addedAt).toLocaleDateString('fr-FR')}</span>
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
                  <Tag className="w-3 h-3" />v1
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

export default RemediationResourceCard; 
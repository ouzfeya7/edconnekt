import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Plus, FolderDown, ChevronLeft, ChevronRight, Search,
    Palette, Music, Bike, Theater, Move,
    Languages,
    Sigma,
    Globe, ScrollText, BookOpenCheck, BookMarked, Home, Users, HeartPulse,
    FileText, Calendar, User
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useResources } from "../contexts/ResourceContext";
import { useAuth } from "../pages/authentification/useAuth"; // Utiliser useAuth
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "../components/ui/dialog";
import AddResourceModal from "../components/ressources/AddResourceModal";
import logoWave from '../assets/logo-wave.png';
import logoOM from '../assets/logo-OM.png';

// Data for domains and subjects, mirroring AddResourcePage
const domainsData: { [key: string]: string[] } = {
  "LANGUES ET COMMUNICATION": ["Anglais", "Français"],
  "SCIENCES HUMAINES": ["Études islamiques", "Géographie", "Histoire", "Lecture arabe", "Qran", "Vivre dans son milieu", "Vivre ensemble", "Wellness"],
  "STEM": ["Mathématiques"],
  "CREATIVITE ARTISTIQUE / SPORTIVE": ["Arts plastiques", "EPS", "Motricité", "Musique", "Théâtre/Drama"], // Renommé
};
const domainNames = [
  "LANGUES ET COMMUNICATION",
  "SCIENCES HUMAINES",
  "STEM",
  "CREATIVITE ARTISTIQUE / SPORTIVE",
];

// Couleurs subtiles spécifiques à chaque matière
const subjectColors: { [key: string]: string } = {
  // CRÉATIVITÉ & SPORT - Teintes bleu-violet
  "Arts plastiques": "bg-indigo-400",
  "EPS": "bg-sky-400", 
  "Motricité": "bg-cyan-400",
  "Musique": "bg-violet-400",
  "Théâtre/Drama": "bg-purple-400",
  
  // LANGUES ET COMMUNICATION - Teintes vert
  "Anglais": "bg-emerald-400",
  "Français": "bg-green-400",
  
  // STEM - Teintes orange-rouge
  "Mathématiques": "bg-amber-400",
  
  // SCIENCES HUMAINES - Teintes rose-brun
  "Études islamiques": "bg-teal-400",
  "Géographie": "bg-blue-400",
  "Histoire": "bg-slate-400", 
  "Lecture arabe": "bg-lime-400",
  "Qran": "bg-rose-400",
  "Vivre dans son milieu": "bg-stone-400",
  "Vivre ensemble": "bg-pink-400",
  "Wellness": "bg-orange-400",
};

const subjectBadgeColors: { [key: string]: string } = {
  // CRÉATIVITÉ & SPORT
  "Arts plastiques": "bg-indigo-50 text-indigo-700",
  "EPS": "bg-sky-50 text-sky-700",
  "Motricité": "bg-cyan-50 text-cyan-700", 
  "Musique": "bg-violet-50 text-violet-700",
  "Théâtre/Drama": "bg-purple-50 text-purple-700",
  
  // LANGUES ET COMMUNICATION
  "Anglais": "bg-emerald-50 text-emerald-700",
  "Français": "bg-green-50 text-green-700",
  
  // STEM
  "Mathématiques": "bg-amber-50 text-amber-700",
  
  // SCIENCES HUMAINES
  "Études islamiques": "bg-teal-50 text-teal-700",
  "Géographie": "bg-blue-50 text-blue-700",
  "Histoire": "bg-slate-50 text-slate-700",
  "Lecture arabe": "bg-lime-50 text-lime-700", 
  "Qran": "bg-rose-50 text-rose-700",
  "Vivre dans son milieu": "bg-stone-50 text-stone-700",
  "Vivre ensemble": "bg-pink-50 text-pink-700",
  "Wellness": "bg-orange-50 text-orange-700",
};

const getIconForSubject = (subject: string) => {
    switch (subject) {
        case "Arts plastiques": return Palette;
        case "EPS": return Bike;
        case "Motricité": return Move;
        case "Musique": return Music;
        case "Théâtre/Drama": return Theater;
        case "Anglais": return Languages;
        case "Français": return Languages;
        case "Mathématiques": return Sigma;
        case "Études islamiques": return BookMarked;
        case "Géographie": return Globe;
        case "Histoire": return ScrollText;
        case "Lecture arabe": return BookOpenCheck;
        case "Qran": return BookMarked;
        case "Vivre dans son milieu": return Home;
        case "Vivre ensemble": return Users;
        case "Wellness": return HeartPulse;
        default: return FileText;
    }
};

interface DisplayResource {
    id: number;
    title: string;
    subject: string;
    addedDate: string;
    author: string;
    isArchived: boolean;
    imageUrl?: string; // Added imageUrl to the interface
}

interface ResourceListItemProps {
    resource: DisplayResource;
    onArchive: () => void;
    isParent: boolean; // Indique si l'utilisateur est en lecture seule (parent/élève)
}

const ResourceListItem: React.FC<ResourceListItemProps> = ({ resource, onArchive, isParent }) => {
  const Icon = getIconForSubject(resource.subject);
  const bgColor = subjectColors[resource.subject] || "bg-gray-400";
  const badgeColor = subjectBadgeColors[resource.subject] || "bg-gray-50 text-gray-700";
  const navigate = useNavigate();
  // Utiliser la nouvelle image pour EDD CP si le titre correspond
  const imageUrl = resource.title.includes("EDD CP")
    ? "https://editionsdidactikos.sn/wp-content/uploads/2025/06/Capture-decran-2025-06-23-a-16.24.24.png"
    : resource.imageUrl;

  // Affichage du badge Payant
  const isPaid = (resource as any).isPaid;
  const paymentUrl = (resource as any).paymentUrl;

  const handleCardClick = () => {
    if (isPaid) {
      const paidArr = JSON.parse(localStorage.getItem('paidResources') || '[]');
      if (!paidArr.includes(resource.id)) {
        navigate(`/paiement/${resource.id}`);
        return;
      }
    }
    navigate(`/ressources/${resource.id}`);
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden flex flex-col items-center h-full cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`Voir la ressource ${resource.title}`}
      style={{ width: '100%' }}
    >
      {/* Image en haut, largeur totale de la carte, sans padding */}
      <div className="w-full bg-white border-b border-gray-200 rounded-t-2xl overflow-hidden p-0 m-0 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={resource.title} className="w-full h-auto max-h-80 object-cover rounded-t-2xl m-0 p-0" />
        ) : (
          <div className="flex items-center justify-center w-full h-40 bg-gray-100 m-0 p-0">
            <Icon className="w-16 h-16 text-gray-300" />
          </div>
        )}
        {/* Bouton d'archivage conditionnel sur l'image */}
        {!isParent && (
          <div className="absolute top-2 right-2 z-10">
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-colors duration-150" 
                  onClick={e => e.stopPropagation()}
                  aria-label="Archiver la ressource"
                >
                  <FolderDown className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">Confirmer l'archivage</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2">
                    Voulez-vous vraiment archiver la ressource "{resource.title}" ? Elle ne sera plus visible sur cette page.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3 mt-6">
                  <DialogClose asChild>
                    <button type="button" className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 font-medium transition-colors duration-150">
                      Annuler
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button 
                      type="button" 
                      onClick={onArchive} 
                      className="flex-1 bg-orange-500 text-white px-4 py-2.5 rounded-xl hover:bg-orange-600 font-medium transition-colors duration-150"
                    >
                      Archiver
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      {/* Texte et infos en dessous, padding réduit */}
      <div className="flex-1 flex flex-col items-center justify-between w-full px-2 pt-4 pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center line-clamp-2 leading-tight">{resource.title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${badgeColor}`}>{resource.subject}</span>
          {isPaid && (
            <button
              onClick={e => { e.stopPropagation(); navigate(`/paiement/${resource.id}`); }}
              className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-400 text-white text-xs font-bold gap-1 hover:bg-yellow-500 transition"
              title="Accéder à la page de paiement"
            >
              Payant
            </button>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium">{resource.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Ajouté le {resource.addedDate}</span>
          </div>
        </div>
        {/* Ancien bouton d'archivage supprimé */}
      </div>
    </div>
  );
};

function RessourcesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { resources, archiveResource } = useResources();
    const { roles } = useAuth(); // Récupération des rôles de l'utilisateur
    
    // Détection des rôles pour masquer les fonctionnalités appropriées
    const isReadOnlyUser = roles.includes('parent') || roles.includes('eleve');
    const canModifyResources = roles.includes('enseignant') || roles.includes('directeur') || roles.includes('administrateur');
    
    const [activeDomain, setActiveDomain] = useState(domainNames[0]); // Default to LANGUES ET COMMUNICATION
    const [activeSubject, setActiveSubject] = useState<string | null>(null); // No default subject selected
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    // Removed isAddModalOpen state
    const itemsPerPage = 3;

    const handleDomainChange = (domain: string) => {
        setActiveDomain(domain);
        setActiveSubject(null); 
    };

    const filteredResources = resources.filter(resource => {
        if (resource.isArchived) return false;

        const resourceDomain = Object.keys(domainsData).find(domain => domainsData[domain].includes(resource.subject));
        
        if (resourceDomain !== activeDomain) return false;
        if (activeSubject && resource.subject !== activeSubject) return false;
        if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        
        return true;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [activeDomain, activeSubject, searchTerm]);

    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const paginatedResources = filteredResources.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const displayedResources: DisplayResource[] = paginatedResources.map(resource => ({
        ...resource,
        addedDate: new Date().toLocaleDateString('fr-FR'),
        author: 'Enseignant' // Par défaut, afficher "Enseignant" comme auteur
    }));

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header visuel moderne */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-6 shadow-sm border border-orange-200/50">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/15 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{t('ressources', 'Ressources')}</h1>
          <div className="flex items-center gap-4">
            {canModifyResources && (
              <button 
                  onClick={() => navigate('/ressources/archives')}
                  className="flex items-center bg-white text-gray-800 font-semibold py-2 px-5 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
              >
                <FolderDown className="w-5 h-5 mr-2" />
                {t('archives', 'Archives')}
              </button>
            )}
            {canModifyResources && (
              <button 
                  onClick={() => navigate('/ressources/creer')} // Navigate to the new page
                  className="flex items-center bg-orange-500 text-white font-semibold py-2 px-5 border border-orange-400 rounded-lg shadow-sm hover:bg-orange-600 hover:border-orange-500 transition-all duration-150"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('add_resource', 'Ajouter une ressource')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bloc filtres dans une carte blanche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex space-x-4 overflow-x-auto pb-2">
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
          <div className="relative w-full max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {domainsData[activeDomain].map(subject => (
            <button
              key={subject}
              onClick={() => setActiveSubject(activeSubject === subject ? null : subject)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 ease-in-out transform hover:scale-[1.02] whitespace-nowrap ${
                  activeSubject === subject 
                      ? 'bg-[#184867] text-white shadow-lg' 
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Liste des ressources sous forme de grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
          {displayedResources.length > 0 ? (
              displayedResources.map(resource => (
                  <ResourceListItem 
                      key={resource.id} 
                      resource={resource}
                      onArchive={() => archiveResource(resource.id)}
                      isParent={isReadOnlyUser}
                  />
              ))
          ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune ressource trouvée</h3>
                      <p className="text-gray-500">Aucune ressource n'est disponible pour cette sélection.</p>
                  </div>
              </div>
          )}
        </div>

        {/* Pagination stylée */}
        <div className="flex justify-between items-center mt-6 mb-2">
          <span className="text-sm text-gray-600 font-medium">{`Page ${currentPage} sur ${totalPages || 1}`}</span>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
              <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-l-md hover:bg-gray-100 disabled:opacity-50 border-r border-gray-300"
              >
                  <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

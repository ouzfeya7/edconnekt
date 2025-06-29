import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArchiveRestore, ChevronLeft, ChevronRight, Search, ArrowLeft,
    Palette, Music, Bike, Theater, Move,
    Languages,
    Sigma,
    Globe, ScrollText, BookOpenCheck, BookMarked, Home, Users, HeartPulse,
    FileText, Calendar, User
} from "lucide-react";

import { useResources } from "../contexts/ResourceContext";
import { useUser } from "../layouts/DashboardLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "../components/ui/dialog";

// Couleurs subtiles spécifiques à chaque matière (matching RessourcesPage)
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

interface Resource {
    id: number;
    title: string;
    subject: string;
    addedDate: string;
    author: string;
    isArchived: boolean;
}

interface ArchivedResourceListItemProps {
    resource: Resource;
    onUnarchive: () => void;
}

const ArchivedResourceListItem: React.FC<ArchivedResourceListItemProps> = ({ resource, onUnarchive }) => {
    const Icon = getIconForSubject(resource.subject);
    const bgColor = subjectColors[resource.subject] || "bg-gray-400";
    const badgeColor = subjectBadgeColors[resource.subject] || "bg-gray-50 text-gray-700";

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-150 overflow-hidden">
            <div className="p-6">
                <div className="flex items-start gap-6">
                    {/* Icône de la matière */}
                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${bgColor} shadow-md group-hover:scale-[1.02] transition-transform duration-150`}>
                        <Icon className="w-10 h-10 text-white/90" />
                    </div>
                    
                    {/* Contenu principal */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                                    {resource.title}
                                </h3>
                                
                                {/* Badge de la matière */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${badgeColor}`}>
                                        {resource.subject}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                        Archivé
                                    </span>
                                </div>
                                
                                {/* Informations de l'auteur et date */}
                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">{resource.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Archivé le {resource.addedDate}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bouton de restauration */}
                            <div className="flex-shrink-0">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="p-3 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-green-500 transition-colors duration-150 group/btn">
                                            <ArchiveRestore className="w-5 h-5 group-hover/btn:scale-[1.05] transition-transform duration-150" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold text-gray-900">Confirmer la restauration</DialogTitle>
                                            <DialogDescription className="text-gray-600 mt-2">
                                                Voulez-vous vraiment restaurer la ressource "{resource.title}" ? Elle sera de nouveau visible sur la page principale.
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
                                                    onClick={onUnarchive} 
                                                    className="flex-1 bg-green-500 text-white px-4 py-2.5 rounded-xl hover:bg-green-600 font-medium transition-colors duration-150"
                                                >
                                                    Restaurer
                                                </button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function ArchivesPage() {
    const navigate = useNavigate();
    const { resources, unarchiveResource } = useResources(); 
    const { user } = useUser(); // Récupération de l'utilisateur connecté
    
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const archivedResources = resources.filter(resource => {
        if (!resource.isArchived) return false;
        if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(archivedResources.length / itemsPerPage);
    const paginatedResources = archivedResources.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const displayedResources = paginatedResources.map(resource => ({
        ...resource,
        addedDate: new Date().toLocaleDateString('fr-FR'),
        author: user ? user.name : 'Enseignant'
    }));

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            {/* Header avec navigation */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/ressources')}
                    className="p-2 rounded-xl hover:bg-white shadow-sm transition-colors duration-150"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-4xl font-bold text-gray-900">Ressources Archivées</h1>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher une ressource archivée..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition"
                    />
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-4">{`Page ${currentPage} sur ${totalPages || 1}`}</span>
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg">
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

            <div className="space-y-6">
                {displayedResources.length > 0 ? (
                    displayedResources.map(resource => (
                        <ArchivedResourceListItem key={resource.id} resource={resource} onUnarchive={() => unarchiveResource(resource.id)} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="max-w-md mx-auto">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune ressource archivée</h3>
                            <p className="text-gray-500">Aucune ressource n'est actuellement archivée.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArchivesPage; 
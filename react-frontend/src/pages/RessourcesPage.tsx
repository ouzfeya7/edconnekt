import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useResources } from "../contexts/ResourceContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "../components/ui/dialog";

// Data for domains and subjects, mirroring AddResourcePage
const domainsData: { [key: string]: string[] } = {
  "CRÉATIVITÉ & SPORT": ["Arts plastiques", "EPS", "Motricité", "Musique", "Théâtre/Drama"],
  "LANGUES ET COMMUNICATION": ["Anglais", "Français"],
  "STEM": ["Mathématiques"],
  "SCIENCES HUMAINES": ["Études islamiques", "Géographie", "Histoire", "Lecture arabe", "Qran", "Vivre dans son milieu", "Vivre ensemble", "Wellness"],
};
const domainNames = Object.keys(domainsData);

interface Resource {
    id: number;
    title: string;
    subject: string;
    addedDate: string;
    imageUrl: string;
    author: string;
    authorImageUrl: string;
}

interface ResourceListItemProps {
    resource: Resource;
    onArchive: () => void;
}

const ResourceListItem: React.FC<ResourceListItemProps> = ({ resource, onArchive }) => {
  return (
    <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-shadow hover:shadow-md">
      <img src={resource.imageUrl} alt={resource.title} className="w-28 h-36 object-cover rounded-lg mr-6" />
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{resource.title}</h3>
        <div className="flex items-center">
          <img src={resource.authorImageUrl} alt={resource.author} className="w-8 h-8 rounded-full mr-3" />
          <span className="text-gray-600 font-medium">{resource.subject}</span>
        </div>
      </div>
      <div className="flex flex-col items-end pl-6">
         <div className="text-right whitespace-nowrap">
            <span className="text-sm text-gray-500">Ajouté : {resource.addedDate}</span>
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="ml-4 p-2 rounded-md hover:bg-gray-100 text-orange-500">
                    <FolderDown className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer l'archivage</DialogTitle>
                  <DialogDescription>
                    Voulez-vous vraiment archiver cette ressource ? Elle ne sera plus visible sur cette page.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <button type="button" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Annuler</button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button type="button" onClick={onArchive} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Archiver</button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

         </div>
      </div>
    </div>
  );
};

function RessourcesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { resources, archiveResource } = useResources(); 
    
    const [activeDomain, setActiveDomain] = useState(domainNames[3]); // Default to SCIENCES HUMAINES
    const [activeSubject, setActiveSubject] = useState<string | null>("Histoire"); // Default to Histoire
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
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

    const displayedResources = paginatedResources.map(resource => ({
        ...resource,
        addedDate: new Date().toLocaleDateString('fr-FR'),
        author: resource.subject,
        authorImageUrl: `https://i.pravatar.cc/40?u=${resource.id}`
    }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Ressources</h1>
        <button 
            onClick={() => navigate('/ressources/ajouter')}
            className="flex items-center bg-white text-gray-800 font-semibold py-2 px-5 border border-orange-400 rounded-lg shadow-sm hover:bg-orange-50 hover:border-orange-500 transition-all duration-200"
        >
            <Plus className="w-5 h-5 mr-2 text-orange-500" />
            {t('add_resource', 'Ajouter une ressource')}
        </button>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
            <div className="flex space-x-8">
              {domainNames.map((domain) => (
                <button
                  key={domain}
                  onClick={() => handleDomainChange(domain)}
                  className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors focus:outline-none ${
                    activeDomain === domain
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
            <button 
                onClick={() => navigate('/ressources/archives')}
                className="pb-3 flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <FolderDown className="w-5 h-5 mr-2" />
                Archives
            </button>
        </div>
      </div>

      <div className="flex justify-between items-center my-6">
        <div className="flex items-center gap-3 flex-wrap">
          {domainsData[activeDomain].map(subject => (
            <button
              key={subject}
              onClick={() => setActiveSubject(activeSubject === subject ? null : subject)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${
                  activeSubject === subject 
                      ? 'bg-[#184867] text-white shadow-lg' 
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
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

      <div>
        {displayedResources.length > 0 ? (
            displayedResources.map(resource => (
              <ResourceListItem key={resource.id} resource={resource} onArchive={() => archiveResource(resource.id)} />
            ))
        ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-500">Aucune ressource disponible pour cette sélection.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default RessourcesPage;

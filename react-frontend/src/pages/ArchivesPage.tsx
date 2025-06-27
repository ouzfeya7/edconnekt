import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArchiveRestore, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useResources } from "../contexts/ResourceContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "../components/ui/dialog";

interface ArchivedResourceListItemProps {
    resource: any;
    onUnarchive: () => void;
}

const ArchivedResourceListItem: React.FC<ArchivedResourceListItemProps> = ({ resource, onUnarchive }) => {
    return (
      <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-shadow hover:shadow-md">
        <img src={resource.imageUrl} alt={resource.title} className="w-28 h-36 object-cover rounded-lg mr-6" />
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{resource.title}</h3>
          <div className="flex items-center">
            <img src={resource.authorImageUrl} alt={resource.author} className="w-8 h-8 rounded-full mr-3" />
            <span className="text-gray-600 font-medium">{resource.author}</span>
          </div>
        </div>
        <div className="flex flex-col items-end pl-6">
           <div className="text-right whitespace-nowrap">
              <span className="text-sm text-gray-500">Archivé le : {resource.addedDate}</span>
              <Dialog>
                <DialogTrigger asChild>
                    <button className="ml-4 p-2 rounded-md hover:bg-gray-100 text-green-600">
                        <ArchiveRestore className="w-5 h-5" />
                    </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la restauration</DialogTitle>
                    <DialogDescription>
                      Voulez-vous vraiment restaurer cette ressource ? Elle sera de nouveau visible sur la page principale.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                        <button type="button" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Annuler</button>
                    </DialogClose>
                    <DialogClose asChild>
                        <button type="button" onClick={onUnarchive} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Restaurer</button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
           </div>
        </div>
      </div>
    );
};

function ArchivesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { resources, unarchiveResource } = useResources(); 
    
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
        author: resource.subject,
        authorImageUrl: `https://i.pravatar.cc/40?u=${resource.id}`
    }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Ressources Archivées</h1>
        <button 
            onClick={() => navigate('/ressources')}
            className="text-orange-500 font-semibold hover:underline"
        >
            &larr; Retour aux ressources
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
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

      <div>
        {displayedResources.length > 0 ? (
            displayedResources.map(resource => (
              <ArchivedResourceListItem key={resource.id} resource={resource} onUnarchive={() => unarchiveResource(resource.id)} />
            ))
        ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-500">Aucune ressource archivée.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default ArchivesPage; 
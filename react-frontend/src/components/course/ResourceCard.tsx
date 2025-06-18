import React from 'react';
import { BarChart3, Trash2 } from 'lucide-react';
import { 
    Dialog, 
    DialogContent, 
    DialogTrigger,
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter,
    DialogClose
} from '../ui/dialog';

interface ResourceCardProps {
  title: string;
  imageUrl: string;
  fileCount: number;
  onViewResource?: () => void;
  onDelete?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  imageUrl,
  fileCount,
  onViewResource,
  onDelete,
}) => {
  
  return (
    <div 
      className={`relative flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl ${onViewResource ? 'cursor-pointer' : ''}`}
      onClick={onViewResource}
      role={onViewResource ? 'button' : undefined}
      tabIndex={onViewResource ? 0 : undefined}
      onKeyDown={onViewResource ? (e) => { if (e.key === 'Enter' || e.key === ' ') onViewResource(); } : undefined}
    >
      {onDelete && (
        <div className="absolute top-2 right-2 z-10">
          <DeleteConfirmation onConfirm={onDelete} />
        </div>
      )}
      <div className="w-full h-36 bg-gray-200 overflow-hidden flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={`Ressource: ${title}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 truncate" title={title}>
          {title}
        </h2>
        <div className="flex items-center text-gray-500 text-xs mt-auto pt-1">
          <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-gray-400 stroke-1.5" />
          {fileCount}
        </div>
      </div>
    </div>
  );
};

function DeleteConfirmation({ onConfirm }: { onConfirm: () => void }) {
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button 
                    onClick={stopPropagation}
                    title="Supprimer la ressource" 
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 transition-all backdrop-blur-sm hover:cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent onClick={stopPropagation}>
                <DialogHeader>
                    <DialogTitle>Êtes-vous sûr de vouloir supprimer cette ressource ?</DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. Tous les fichiers associés à cette ressource seront également supprimés.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start mt-4">
                    <DialogClose asChild>
                         <button type="button" className="mt-2 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm">
                            Annuler
                        </button>
                    </DialogClose>
                    <DialogClose asChild>
                        <button 
                            type="button" 
                            onClick={onConfirm}
                            className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Supprimer
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ResourceCard; 
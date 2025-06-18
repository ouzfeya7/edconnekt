import React from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Download, MoreHorizontal, ChevronDown } from 'lucide-react';

interface ToolbarProps {
  // Section de gauche (généralement la recherche)
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchPlaceholder?: string;

  // Slot central pour des éléments personnalisés (ex: onglets de sous-matière, bouton filtre)
  centerSlot?: React.ReactNode;

  // Section de droite (généralement pagination et actions)
  showPagination?: boolean;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  // Pour les actions supplémentaires à droite de la pagination
  rightActions?: React.ReactNode;
}

const Toolbar: React.FC<ToolbarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  centerSlot,
  showPagination = false,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  rightActions
}) => {

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(event.target.value);
    }
  };

  const handlePageChangeInternal = (newPage: number) => {
    if (onPageChange) {
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        onPageChange(Math.max(1, Math.min(newPage, totalPages)));
    }
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Formatage de l'affichage de la page (ex: "1-04" ou "1-4")
  // Le design montre "1-04", donc si endItem < 10, on ajoute un 0 devant.
  const formattedEndItem = endItem < 10 && endItem > 0 ? `0${endItem}` : endItem.toString();
  const pageDisplay = totalItems > 0 ? `${startItem}-${formattedEndItem}` : '0-0';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 my-4 px-1">
      {/* Section Gauche: Recherche */}
      {(searchTerm !== undefined && onSearchChange) && (
        <div className="relative w-full sm:w-auto sm:flex-grow sm:max-w-xs">
          <input 
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Slot Central */}
      <div className="flex items-center gap-2 flex-wrap">
        {centerSlot}
      </div>

      {/* Section Droite: Pagination et Actions */}
      <div className="flex items-center gap-1 flex-wrap">
        {showPagination && (
          <>
            <div className="text-sm text-gray-600 whitespace-nowrap">
              <span>Page {pageDisplay}</span>
            </div>
            <button 
              onClick={() => handlePageChangeInternal(currentPage - 1)}
              disabled={currentPage === 1 || totalItems === 0}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Page précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => handlePageChangeInternal(currentPage + 1)}
              disabled={currentPage === totalPages || totalItems === 0}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Page suivante"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        {rightActions} {/* Icônes de tri, téléchargement, plus, etc. */}
      </div>
    </div>
  );
};

export default Toolbar;
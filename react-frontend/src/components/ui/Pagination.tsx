import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number; // Non utilisé directement dans ce composant simple, mais utile pour le parent
  totalItems?: number;  // Non utilisé directement ici
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null; // Ne pas afficher la pagination s'il n'y a qu'une page ou moins
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Pour une pagination plus complexe avec des numéros de page, etc.
  // Pour l'instant, juste Précédent / Suivant et indication Page X sur Y
  // Le design fourni montre "Page 1-04" et des icônes, ce qui implique une logique de portée d'items.
  // Je vais simplifier pour l'instant à "Page X / Y".
  
  return (
    <div className="flex items-center justify-between mt-4 px-4 py-3 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
            aria-label="Précédent"
          >
            <ChevronLeft size={20} />
          </button>
          {/* TODO: Ajouter une logique pour afficher les numéros de page si nécessaire */}
          {/* Pour l'instant, on garde simple avec Précédent/Suivant */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
            aria-label="Suivant"
          >
            <ChevronRight size={20} />
          </button>
          <button
             className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 ml-2"
             aria-label="Plus d'options"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 
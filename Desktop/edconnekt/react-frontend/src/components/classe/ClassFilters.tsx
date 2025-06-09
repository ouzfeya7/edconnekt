import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
// Si vous utilisez i18n, n'oubliez pas d'importer useTranslation
// import { useTranslation } from "react-i18next";
// Si vous utilisez des icônes de lucide-react, vous pourriez importer ici
// import { SlidersHorizontal, RotateCcw } from 'lucide-react'; // Exemples d'icônes

interface FilterState {
  trimestre: string;
  type: string;
  status: string;
}

interface ClassFiltersProps {
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

const ClassFilters: React.FC<ClassFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  // Si vous utilisez i18n, décommentez la ligne suivante
  // const { t } = useTranslation();

  // Composant interne pour le chevron, réutilisable pour chaque select
  const ChevronIcon = () => (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  );

  return (
    <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border border-gray-200 mt-4 divide-x divide-gray-200">
      {/* Label "Filtre" avec icône */}
      <div className="flex items-center gap-3 px-4 py-1">
        <Filter className="w-5 h-5 text-gray-500" />
        <span className="text-gray-700 font-medium text-sm">Filtre</span>
      </div>

      {/* Select pour le Trimestre */}
      <div className="relative pl-4">
        <select
          value={filters.trimestre}
          onChange={(e) => onFilterChange('trimestre', e.target.value)}
          className="appearance-none bg-transparent border-none rounded-lg pr-8 py-2 text-gray-700 text-sm focus:outline-none"
        >
          <option value="">Trimestre</option>
          <option value="1">Trimestre 1</option>
          <option value="2">Trimestre 2</option>
          <option value="3">Trimestre 3</option>
        </select>
        <ChevronIcon />
      </div>

      {/* Select pour le Type */}
      <div className="relative pl-4">
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="appearance-none bg-transparent border-none rounded-lg pr-8 py-2 text-gray-700 text-sm focus:outline-none"
        >
          <option value="">Type</option>
          <option value="cours">Cours</option>
          <option value="examen">Examen</option>
          <option value="devoir">Devoir</option>
        </select>
        <ChevronIcon />
      </div>

      {/* Select pour le Status */}
      <div className="relative pl-4">
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="appearance-none bg-transparent border-none rounded-lg pr-8 py-2 text-gray-700 text-sm focus:outline-none"
        >
          <option value="">Status</option>
          <option value="present">Présent</option>
          <option value="retard">Retard</option>
          <option value="absent">Absent</option>
        </select>
        <ChevronIcon />
      </div>

      {/* Bouton Réinitialiser */}
      <div className="pl-4">
        <button 
          onClick={onResetFilters}
          className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-700 px-2 py-1 rounded"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ClassFilters; 
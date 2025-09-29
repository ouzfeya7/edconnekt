import React from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import Badge from '../ui/Badge';

interface FilterState {
  search: string;
  subject: string;
  referential: string;
  version: string;
  showAdvanced: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onExport: () => void;
  onCreate: () => void;
  isLoading: boolean;
  subjects: Array<{ id: string; name?: string; code?: string }>;
  totalCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onExport,
  onCreate,
  isLoading,
  subjects = [],
  totalCount
}) => {
  const activeFiltersCount = [filters.search, filters.subject, filters.referential, filters.version]
    .filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      subject: '',
      referential: '',
      version: '',
      showAdvanced: false
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-3">
      {/* Barre principale */}
      <div className="flex items-center gap-3">
        {/* Recherche principale */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par code ou libellé..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bouton filtres avancés */}
        <button
          onClick={() => onFiltersChange({ ...filters, showAdvanced: !filters.showAdvanced })}
          className={`flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
            filters.showAdvanced ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge 
              text={activeFiltersCount.toString()} 
              bgColor="bg-blue-100" 
              color="text-blue-800" 
            />
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${filters.showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {/* Compteur de résultats */}
        <div className="text-sm text-gray-600">
          {totalCount} élément{totalCount > 1 ? 's' : ''}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            disabled={isLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Export...' : 'Exporter CSV'}
          </button>
          <button 
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer
          </button>
        </div>
      </div>

      {/* Filtres avancés */}
      {filters.showAdvanced && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <select
            value={filters.subject}
            onChange={(e) => onFiltersChange({ ...filters, subject: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les matières</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name ?? subject.code}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Référentiel (optionnel)"
            value={filters.referential}
            onChange={(e) => onFiltersChange({ ...filters, referential: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="Version (optionnel)"
            value={filters.version}
            onChange={(e) => onFiltersChange({ ...filters, version: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              Effacer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

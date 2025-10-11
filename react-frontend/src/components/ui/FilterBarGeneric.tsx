import React from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import Badge from './Badge';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarGenericProps {
  title: string;
  searchPlaceholder?: string;
  filters: {
    search: string;
    showAdvanced: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  onFiltersChange: (filters: Record<string, unknown>) => void;
  onExport?: () => void;
  onCreate?: () => void;
  isLoading?: boolean;
  totalCount: number;
  advancedFilters?: Array<{
    key: string;
    label: string;
    type: 'select' | 'input';
    options?: FilterOption[];
    placeholder?: string;
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'publish' | 'clone' | 'tree';
    disabled?: boolean;
  }>;
}

const FilterBarGeneric: React.FC<FilterBarGenericProps> = ({
  title,
  searchPlaceholder = "Rechercher...",
  filters,
  onFiltersChange,
  onExport,
  onCreate,
  isLoading = false,
  totalCount,
  advancedFilters = [],
  actions = []
}) => {
  const activeFiltersCount = Object.entries(filters)
    .filter(([key, value]) => key !== 'search' && key !== 'showAdvanced' && value)
    .length;

  const clearFilters = () => {
    const clearedFilters: Record<string, unknown> = { search: '', showAdvanced: false };
    advancedFilters.forEach(filter => {
      clearedFilters[filter.key] = '';
    });
    onFiltersChange(clearedFilters);
  };

  const getButtonVariantClasses = (variant: string = 'secondary') => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'publish':
        return 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500';
      case 'clone':
        return 'bg-violet-500 text-white hover:bg-violet-600 border-violet-500';
      case 'tree':
        return 'bg-amber-500 text-white hover:bg-amber-600 border-amber-500';
      default:
        return 'border border-gray-300 text-gray-700 hover:bg-gray-50';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-3">
      <div className="text-sm font-semibold text-gray-800">{title}</div>
      {/* Barre principale */}
      <div className="flex items-center gap-3">
        {/* Recherche principale */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bouton filtres avancés */}
        {advancedFilters.length > 0 && (
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
        )}

        {/* Compteur de résultats */}
        <div className="text-sm text-gray-600">
          {totalCount} élément{totalCount > 1 ? 's' : ''}
        </div>

        {/* Actions principales */}
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={onExport}
              disabled={isLoading}
              className="px-3 py-2 bg-slate-500 text-white border border-slate-500 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Export...' : 'Exporter CSV'}
            </button>
          )}
          
          {/* Actions personnalisées */}
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled || isLoading}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonVariantClasses(action.variant)}`}
            >
              {action.label}
            </button>
          ))}
          
          {onCreate && (
            <button 
              onClick={onCreate}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer
            </button>
          )}
        </div>
      </div>

      {/* Filtres avancés */}
      {filters.showAdvanced && advancedFilters.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          {advancedFilters.map((filter) => (
            <div key={filter.key}>
              {filter.type === 'select' ? (
                <select
                  value={filters[filter.key] || ''}
                  onChange={(e) => onFiltersChange({ ...filters, [filter.key]: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{filter.label}</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={filter.placeholder || filter.label}
                  value={filters[filter.key] || ''}
                  onChange={(e) => onFiltersChange({ ...filters, [filter.key]: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}

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

export default FilterBarGeneric;

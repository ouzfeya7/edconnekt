import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, X, RotateCcw } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'dateRange' | 'search';
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterPanelProps {
  filters: FilterGroup[];
  values: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearAll: () => void;
  onClearFilter: (key: string) => void;
  className?: string;
  title?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values,
  onFilterChange,
  onClearAll,
  onClearFilter,
  className = '',
  title
}) => {
  const { t } = useTranslation();

  const renderFilterControl = (filter: FilterGroup) => {
    const value = values[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <select
              value={value || ''}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">{filter.placeholder || t('select_all', 'Tous')}</option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count && `(${option.count})`}
                </option>
              ))}
            </select>
          </div>
        );

      case 'dateRange':
        return (
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                placeholder={t('start_date', 'Date début')}
                value={value?.start || ''}
                onChange={(e) => onFilterChange(filter.key, { ...value, start: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <input
                type="date"
                placeholder={t('end_date', 'Date fin')}
                value={value?.end || ''}
                onChange={(e) => onFilterChange(filter.key, { ...value, end: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <input
              type="text"
              placeholder={filter.placeholder || t('search', 'Rechercher...')}
              value={value || ''}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const hasActiveFilters = values ? Object.values(values).some(value => 
    value && (Array.isArray(value) ? value.length > 0 : value !== '')
  ) : false;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header avec bouton de réinitialisation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">
            {title || t('filters', 'Filtres')}
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('clear_all', 'Tout effacer')}</span>
          </button>
        )}
      </div>

      {/* Filtres sur une seule ligne */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              {renderFilterControl(filter)}
            </div>
          ))}
        </div>
      </div>

      {/* Filtres actifs */}
      {hasActiveFilters && values && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(values).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const filter = filters.find(f => f.key === key);
              if (!filter) return null;

              const displayValue = Array.isArray(value) 
                ? value.map(v => filter.options?.find(opt => opt.value === v)?.label || v).join(', ')
                : filter.options?.find(opt => opt.value === value)?.label || value;

              return (
                <div
                  key={key}
                  className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  <span>{filter.label}: {displayValue}</span>
                  <button
                    onClick={() => onClearFilter(key)}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

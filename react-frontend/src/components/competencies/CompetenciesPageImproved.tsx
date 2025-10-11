import React, { useState, useCallback } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Types
interface Competency {
  id: string;
  code: string;
  label: string;
  description?: string;
  subject_id: string;
  subject_name?: string;
  referential_id: string;
  version_number: number;
  created_at: string;
}

interface FilterState {
  search: string;
  subject: string;
  referential: string;
  version: string;
  showAdvanced: boolean;
}

// Composants UI réutilisables
const Badge: React.FC<{ variant: 'primary' | 'secondary' | 'success'; children: React.ReactNode }> = ({ variant, children }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${variants[variant]}`}>
      {children}
    </span>
  );
};

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

// Barre de filtres améliorée
const FilterBar: React.FC<{
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onExport: () => void;
  isLoading: boolean;
}> = ({ filters, onFiltersChange, onExport, isLoading }) => {
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
          className={`flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 ${
            filters.showAdvanced ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="primary">{activeFiltersCount}</Badge>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${filters.showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            disabled={isLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Exporter CSV
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Toutes les matières</option>
            <option value="math">Mathématiques</option>
            <option value="french">Français</option>
          </select>

          <input
            type="text"
            placeholder="Référentiel (optionnel)"
            value={filters.referential}
            onChange={(e) => onFiltersChange({ ...filters, referential: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />

          <input
            type="text"
            placeholder="Version (optionnel)"
            value={filters.version}
            onChange={(e) => onFiltersChange({ ...filters, version: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800"
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

// Carte de compétence améliorée
const CompetencyCard: React.FC<{
  competency: Competency;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}> = ({ competency, onEdit, onDelete, onView }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{competency.label}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">{competency.code}</Badge>
            {competency.subject_name && (
              <Badge variant="secondary">{competency.subject_name}</Badge>
            )}
          </div>
        </div>

        {/* Menu actions */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              <button
                onClick={() => { onView(competency.id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                Voir
              </button>
              <button
                onClick={() => { onEdit(competency.id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
                Éditer
              </button>
              <button
                onClick={() => { onDelete(competency.id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {competency.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{competency.description}</p>
      )}

      {/* Métadonnées */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Réf: {competency.referential_id} • v{competency.version_number}</span>
        <span>{new Date(competency.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// Composant principal
const CompetenciesPageImproved: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    subject: '',
    referential: '',
    version: '',
    showAdvanced: false
  });

  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id?: string }>({
    isOpen: false,
    id: undefined
  });

  const [isLoading, setIsLoading] = useState(false);

  // Données mockées
  const competencies: Competency[] = [
    {
      id: '1',
      code: 'C.TEST.01',
      label: "c'est qu'un test",
      description: "Description de la compétence de test",
      subject_id: 'math',
      subject_name: 'Mathématiques',
      referential_id: '8e3f2e46-9f15-44a9-b2e6-48d4a4fd3bb3',
      version_number: 1,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      code: 'C.TEST.02',
      label: "c'est encore un test",
      description: "Une autre compétence de test",
      subject_id: 'french',
      subject_name: 'Français',
      referential_id: '8e3f2e46-9f15-44a9-b2e6-48d4a4fd3bb3',
      version_number: 1,
      created_at: '2024-01-16T10:00:00Z'
    }
  ];

  // Handlers
  const handleEdit = useCallback((id: string) => {
    toast.success(`Édition de la compétence ${id}`);
  }, []);

  const handleView = useCallback((id: string) => {
    toast.success(`Affichage de la compétence ${id}`);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    setIsLoading(true);
    
    // Simulation d'une suppression
    setTimeout(() => {
      toast.success('Compétence supprimée avec succès');
      setConfirmDelete({ isOpen: false, id: undefined });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleExport = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Export CSV généré');
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compétences</h1>
            <p className="text-gray-600 mt-1">Gérez les compétences de vos référentiels</p>
          </div>
          <Badge variant="secondary">{competencies.length} élément(s)</Badge>
        </div>
      </div>

      {/* Barre de filtres */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        isLoading={isLoading}
      />

      {/* Liste des compétences */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competencies.map((competency) => (
              <CompetencyCard
                key={competency.id}
                competency={competency}
                onEdit={handleEdit}
                onDelete={(id) => setConfirmDelete({ isOpen: true, id })}
                onView={handleView}
              />
            ))}
          </div>
        )}

        {competencies.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune compétence trouvée</p>
          </div>
        )}
      </div>

      {/* Dialog de confirmation */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Supprimer la compétence"
        message="Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '' })}
      />
    </div>
  );
};

export default CompetenciesPageImproved;

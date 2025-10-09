import React, { useState, useRef, useEffect } from 'react';
import { Globe, Copy, MoreVertical, Eye, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';

interface GlobalReferentialCardProps {
  globalReferential: {
    id: string;
    name: string;
    cycle?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClone: (id: string, name: string, cycle?: string) => void;
  onView?: (id: string) => void;
}

const GlobalReferentialCard: React.FC<GlobalReferentialCardProps> = ({
  globalReferential,
  isSelected,
  onSelect,
  onClone,
  onView
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCycleIcon = (cycle?: string) => {
    switch (cycle) {
      case 'PRESCOLAIRE': return '🧸';
      case 'PRIMAIRE': return '📚';
      case 'COLLEGE': return '🎓';
      case 'LYCEE': return '🏛️';
      case 'UNIVERSITE': return '🎯';
      default: return '🌍';
    }
  };

  const getCycleLabel = (cycle?: string) => {
    switch (cycle) {
      case 'PRESCOLAIRE': return 'Préscolaire';
      case 'PRIMAIRE': return 'Primaire';
      case 'COLLEGE': return 'Collège';
      case 'LYCEE': return 'Lycée';
      case 'SECONDAIRE': return 'Secondaire';
      case 'UNIVERSITE': return 'Université';
      default: return cycle || 'Non défini';
    }
  };

  return (
    <div 
      className={`bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        isSelected 
          ? 'border-orange-500 shadow-md ring-2 ring-orange-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(globalReferential.id)}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {/* Titre avec icône */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getCycleIcon(globalReferential.cycle)}</span>
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg leading-tight group-hover:text-orange-700 transition-colors">
              {globalReferential.name}
            </h3>
          </div>
          
          {/* Badges principaux */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {globalReferential.cycle && (
              <Badge 
                text={getCycleLabel(globalReferential.cycle)} 
                bgColor="bg-orange-100" 
                color="text-orange-800" 
              />
            )}
            <Badge 
              text="Global" 
              bgColor="bg-blue-100" 
              color="text-blue-800" 
            />
          </div>
        </div>

        {/* Actions rapides + menu */}
        <div className="flex items-center gap-1">
          {/* Actions rapides visibles au hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mr-2">
            {onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(globalReferential.id);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Voir les détails"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClone(globalReferential.id, globalReferential.name, globalReferential.cycle);
              }}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Cloner"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Menu principal */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Plus d'actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 min-w-[140px] dropdown-menu">
                {onView && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(globalReferential.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Voir détails
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClone(globalReferential.id, globalReferential.name, globalReferential.cycle);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Cloner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {globalReferential.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{globalReferential.description}</p>
        </div>
      )}

      {/* Informations contextuelles */}
      <div className="space-y-2 mb-4">
        {/* ID du référentiel global */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Globe className="w-3 h-3" />
          <span>ID: {globalReferential.id.substring(0, 8)}...</span>
        </div>

        {/* Date de création */}
        {globalReferential.created_at && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Créé le {formatDate(globalReferential.created_at)}</span>
          </div>
        )}
      </div>

      {/* Pied de carte avec indicateur de statut */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full bg-blue-400 status-indicator"
            title="Référentiel global"
          ></div>
          <span className="text-xs text-gray-500">Catalogue Global</span>
        </div>
        
        {/* Indicateur de sélection */}
        {isSelected && (
          <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Sélectionné
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalReferentialCard;

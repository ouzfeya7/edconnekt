import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Eye, GraduationCap, BookOpen, Users, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';

interface ReferentialCardProps {
  referential: {
    id: string;
    name: string;
    cycle: string;
    version_number: number;
    state: 'DRAFT' | 'PUBLISHED';
    visibility?: 'TENANT' | 'GLOBAL';
    created_at?: string;
    updated_at?: string;
    published_at?: string | null;
  };
  isSelected?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, version: number) => void;
  onView?: (id: string) => void;
  onSelect?: (id: string, version: number) => void;
  stats?: {
    domains?: number;
    subjects?: number;
    competencies?: number;
  };
}

const ReferentialCard: React.FC<ReferentialCardProps> = ({
  referential,
  isSelected = false,
  onEdit,
  onDelete,
  onView,
  onSelect,
  stats
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

  const getCycleIcon = (cycle: string) => {
    switch (cycle) {
      case 'PRESCOLAIRE': return '🧸';
      case 'PRIMAIRE': return '📚';
      case 'COLLEGE': return '🎓';
      case 'LYCEE': return '🏛️';
      case 'UNIVERSITE': return '🎯';
      default: return '📖';
    }
  };

  const getCycleLabel = (cycle: string) => {
    switch (cycle) {
      case 'PRESCOLAIRE': return 'Préscolaire';
      case 'PRIMAIRE': return 'Primaire';
      case 'COLLEGE': return 'Collège';
      case 'LYCEE': return 'Lycée';
      case 'SECONDAIRE': return 'Secondaire';
      case 'UNIVERSITE': return 'Université';
      default: return cycle;
    }
  };

  return (
    <div 
      className={`bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        isSelected 
          ? 'border-orange-500 shadow-md ring-2 ring-orange-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect?.(referential.id, referential.version_number)}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {/* Titre avec icône */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getCycleIcon(referential.cycle)}</span>
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg leading-tight group-hover:text-orange-700 transition-colors">
              {referential.name}
            </h3>
          </div>
          
          {/* Badges principaux */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge 
              text={getCycleLabel(referential.cycle)} 
              bgColor="bg-orange-100" 
              color="text-orange-800" 
            />
            <Badge 
              text={referential.state === 'PUBLISHED' ? 'Publié' : 'Brouillon'} 
              bgColor={referential.state === 'PUBLISHED' ? 'bg-green-100' : 'bg-amber-100'} 
              color={referential.state === 'PUBLISHED' ? 'text-green-800' : 'text-amber-800'} 
            />
            {referential.visibility && (
              <Badge 
                text={referential.visibility === 'GLOBAL' ? 'Global' : 'Établissement'} 
                bgColor="bg-gray-100" 
                color="text-gray-700" 
              />
            )}
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
                  onView(referential.id);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Voir les détails"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(referential.id);
                }}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Éditer"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
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
                      onView(referential.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Voir détails
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(referential.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Éditer
                  </button>
                )}
                {onDelete && (
                  <>
                    <hr className="my-1" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(referential.id, referential.version_number);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {stats.domains !== undefined && (
              <div className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                <span>{stats.domains} domaine{stats.domains > 1 ? 's' : ''}</span>
              </div>
            )}
            {stats.subjects !== undefined && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{stats.subjects} matière{stats.subjects > 1 ? 's' : ''}</span>
              </div>
            )}
            {stats.competencies !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{stats.competencies} compétence{stats.competencies > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informations contextuelles */}
      <div className="space-y-2 mb-4">
        {/* Version */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BookOpen className="w-3 h-3" />
          <span>Version {referential.version_number}</span>
        </div>

        {/* Date de création */}
        {referential.created_at && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Créé le {formatDate(referential.created_at)}</span>
          </div>
        )}
        {/* Date de publication */}
        {referential.state === 'PUBLISHED' && referential.published_at && (
          <div className="flex items-center gap-2 text-xs text-green-700">
            <Calendar className="w-3 h-3" />
            <span>Publié le {formatDate(referential.published_at)}</span>
          </div>
        )}
      </div>

      {/* Pied de carte avec indicateur de statut */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div 
            className={`w-2 h-2 rounded-full status-indicator ${
              referential.state === 'PUBLISHED' ? 'bg-green-400' : 'bg-amber-400'
            }`} 
            title={`Référentiel ${referential.state === 'PUBLISHED' ? 'publié' : 'en brouillon'}`}
          ></div>
          <span className="text-xs text-gray-500">
            {referential.state === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
          </span>
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

export default ReferentialCard;

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Eye, Layers, BookOpen, Target, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';

interface DomainCardProps {
  domain: {
    id: string;
    name: string;
    order_index?: number;
    referential_id: string;
    version_number?: number;
    created_at?: string;
    updated_at?: string;
  };
  referentialName?: string;
  isSelected?: boolean;
  onEdit?: (domain: DomainCardProps['domain']) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onSelect?: (id: string) => void;
  stats?: {
    subjects?: number;
    competencies?: number;
  };
}

const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  referentialName,
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

  const getDomainIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('science')) return '🔬';
    if (nameLower.includes('math')) return '📐';
    if (nameLower.includes('langue') || nameLower.includes('français')) return '📝';
    if (nameLower.includes('histoire') || nameLower.includes('géographie')) return '🌍';
    if (nameLower.includes('art')) return '🎨';
    if (nameLower.includes('sport') || nameLower.includes('eps')) return '⚽';
    if (nameLower.includes('technologie') || nameLower.includes('informatique')) return '💻';
    return '📚';
  };

  const truncateRef = (refId: string) => {
    return refId.length > 8 ? `${refId.substring(0, 8)}...` : refId;
  };

  return (
    <div 
      className={`bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        isSelected 
          ? 'border-indigo-500 shadow-md ring-2 ring-indigo-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect?.(domain.id)}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {/* Titre avec icône */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getDomainIcon(domain.name)}</span>
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg leading-tight group-hover:text-indigo-700 transition-colors">
              {domain.name}
            </h3>
          </div>
          
          {/* Badges principaux */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge 
              text={`DOM-${String(domain.order_index || 0).padStart(3, '0')}`} 
              bgColor="bg-indigo-100" 
              color="text-indigo-800" 
            />
            {domain.order_index !== undefined && (
              <Badge 
                text={`Ordre: ${domain.order_index}`} 
                bgColor="bg-purple-100" 
                color="text-purple-800" 
              />
            )}
            {referentialName && (
              <Badge 
                text={referentialName} 
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
                  onView(domain.id);
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
                  onEdit(domain);
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
                      onView(domain.id);
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
                      onEdit(domain);
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
                        onDelete(domain.id);
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
            {stats.subjects !== undefined && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{stats.subjects} matière{stats.subjects > 1 ? 's' : ''}</span>
              </div>
            )}
            {stats.competencies !== undefined && (
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{stats.competencies} compétence{stats.competencies > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informations contextuelles */}
      <div className="space-y-2 mb-4">
        {/* Référentiel */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Layers className="w-3 h-3" />
          <span>Réf: {truncateRef(domain.referential_id)}</span>
          {domain.version_number && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              v{domain.version_number}
            </span>
          )}
        </div>

        {/* Date de création */}
        {domain.created_at && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Créé le {formatDate(domain.created_at)}</span>
          </div>
        )}
      </div>

      {/* Pied de carte avec indicateur de statut */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full status-indicator" title="Domaine actif"></div>
          <span className="text-xs text-gray-500">Actif</span>
        </div>
        
        {/* Indicateur de sélection */}
        {isSelected && (
          <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            Sélectionné
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainCard;

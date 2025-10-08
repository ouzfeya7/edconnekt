import React, { useEffect, useRef, useState } from 'react';
import { Users, Trash2, Calendar, MoreVertical, GraduationCap, Layers } from 'lucide-react';
import Badge from '../ui/Badge';

interface AssignmentCardProps {
  assignment: {
    id: string;
    scope_type: string;
    scope_value: string;
    created_at?: string;
    referential_id?: string;
    version_number?: number;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  isSelected,
  onSelect,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const getScopeIcon = (scopeType: string) => {
    switch (scopeType) {
      case 'CLASS':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'SCHOOL':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'LEVEL':
        return <Layers className="w-5 h-5 text-purple-600" />;
      default:
        return <Users className="w-5 h-5 text-gray-600" />;
    }
  };
  const getScopeTypeColor = (scopeType: string) => {
    switch (scopeType) {
      case 'CLASS': return 'bg-blue-100 text-blue-800';
      case 'SCHOOL': return 'bg-green-100 text-green-800';
      case 'LEVEL': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScopeTypeLabel = (scopeType: string) => {
    switch (scopeType) {
      case 'CLASS': return 'Classe';
      case 'SCHOOL': return 'École';
      case 'LEVEL': return 'Niveau';
      default: return scopeType;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const truncateRef = (refId?: string) => {
    if (!refId) return '—';
    return refId.length > 8 ? `${refId.substring(0, 8)}...` : refId;
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(assignment.id)}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {/* Titre avec icône */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getScopeIcon(assignment.scope_type)}</span>
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg leading-tight group-hover:text-blue-700 transition-colors">
              {assignment.scope_value}
            </h3>
          </div>

          {/* Badges principaux */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge
              text={getScopeTypeLabel(assignment.scope_type)}
              bgColor={getScopeTypeColor(assignment.scope_type).includes('bg-blue') ? 'bg-blue-100' : getScopeTypeColor(assignment.scope_type).includes('bg-green') ? 'bg-green-100' : getScopeTypeColor(assignment.scope_type).includes('bg-purple') ? 'bg-purple-100' : 'bg-gray-100'}
              color={getScopeTypeColor(assignment.scope_type).includes('text-blue') ? 'text-blue-800' : getScopeTypeColor(assignment.scope_type).includes('text-green') ? 'text-green-800' : getScopeTypeColor(assignment.scope_type).includes('text-purple') ? 'text-purple-800' : 'text-gray-800'}
            />
          </div>
        </div>

        {/* Actions rapides + menu */}
        <div className="flex items-center gap-1">
          {/* Action rapide (supprimer) visible au hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mr-2">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(assignment.id); }}
              className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Menu principal */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Plus d'actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 min-w-[140px] dropdown-menu">
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(assignment.id); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informations contextuelles */}
      <div className="space-y-2 mb-4">
        {/* Type et Cible */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span><strong className="text-gray-700">Type:</strong> {getScopeTypeLabel(assignment.scope_type)}</span>
          <span><strong className="text-gray-700">Cible:</strong> {assignment.scope_value}</span>
        </div>
        {/* Référentiel et version */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Réf: {truncateRef(assignment.referential_id)}</span>
        </div>

        {/* Identifiant technique */}
        <div className="text-xs text-gray-500">
          ID: {assignment.id.substring(0, 8)}...
        </div>

        {/* Date de création */}
        {assignment.created_at && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Créée le {formatDate(assignment.created_at)}</span>
          </div>
        )}
      </div>

      {/* Pied de carte avec indicateur de statut */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full status-indicator" title="Affectation active"></div>
          <span className="text-xs text-gray-500">Active</span>
        </div>
        {/* Indicateur de sélection */}
        {isSelected && (
          <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Sélectionnée
          </div>
        )}
      </div>
    </div>
  );
}
;

export default AssignmentCard;

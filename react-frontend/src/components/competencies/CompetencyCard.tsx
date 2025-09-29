import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Eye, BookOpen, Calendar, User } from 'lucide-react';
import Badge from '../ui/Badge';

interface CompetencyCardProps {
  competency: {
    id: string;
    code: string;
    label: string;
    description?: string;
    subject_id?: string;
    referential_id?: string;
    version_number?: number;
    created_at?: string;
    updated_at?: string;
  };
  subjectName?: string;
  domainName?: string;
  isSelected?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onSelect?: (id: string) => void;
}

const CompetencyCard: React.FC<CompetencyCardProps> = ({
  competency,
  subjectName,
  domainName,
  isSelected = false,
  onEdit,
  onDelete,
  onView,
  onSelect
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique à l'extérieur
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

  const truncateRef = (refId?: string) => {
    if (!refId) return '—';
    return refId.length > 8 ? `${refId.substring(0, 8)}...` : refId;
  };

  return (
    <div 
      className={`bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        isSelected 
          ? 'border-blue-500 shadow-md ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect?.(competency.id)}
    >
      {/* En-tête avec sélection */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {/* Titre principal */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg leading-tight group-hover:text-blue-700 transition-colors">
            {competency.label}
          </h3>
          
          {/* Badges principaux */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge 
              text={competency.code} 
              bgColor="bg-blue-100" 
              color="text-blue-800" 
            />
            {subjectName && (
              <Badge 
                text={subjectName} 
                bgColor="bg-emerald-100" 
                color="text-emerald-800" 
              />
            )}
            {domainName && (
              <Badge 
                text={domainName} 
                bgColor="bg-purple-100" 
                color="text-purple-800" 
              />
            )}
          </div>
        </div>

        {/* Actions rapides + menu */}
        <div className="flex items-center gap-1">
          {/* Actions rapides visibles au hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mr-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(competency.id);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Voir les détails"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(competency.id);
              }}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Éditer"
            >
              <Edit className="w-4 h-4" />
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
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 min-w-[140px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(competency.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Voir détails
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(competency.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Éditer
                </button>
                <hr className="my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(competency.id);
                    setShowMenu(false);
                  }}
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

      {/* Description enrichie */}
      {competency.description && (
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {competency.description}
          </p>
        </div>
      )}

      {/* Informations contextuelles */}
      <div className="space-y-2 mb-4">
        {/* Référentiel */}
        {competency.referential_id && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BookOpen className="w-3 h-3" />
            <span>Réf: {truncateRef(competency.referential_id)}</span>
            {competency.version_number && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                v{competency.version_number}
              </span>
            )}
          </div>
        )}

        {/* Date de création */}
        {competency.created_at && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Créé le {formatDate(competency.created_at)}</span>
          </div>
        )}
      </div>

      {/* Pied de carte avec indicateur de statut */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" title="Compétence active"></div>
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

  // Variante pour état de chargement
  if (!competency.id) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded mb-2"></div>
            <div className="flex gap-2 mb-3">
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-100">
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
};

// Composant de carte compacte pour les listes denses
export const CompetencyCardCompact: React.FC<CompetencyCardProps> = ({
  competency,
  subjectName,
  onEdit,
  onDelete,
  onView
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded p-3 hover:shadow-md transition-all duration-200 hover:border-blue-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              text={competency.code} 
              bgColor="bg-blue-100" 
              color="text-blue-800" 
            />
            <h4 className="font-medium text-gray-900 truncate">{competency.label}</h4>
          </div>
          {subjectName && (
            <span className="text-xs text-gray-500">{subjectName}</span>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onView(competency.id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(competency.id)}
            className="p-1 text-gray-400 hover:text-green-600 rounded"
            title="Éditer"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetencyCard;

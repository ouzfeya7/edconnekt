import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Eye, BookOpen, Target, User, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';

interface SubjectCardProps {
  subject: {
    id: string;
    name?: string;
    code?: string;
    domain_id: string;
    referential_id?: string;
    version_number?: number;
    created_at?: string;
    updated_at?: string;
  };
  domainName?: string;
  isSelected?: boolean;
  onEdit?: (subject: any) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onSelect?: (id: string) => void;
  stats?: {
    competencies?: number;
  };
  teacher?: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  domainName,
  isSelected = false,
  onEdit,
  onDelete,
  onView,
  onSelect,
  stats,
  teacher
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

  const getSubjectIcon = (name?: string, code?: string) => {
    const text = (name || code || '').toLowerCase();
    if (text.includes('math')) return '📐';
    if (text.includes('français') || text.includes('littérature')) return '📝';
    if (text.includes('anglais') || text.includes('english')) return '🇬🇧';
    if (text.includes('espagnol') || text.includes('spanish')) return '🇪🇸';
    if (text.includes('allemand') || text.includes('german')) return '🇩🇪';
    if (text.includes('physique') || text.includes('chimie')) return '⚗️';
    if (text.includes('biologie') || text.includes('svt')) return '🧬';
    if (text.includes('histoire')) return '🏛️';
    if (text.includes('géographie')) return '🌍';
    if (text.includes('art') || text.includes('dessin')) return '🎨';
    if (text.includes('musique')) return '🎵';
    if (text.includes('sport') || text.includes('eps')) return '⚽';
    if (text.includes('technologie') || text.includes('informatique')) return '💻';
    if (text.includes('économie')) return '💼';
    if (text.includes('philosophie')) return '🤔';
    return '📖';
  };

  const truncateRef = (refId?: string) => {
    if (!refId) return '—';
    return refId.length > 8 ? `${refId.substring(0, 8)}...` : refId;
  };

  const displayName = subject.name || subject.code || 'Matière sans nom';

  return (
    <div 
      className={`bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        isSelected 
          ? 'border-teal-500 shadow-md ring-2 ring-teal-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect?.(subject.id)}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {/* Titre avec icône */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getSubjectIcon(subject.name, subject.code)}</span>
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg leading-tight group-hover:text-teal-700 transition-colors">
              {displayName}
            </h3>
          </div>
          
          {/* Badges principaux */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {subject.code && (
              <Badge 
                text={subject.code} 
                bgColor="bg-teal-100" 
                color="text-teal-800" 
              />
            )}
            {domainName && (
              <Badge 
                text={domainName} 
                bgColor="bg-cyan-100" 
                color="text-cyan-800" 
              />
            )}
            {!subject.name && subject.code && (
              <Badge 
                text="Code uniquement" 
                bgColor="bg-amber-100" 
                color="text-amber-800" 
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
                  onView(subject.id);
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
                  onEdit(subject);
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
                      onView(subject.id);
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
                      onEdit(subject);
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
                        onDelete(subject.id);
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

      {/* Statistiques et enseignant */}
      <div className="mb-4 space-y-2">
        {/* Statistiques */}
        {stats && stats.competencies !== undefined && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{stats.competencies} compétence{stats.competencies > 1 ? 's' : ''} active{stats.competencies > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Enseignant responsable */}
        {teacher && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{teacher} (responsable)</span>
          </div>
        )}
      </div>

      {/* Informations contextuelles */}
      <div className="space-y-2 mb-4">
        {/* Référentiel */}
        {subject.referential_id && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BookOpen className="w-3 h-3" />
            <span>Réf: {truncateRef(subject.referential_id)}</span>
            {subject.version_number && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                v{subject.version_number}
              </span>
            )}
          </div>
        )}

        {/* Date de création */}
        {subject.created_at && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Créé le {formatDate(subject.created_at)}</span>
          </div>
        )}
      </div>

      {/* Pied de carte avec indicateur de statut */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full status-indicator" title="Matière active"></div>
          <span className="text-xs text-gray-500">Active</span>
        </div>
        
        {/* Indicateur de sélection */}
        {isSelected && (
          <div className="flex items-center gap-1 text-xs text-teal-600 font-medium">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            Sélectionnée
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectCard;

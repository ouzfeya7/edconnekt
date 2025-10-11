import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, CheckCircle, Send, X, Calendar, Activity, Settings, AlertCircle } from 'lucide-react';
// removed unused Badge import

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    status: string;
    school_year?: string;
    establishment_id?: string;
    class_id?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  isSelected?: boolean;
  onView?: (id: string) => void;
  onOpen?: (id: string) => void;
  onValidate?: (id: string) => void;
  onPublish?: (id: string) => void;
  onClose?: (id: string) => void;
  onSelect?: (id: string) => void;
  stats?: {
    teacherLists?: number;
    consolidatedLists?: number;
    submittedLists?: number;
  };
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  isSelected = false,
  onView,
  onOpen,
  onValidate,
  onPublish,
  onClose,
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return <Settings className="h-4 w-4" />;
      case 'open': return <Eye className="h-4 w-4" />;
      case 'validated': 
      case 'in_validation': return <CheckCircle className="h-4 w-4" />;
      case 'published': return <Send className="h-4 w-4" />;
      case 'closed': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
      case 'open': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'validated':
      case 'in_validation': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'published': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'closed': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const statusUpper = (campaign.status || '').toUpperCase();
  const statusLower = (campaign.status || '').toLowerCase();
  const isDraft = statusUpper === 'DRAFT' || statusLower === 'draft';
  const isOpen = statusUpper === 'OPEN' || statusLower === 'open';
  const isInValidation = statusUpper === 'IN_VALIDATION' || statusLower === 'in_validation' || statusLower === 'validated';
  const isPublished = statusUpper === 'PUBLISHED' || statusLower === 'published';
  const isClosed = statusUpper === 'CLOSED' || statusLower === 'closed';

  const statusColors = getStatusColor(campaign.status);

  return (
    <div 
      className={`relative bg-gradient-to-br from-white to-gray-50 border rounded-xl p-5 cursor-pointer group ${isSelected 
          ? 'border-blue-400 shadow-xl ring-2 ring-blue-300 bg-gradient-to-br from-blue-50 to-white' 
          : 'border-gray-200 hover:border-blue-200'
      }`}
      onClick={() => onSelect?.(campaign.id)}
    >
      {/* Indicateur de sélection absolu */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-blue-400 text-white rounded-full p-2 shadow-lg">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      )}
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {/* Titre avec icône */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-100' : 'bg-indigo-100'}`}>
              <Calendar className={`h-5 w-5 ${isSelected ? 'text-sky-500' : 'text-indigo-500'}`} />
            </div>
            <h3 className="font-bold text-gray-900 line-clamp-2 text-lg leading-tight">
              {campaign.name}
            </h3>
          </div>
          {/* Badges principaux avec animations */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {campaign.school_year && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-xs font-medium border border-indigo-200 shadow-sm">
                <Calendar className="w-3 h-3" />
                {campaign.school_year}
              </div>
            )}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusColors.bg} ${statusColors.text} rounded-full text-xs font-semibold border ${statusColors.border} shadow-sm`}>
              {getStatusIcon(campaign.status)}
              {campaign.status}
            </div>
          </div>
        </div>

        {/* Menu d'actions */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            aria-label="Plus d'actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-20 min-w-[160px]">
              {onView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(campaign.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">Voir détails</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Statistiques avec design moderne */}
      {stats && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 text-sm">
            {stats.teacherLists !== undefined && (
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3 text-center">
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-wide text-blue-700 font-semibold mb-1">Enseignants</div>
                  <div className="text-2xl font-bold text-blue-600">{stats.teacherLists}</div>
                </div>
              </div>
            )}
            {stats.consolidatedLists !== undefined && (
              <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-3 text-center">
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-wide text-emerald-700 font-semibold mb-1">Consolidées</div>
                  <div className="text-2xl font-bold text-emerald-600">{stats.consolidatedLists}</div>
                </div>
              </div>
            )}
            {stats.submittedLists !== undefined && (
              <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-3 text-center">
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-wide text-purple-700 font-semibold mb-1">Soumises</div>
                  <div className="text-2xl font-bold text-purple-600">{stats.submittedLists}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informations contextuelles avec design amélioré */}
      <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
        {/* Date de création */}
        {campaign.created_at && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="p-1 bg-white rounded">
              <Calendar className="w-3 h-3 text-gray-500" />
            </div>
            <span className="font-medium">Créée le</span>
            <span className="text-gray-700 font-semibold">{formatDate(campaign.created_at)}</span>
          </div>
        )}
        {/* Date de mise à jour */}
        {campaign.updated_at && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="p-1 bg-white rounded">
              <Activity className="w-3 h-3 text-gray-500" />
            </div>
            <span className="font-medium">Mise à jour</span>
            <span className="text-gray-700 font-semibold">{formatDate(campaign.updated_at)}</span>
          </div>
        )}
      </div>

      {/* Actions avec fond coloré léger et plus visibles */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        {onOpen && (isDraft || isClosed) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(campaign.id);
            }}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg shadow-sm"
          >
            Ouvrir
          </button>
        )}
        {onValidate && isOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onValidate(campaign.id);
            }}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg shadow-sm"
          >
            Valider
          </button>
        )}
        {onPublish && isInValidation && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPublish(campaign.id);
            }}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg shadow-sm"
          >
            Publier
          </button>
        )}
        {onClose && (isOpen || isInValidation || isPublished) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(campaign.id);
            }}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg shadow-sm"
          >
            Fermer
          </button>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;


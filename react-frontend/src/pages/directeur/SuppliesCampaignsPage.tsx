import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSuppliesCampaignDashboard, useSuppliesCampaignList } from '../../hooks/useSuppliesCampaigns';
import { useCreateCampaign, useOpenCampaign, useValidateCampaign, usePublishCampaign, useCloseCampaign } from '../../hooks/useSuppliesCampaignMutations';
import { Toaster, toast } from 'react-hot-toast';
import { getActiveContext } from '../../utils/contextStorage';
import FilterBarGeneric from '../../components/ui/FilterBarGeneric';
import CampaignCard from '../../components/supplies/CampaignCard';

import { 
  Calendar, 
  Plus, 
  Eye, 
  CheckCircle, 
  Send, 
  X, 
  Settings,
  Activity,
  AlertCircle
} from 'lucide-react';

const SuppliesCampaignsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [newName, setNewName] = useState<string>('');
  const [newSchoolYear, setNewSchoolYear] = useState<string>('');
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [order] = useState<string>('');
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');

  // Filtres unifiés
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    establishmentId: '',
    schoolYear: '',
    classId: '',
    showAdvanced: false
  });

  const qc = useQueryClient();
  const { data: dashboard, isLoading: isDashLoading, refetch: refetchDashboard } = useSuppliesCampaignDashboard(selectedCampaignId || undefined);
  const { data: listData } = useSuppliesCampaignList({
    q: filters.search || null,
    status: filters.status || null,
    order: order || null,
    establishmentId: filters.establishmentId || null,
    schoolYear: filters.schoolYear || null,
    classId: filters.classId || null,
    limit,
    offset,
  });

  const create = useCreateCampaign();
  const open = useOpenCampaign();
  const validate = useValidateCampaign();
  const publish = usePublishCampaign();
  const close = useCloseCampaign();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'validated': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return <Settings className="h-4 w-4" />;
      case 'open': return <Eye className="h-4 w-4" />;
      case 'validated': return <CheckCircle className="h-4 w-4" />;
      case 'published': return <Send className="h-4 w-4" />;
      case 'closed': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleAction = async (action: () => Promise<unknown>, successMessage: string, idForRefresh?: string) => {
    try {
      await action();
      // Actualiser la liste et la fiche si ouverte
      qc.invalidateQueries({ queryKey: ['supplies', 'campaign', 'list'] });
      if (idForRefresh && selectedCampaignId === idForRefresh) {
        await refetchDashboard();
      }
      toast.success(successMessage);
    } catch {
      toast.error(t('Erreur lors de l\'opération', 'Erreur lors de l\'opération'));
    }
  };


  return (
    <div>
      <Toaster position="top-right" />
      
      {/* Barre de filtres simplifiée */}
      <div className="border-b border-gray-200 mb-6">
        <FilterBarGeneric
          title={t('Campagnes', 'Campagnes')}
          searchPlaceholder={t('Rechercher une campagne...', 'Rechercher une campagne...')}
          filters={filters}
          onFiltersChange={(f) => {
            setFilters(f);
            setOffset(0);
          }}
          onCreate={() => setIsCreateOpen(true)}
          isLoading={false}
          totalCount={(listData ?? []).length}
          advancedFilters={[
            {
              key: 'status',
              label: t('Tous statuts', 'Tous statuts'),
              type: 'select',
              options: [
                { value: 'draft', label: 'Draft' },
                { value: 'open', label: 'Open' },
                { value: 'validated', label: 'Validated' },
                { value: 'published', label: 'Published' },
                { value: 'closed', label: 'Closed' }
              ]
            },
            {
              key: 'schoolYear',
              label: t('Année scolaire', 'Année scolaire'),
              type: 'input',
              placeholder: t('Ex: 2025-2026', 'Ex: 2025-2026')
            },
            {
              key: 'establishmentId',
              label: t('Établissement ID', 'Établissement ID'),
              type: 'input',
              placeholder: t('ID Établissement', 'ID Établissement')
            },
            {
              key: 'classId',
              label: t('Classe ID', 'Classe ID'),
              type: 'input',
              placeholder: t('ID Classe', 'ID Classe')
            }
          ]}
        />

        {/* Grille de cartes comme Référentiels */}
        <div className="p-6">
          {/* Sélecteur de vue simple */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {(listData ?? []).length} campagne{(listData ?? []).length > 1 ? 's' : ''}
            </div>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 text-sm font-medium border rounded-l-md ${
                  viewMode === 'cards' 
                    ? 'bg-sky-50 text-sky-700 border-sky-300 z-10' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('Cartes', 'Cartes')}
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-4 py-2 text-sm font-medium border-t border-r border-b rounded-r-md ${
                  viewMode === 'compact' 
                    ? 'bg-sky-50 text-sky-700 border-sky-300 z-10' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('Liste', 'Liste')}
              </button>
            </div>
          </div>

          <div className={viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
            {(listData ?? []).map((campaign) => {
              const statusUpper = (campaign.status || '').toUpperCase();
              const statusLower = (campaign.status || '').toLowerCase();
              const isDraft = statusUpper === 'DRAFT' || statusLower === 'draft';
              const isOpen = statusUpper === 'OPEN' || statusLower === 'open';
              const isInValidation = statusUpper === 'IN_VALIDATION' || statusLower === 'in_validation' || statusLower === 'validated';
              const isPublished = statusUpper === 'PUBLISHED' || statusLower === 'published';
              const isClosed = statusUpper === 'CLOSED' || statusLower === 'closed';

              if (viewMode === 'compact') {
                // Vue compacte (liste)
                return (
                  <div 
                    key={campaign.id} 
                    className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedCampaignId === campaign.id ? 'bg-sky-50 border-sky-300' : 'bg-white'
                    }`}
                    onClick={() => setSelectedCampaignId(campaign.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium text-gray-900 truncate">{campaign.name}</span>
                        {(campaign as any).school_year && (
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                            {(campaign as any).school_year}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(campaign.status || '')}`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t('Créée le', 'Créée le')} {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : '-'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {(isDraft || isClosed) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(() => open.mutateAsync(campaign.id), t('Campagne ouverte', 'Campagne ouverte'), campaign.id);
                          }}
                          className="px-4 py-2 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg shadow-sm hover:shadow transition-all"
                        >
                          {t('Ouvrir', 'Ouvrir')}
                        </button>
                      )}
                      {isOpen && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(() => validate.mutateAsync(campaign.id), t('Campagne validée', 'Campagne validée'), campaign.id);
                          }}
                          className="px-4 py-2 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg shadow-sm hover:shadow transition-all"
                        >
                          {t('Valider', 'Valider')}
                        </button>
                      )}
                      {isInValidation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(() => publish.mutateAsync(campaign.id), t('Campagne publiée', 'Campagne publiée'), campaign.id);
                          }}
                          className="px-4 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg shadow-sm hover:shadow transition-all"
                        >
                          {t('Publier', 'Publier')}
                        </button>
                      )}
                      {(isOpen || isInValidation || isPublished) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(() => close.mutateAsync(campaign.id), t('Campagne clôturée', 'Campagne clôturée'), campaign.id);
                          }}
                          className="px-4 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg shadow-sm hover:shadow transition-all"
                        >
                          {t('Fermer', 'Fermer')}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCampaignId(campaign.id);
                          setIsViewOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {t('Détails', 'Détails')}
                      </button>
                    </div>
                  </div>
                );
              }

              // Vue cartes
              return (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign as any}
                  isSelected={selectedCampaignId === campaign.id}
                  onView={(id) => {
                    setSelectedCampaignId(id);
                    setIsViewOpen(true);
                  }}
                  onOpen={(id) => handleAction(() => open.mutateAsync(id), t('Campagne ouverte', 'Campagne ouverte'), id)}
                  onValidate={(id) => handleAction(() => validate.mutateAsync(id), t('Campagne validée', 'Campagne validée'), id)}
                  onPublish={(id) => handleAction(() => publish.mutateAsync(id), t('Campagne publiée', 'Campagne publiée'), id)}
                  onClose={(id) => handleAction(() => close.mutateAsync(id), t('Campagne clôturée', 'Campagne clôturée'), id)}
                  onSelect={(id) => setSelectedCampaignId(id)}
                  stats={
                    selectedCampaignId === campaign.id && dashboard
                      ? {
                          teacherLists: dashboard.teacher_lists_count,
                          consolidatedLists: dashboard.consolidated_lists_count,
                          submittedLists: dashboard.submitted_teacher_lists
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>

          {/* Message si vide - Design moderne */}
          {(listData ?? []).length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-full mb-6 animate-bounce">
                <Calendar className="h-10 w-10 text-sky-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('Aucune campagne trouvée', 'Aucune campagne trouvée')}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {t('Commencez par créer votre première campagne de fournitures pour démarrer', 'Commencez par créer votre première campagne de fournitures pour démarrer')}
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-5 w-5" />
                {t('Créer une campagne', 'Créer une campagne')}
              </button>
            </div>
          )}
        </div>

        {/* Pagination modernisée */}
        {(listData ?? []).length > 0 && (
          <div className="flex items-center justify-between px-6 pb-6 pt-6 border-t bg-gradient-to-b from-white to-gray-50">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-white hover:border-sky-300 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-gray-700 transition-all shadow-sm hover:shadow"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
            >
              ← {t('Précédent', 'Précédent')}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-sm font-medium text-gray-600">{t('Page', 'Page')}</span>
              <span className="text-lg font-bold text-sky-500">{Math.floor(offset / limit) + 1}</span>
            </div>
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-white hover:border-sky-300 hover:text-sky-600 transition-all shadow-sm hover:shadow"
              onClick={() => setOffset(offset + limit)}
            >
              {t('Suivant', 'Suivant')} →
            </button>
          </div>
        )}
      </div>
        {/* Modal création campagne - Design moderne */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !create.isPending && setIsCreateOpen(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg mx-4 p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('Nouvelle campagne', 'Nouvelle campagne')}</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors" 
                  onClick={() => !create.isPending && setIsCreateOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('Nom de la campagne', 'Nom de la campagne')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                    placeholder={t('Ex: Campagne CP2 2026', 'Ex: Campagne CP2 2026')}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('Année scolaire', 'Année scolaire')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                    placeholder={t('Ex: 2025-2026', 'Ex: 2025-2026')}
                    value={newSchoolYear}
                    onChange={(e) => setNewSchoolYear(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    disabled={create.isPending}
                    onClick={() => setIsCreateOpen(false)}
                  >
                    {t('Annuler', 'Annuler')}
                  </button>
                  <button
                    className="px-5 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-semibold"
                    disabled={!newName.trim() || !newSchoolYear.trim() || create.isPending}
                    onClick={async () => {
                      try {
                        const { etabId } = getActiveContext();
                        if (!etabId) {
                          toast.error(t("Aucun établissement sélectionné", 'Aucun établissement sélectionné'));
                          return;
                        }
                        const created = await create.mutateAsync({ name: newName.trim(), establishmentId: etabId, schoolYear: newSchoolYear.trim() });
                        setNewName('');
                        setNewSchoolYear('');
                        setIsCreateOpen(false);
                        const createdId = (created as { id?: string } | undefined)?.id;
                        if (createdId) {
                          setSelectedCampaignId(createdId);
                          setIsViewOpen(true);
                          await refetchDashboard();
                        }
                        toast.success(t('Campagne créée avec succès', 'Campagne créée avec succès'));
                      } catch {
                        toast.error(t('Erreur lors de la création', 'Erreur lors de la création'));
                      }
                    }}
                  >
                    {create.isPending ? t('Création...', 'Création...') : t('Créer la campagne', 'Créer la campagne')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fiche campagne (modal) */}
        {isViewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setIsViewOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{t('Fiche campagne', 'Fiche campagne')}</h2>
                </div>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsViewOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isDashLoading ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-indigo-800">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    <span>{t('Chargement des données...', 'Chargement des données...')}</span>
                  </div>
                </div>
              ) : dashboard ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">{t('Nom', 'Nom')}</div>
                      <div className="text-lg font-semibold text-gray-900">{dashboard.name}</div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getStatusColor(dashboard.status)}`}>
                      {getStatusIcon(dashboard.status)}
                      <span className="font-medium text-sm">{dashboard.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">{t('ID', 'ID')}</div>
                      <div className="font-mono text-sm text-gray-900 break-all">{dashboard.id}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">{t('Créée le', 'Créée le')}</div>
                      <div className="text-sm text-gray-900">{new Date(dashboard.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-xs text-blue-800">{t('Listes enseignants', 'Listes enseignants')}</div>
                      <div className="text-2xl font-bold text-blue-700">{dashboard.teacher_lists_count}</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="text-xs text-emerald-800">{t('Listes consolidées', 'Listes consolidées')}</div>
                      <div className="text-2xl font-bold text-emerald-700">{dashboard.consolidated_lists_count}</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-xs text-purple-800">{t('Listes soumises', 'Listes soumises')}</div>
                      <div className="text-2xl font-bold text-purple-700">{dashboard.submitted_teacher_lists}</div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className="px-4 py-2 rounded-lg border border-gray-200" onClick={() => setIsViewOpen(false)}>{t('Fermer', 'Fermer')}</button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">{t('Aucune donnée', 'Aucune donnée')}</div>
              )}
            </div>
          </div>
        )}

        {/* État de chargement */}
        {isDashLoading && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-indigo-800">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              <span>{t('Chargement des données...', 'Chargement des données...')}</span>
            </div>
          </div>
        )}
      </div>
  );
};

export default SuppliesCampaignsPage;
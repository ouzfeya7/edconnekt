import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSuppliesCampaignDashboard, useSuppliesCampaignList } from '../../hooks/useSuppliesCampaigns';
import { useCreateCampaign, useOpenCampaign, useValidateCampaign, usePublishCampaign, useCloseCampaign } from '../../hooks/useSuppliesCampaignMutations';
import { Toaster, toast } from 'react-hot-toast';
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
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [order] = useState<string>('');
  const [establishmentId, setEstablishmentId] = useState<string>('');
  const [schoolYear, setSchoolYear] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const qc = useQueryClient();
  const { data: dashboard, isLoading: isDashLoading, refetch: refetchDashboard } = useSuppliesCampaignDashboard(selectedCampaignId || undefined);
  const { data: listData } = useSuppliesCampaignList({
    q: search || null,
    status: statusFilter || null,
    order: order || null,
    establishmentId: establishmentId || null,
    schoolYear: schoolYear || null,
    classId: classId || null,
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
      
      {/* Header de section avec bouton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('Campagnes', 'Campagnes')}</h2>
            <p className="text-gray-600 text-sm">{t('Créez et gérez les campagnes de fournitures', 'Créez et gérez les campagnes de fournitures')}</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          {t('Nouvelle campagne', 'Nouvelle campagne')}
        </button>
      </div>
        {/* Contrôles liste campagnes (plein écran) */}
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="border rounded-lg px-3 py-2"
              placeholder={t('Rechercher par nom', 'Rechercher par nom')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
            />
            <select className="border rounded-lg px-3 py-2" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setOffset(0); }}>
              <option value="">{t('Tous statuts', 'Tous statuts')}</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="validated">Validated</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
            <input
              className="border rounded-lg px-3 py-2"
              placeholder={t('Établissement ID', 'Établissement ID')}
              value={establishmentId}
              onChange={(e) => { setEstablishmentId(e.target.value); setOffset(0); }}
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder={t('Année scolaire', 'Année scolaire')}
              value={schoolYear}
              onChange={(e) => { setSchoolYear(e.target.value); setOffset(0); }}
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder={t('Classe ID', 'Classe ID')}
              value={classId}
              onChange={(e) => { setClassId(e.target.value); setOffset(0); }}
            />
            <div className="flex items-center gap-2">
              <select className="border rounded-lg px-3 py-2" value={limit} onChange={(e) => { setLimit(parseInt(e.target.value || '10')); setOffset(0); }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <div className="text-sm text-gray-500">{t('par page', 'par page')}</div>
            </div>
          </div>
        </div>

        {/* Liste campagnes en lignes */}
        <div className="divide-y">
          {(listData ?? []).map((c) => {
              const statusUpper = (c.status || '').toUpperCase();
              const statusLower = (c.status || '').toLowerCase();
              const isDraft = statusUpper === 'DRAFT' || statusLower === 'draft';
              const isOpen = statusUpper === 'OPEN' || statusLower === 'open';
              const isInValidation = statusUpper === 'IN_VALIDATION' || statusLower === 'in_validation' || statusLower === 'validated';
              const isPublished = statusUpper === 'PUBLISHED' || statusLower === 'published';
              const isClosed = statusUpper === 'CLOSED' || statusLower === 'closed';

              // Workflow
              // DRAFT -> OPEN (open enabled)
              // CLOSED -> OPEN (reopen enabled)
              const canOpen = (isDraft || isClosed) && !open.isPending;
              // OPEN -> IN_VALIDATION (validate enabled only when OPEN)
              const canValidate = isOpen && !validate.isPending;
              // IN_VALIDATION -> PUBLISHED (publish enabled only when IN_VALIDATION)
              const canPublish = isInValidation && !publish.isPending;
              // CLOSE enabled when OPEN or IN_VALIDATION or PUBLISHED
              const canClose = (isOpen || isInValidation || isPublished) && !close.isPending;
              return (
                <div key={c.id} className="py-3 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 truncate">{c.name}</div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(c.status || '')}`}>{c.status}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-3">
                      <span>{t('ID', 'ID')}: <span className="font-mono">{c.id}</span></span>
                      <span>{t('Créée le', 'Créée le')}: {c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'}</span>
                      <span>{t('Maj', 'Maj')}: {c.updated_at ? new Date(c.updated_at).toLocaleDateString() : '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 ${
                        canOpen
                          ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                      onClick={() => handleAction(() => open.mutateAsync(c.id), t('Campagne ouverte', 'Campagne ouverte'), c.id)}
                      disabled={!canOpen}
                    >
                      <Eye className="h-4 w-4" /> {t('Ouvrir', 'Ouvrir')}
                    </button>
                    <button
                      className={`rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 ${
                        canValidate
                          ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                      onClick={() => handleAction(() => validate.mutateAsync(c.id), t('Campagne validée', 'Campagne validée'), c.id)}
                      disabled={!canValidate}
                    >
                      <CheckCircle className="h-4 w-4" /> {t('Valider', 'Valider')}
                    </button>
                    <button
                      className={`rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 ${
                        canPublish
                          ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                      onClick={() => handleAction(() => publish.mutateAsync(c.id), t('Campagne publiée', 'Campagne publiée'), c.id)}
                      disabled={!canPublish}
                    >
                      <Send className="h-4 w-4" /> {t('Publier', 'Publier')}
                    </button>
                    <button
                      className={`rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 ${
                        canClose
                          ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                      onClick={() => handleAction(() => close.mutateAsync(c.id), t('Campagne clôturée', 'Campagne clôturée'), c.id)}
                      disabled={!canClose}
                    >
                      <X className="h-4 w-4" /> {t('Clore', 'Clore')}
                    </button>
                    <button
                      className={`rounded-lg px-3 py-2 text-sm border ${selectedCampaignId === c.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'}`}
                      onClick={() => { setSelectedCampaignId(c.id); setIsViewOpen(true); }}
                    >
                      {t('Voir', 'Voir')}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex items-center justify-between mt-4">
            <button
              className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
            >
              {t('Précédent', 'Précédent')}
            </button>
            <div className="text-sm text-gray-600">{t('Page', 'Page')} {Math.floor(offset / limit) + 1}</div>
            <button
              className="px-3 py-2 rounded bg-gray-100"
              onClick={() => setOffset(offset + limit)}
            >
              {t('Suivant', 'Suivant')}
            </button>
        </div>
        {/* Modal création campagne */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => !create.isPending && setIsCreateOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{t('Créer une nouvelle campagne', 'Créer une nouvelle campagne')}</h2>
                </div>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => !create.isPending && setIsCreateOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('Nom de la campagne', 'Nom de la campagne')}</label>
                  <input
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder={t('Ex: Campagne CP2 2026', 'Ex: Campagne CP2 2026')}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">{t('Année scolaire', 'Année scolaire')}</label>
                    <input
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder={t('Ex: 2025-2026', 'Ex: 2025-2026')}
                      value={newSchoolYear}
                      onChange={(e) => setNewSchoolYear(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
                    disabled={create.isPending}
                    onClick={() => setIsCreateOpen(false)}
                  >
                    {t('Annuler', 'Annuler')}
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={!newName.trim() || !newSchoolYear.trim() || create.isPending}
                    onClick={async () => {
                      try {
                        const etabId = localStorage.getItem('current-etab-id') || '';
                        if (!etabId) {
                          toast.error(t("Aucun établissement courant (current-etab-id)", 'Aucun établissement courant'));
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
                    <Plus className="h-4 w-4" />
                    {create.isPending ? t('Création...', 'Création...') : t('Créer', 'Créer')}
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
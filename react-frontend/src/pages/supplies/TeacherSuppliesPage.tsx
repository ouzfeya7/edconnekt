import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSuppliesTeacherList } from '../../hooks/useSuppliesTeacherList';
import { useSubmitTeacherList, useUpsertTeacherList } from '../../hooks/useSuppliesTeacherListMutations';
import type { TeacherListItemPayload, TeacherListResponseItem } from '../../api/supplies-service/api';
import { useFilters } from '../../contexts/FilterContext';
import { Toaster, toast } from 'react-hot-toast';
import { PlusCircle, Trash2, Send, Package, Search } from 'lucide-react';
import { getActiveContext } from '../../utils/contextStorage';
import { useClasses } from '../../hooks/useClasses';
import { Combobox } from '../../components/ui/Combobox';

const TeacherSuppliesPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentClasse } = useFilters();

  const [campaignId, setCampaignId] = useState<string>('');
  const [classId, setClassId] = useState<string>(currentClasse || '');

  const { data, isLoading, isError } = useSuppliesTeacherList(
    campaignId || undefined,
    classId || undefined,
  );

  const upsert = useUpsertTeacherList(campaignId || undefined, classId || undefined);
  const submit = useSubmitTeacherList(campaignId || undefined, classId || undefined);

  const items: TeacherListResponseItem[] = useMemo(() => data?.items ?? [], [data]);

  const [draft, setDraft] = useState<TeacherListItemPayload>({ label: '', quantity: 1 });

  const canQuery = Boolean(campaignId && classId);

  // Chargement des classes pour une sélection moderne
  const { etabId } = getActiveContext();
  const { data: classesResp } = useClasses({ etablissementId: etabId || '', limit: 100 });
  const classOptions = (classesResp?.data ?? []).map(c => ({ value: c.id, label: `${c.nom} (${c.niveau})` }));

  // Auto-affectation de la classe lorsque l'ID de campagne est saisi
  useEffect(() => {
    if (campaignId && !classId) {
      if (currentClasse) {
        setClassId(currentClasse);
      } else if ((classesResp?.data?.length ?? 0) === 1) {
        setClassId(classesResp!.data![0]!.id);
      }
    }
  }, [campaignId, classId, currentClasse, classesResp]);

  const handleAdd = async () => {
    if (!draft.label.trim()) {
      toast.error('Libellé requis');
      return;
    }
    const next: TeacherListItemPayload[] = [
      ...items.map((i) => ({ label: i.label, quantity: i.quantity, unit: i.unit ?? undefined, notes: i.notes ?? undefined })),
      { label: draft.label.trim(), quantity: draft.quantity ?? 1, unit: draft.unit ?? undefined, notes: draft.notes ?? undefined },
    ];
    try {
      await upsert.mutateAsync(next);
      setDraft({ label: '', quantity: 1 });
      toast.success('Liste enregistrée');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleRemove = async (id: string) => {
    const next = items
      .filter((i) => i.id !== id)
      .map((i) => ({ label: i.label, quantity: i.quantity, unit: i.unit ?? undefined, notes: i.notes ?? undefined }));
    try {
      await upsert.mutateAsync(next);
      toast.success('Élément supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async () => {
    try {
      await submit.mutateAsync();
      toast.success('Liste soumise');
    } catch {
      toast.error('Erreur lors de la soumission');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Toaster position="top-right" />
      
      {/* En-tête moderne */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('Fournitures - Enseignant', 'Liste des Fournitures')}</h1>
              <p className="text-gray-600">{t('Gérez la liste des fournitures de votre classe', 'Gérez la liste des fournitures de votre classe')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Formulaire de recherche moderne */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">{t('Configuration', 'Configuration')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('Campaign ID', 'ID Campagne')}</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('Saisir l\'ID de la campagne', 'Saisir l\'ID de la campagne')}
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('Classe', 'Classe')}</label>
              <Combobox
                options={classOptions}
                value={classId || undefined}
                onChange={(val) => setClassId(val)}
                placeholder={t('Sélectionner une classe…', 'Sélectionner une classe…')}
                searchPlaceholder={t('Rechercher une classe…', 'Rechercher une classe…')}
                noResultsMessage={t('Aucun résultat', 'Aucun résultat')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">&nbsp;</label>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!canQuery}
                onClick={() => undefined}
              >
                <Search className="h-4 w-4" />
                {t('Charger', 'Charger')}
              </button>
            </div>
          </div>
        </div>

        {/* Messages d'état */}
        {!canQuery && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span>{t('Veuillez saisir la campagne et la classe pour commencer.', 'Veuillez saisir la campagne et la classe pour commencer.')}</span>
            </div>
          </div>
        )}

        {canQuery && isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>{t('Chargement...', 'Chargement...')}</span>
            </div>
          </div>
        )}

        {canQuery && isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <span>{t('Erreur de chargement', 'Erreur de chargement')}</span>
          </div>
        )}

        {canQuery && !isLoading && !isError && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire d'ajout */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <PlusCircle className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">{t('Ajouter un élément', 'Ajouter un élément')}</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('Libellé', 'Libellé')} *</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('Ex: Cahier de texte', 'Ex: Cahier de texte')}
                    value={draft.label}
                    onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('Quantité', 'Quantité')}</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      type="number"
                      min={1}
                      placeholder="1"
                      value={draft.quantity ?? 1}
                      onChange={(e) => setDraft((d) => ({ ...d, quantity: Number(e.target.value) || 1 }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('Unité', 'Unité')}</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('Ex: pièce, paquet', 'Ex: pièce, paquet')}
                      value={draft.unit ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, unit: e.target.value || undefined }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('Notes', 'Notes')}</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={2}
                    placeholder={t('Informations complémentaires...', 'Informations complémentaires...')}
                    value={draft.notes ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value || undefined }))}
                  />
                </div>

                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={upsert.isPending || !draft.label.trim()}
                  onClick={handleAdd}
                >
                  <PlusCircle className="h-4 w-4" />
                  {upsert.isPending ? t('Ajout...', 'Ajout...') : t('Ajouter à la liste', 'Ajouter à la liste')}
                </button>
              </div>
            </div>

            {/* Liste des éléments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{t('Ma liste', 'Ma liste')}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {items.length} {t('éléments', 'éléments')}
                  </span>
                </div>
                
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={submit.isPending || items.length === 0}
                  onClick={handleSubmit}
                >
                  <Send className="h-4 w-4" />
                  {submit.isPending ? t('Envoi...', 'Envoi...') : t('Soumettre', 'Soumettre')}
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">{t('Aucun élément dans la liste', 'Aucun élément dans la liste')}</p>
                  <p className="text-sm text-gray-400">{t('Ajoutez des fournitures avec le formulaire ci-contre', 'Ajoutez des fournitures avec le formulaire ci-contre')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((it) => (
                    <div key={it.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{it.label}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium">{it.quantity}</span>
                              {it.unit && <span className="text-gray-500">{it.unit}</span>}
                            </span>
                          </div>
                          {it.notes && (
                            <div className="text-sm text-gray-500 mt-2 bg-white rounded px-2 py-1">
                              {it.notes}
                            </div>
                          )}
                        </div>
                        
                        <button
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg"
                          onClick={() => handleRemove(it.id)}
                          title={t('Supprimer', 'Supprimer')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSuppliesPage;



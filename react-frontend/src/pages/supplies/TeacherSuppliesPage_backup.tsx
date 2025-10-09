import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSuppliesTeacherList } from '../../hooks/useSuppliesTeacherList';
import { useSubmitTeacherList, useUpsertTeacherList } from '../../hooks/useSuppliesTeacherListMutations';
import { useSuppliesCampaignList } from '../../hooks/useSuppliesCampaigns';
import type { TeacherListItemPayload, TeacherListResponseItem } from '../../api/supplies-service/api';
import { useFilters } from '../../contexts/FilterContext';
import { Toaster, toast } from 'react-hot-toast';
import { PlusCircle, Trash2, Send, Package, Calendar, CheckCircle, ArrowRight, Users, ChevronLeft, BookOpen } from 'lucide-react';

const TeacherSuppliesPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentClasse } = useFilters();

  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [classId, setClassId] = useState<string>(currentClasse || '');
  const [step, setStep] = useState<'campaigns' | 'class' | 'list'>('campaigns');

  // Récupération des campagnes ouvertes
  const { data: campaignsData } = useSuppliesCampaignList({
    status: 'open',
    limit: 50,
    offset: 0
  });

  const openCampaigns = campaignsData || [];

  const { data, isLoading, isError } = useSuppliesTeacherList(
    selectedCampaign?.id || undefined,
    classId || undefined,
  );

  const upsert = useUpsertTeacherList(selectedCampaign?.id || undefined, classId || undefined);
  const submit = useSubmitTeacherList(selectedCampaign?.id || undefined, classId || undefined);

  const items: TeacherListResponseItem[] = useMemo(() => data?.items ?? [], [data]);

  const [draft, setDraft] = useState<TeacherListItemPayload>({ label: '', quantity: 1 });

  // Gestion des étapes
  const handleCampaignSelect = (campaign: any) => {
    setSelectedCampaign(campaign);
    setStep('class');
  };

  const handleClassConfirm = () => {
    if (classId.trim()) {
      setStep('list');
    } else {
      toast.error(t('Veuillez saisir votre classe', 'Veuillez saisir votre classe'));
    }
  };

  const goBackToCampaigns = () => {
    setSelectedCampaign(null);
    setStep('campaigns');
  };

  const goBackToClass = () => {
    setStep('class');
  };

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

  // Rendu conditionnel selon l'étape
  const renderCampaignSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('Choisissez une campagne', 'Choisissez une campagne')}</h2>
        <p className="text-gray-600">{t('Sélectionnez la campagne de fournitures pour votre classe', 'Sélectionnez la campagne de fournitures pour votre classe')}</p>
      </div>

      {openCampaigns.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('Aucune campagne ouverte', 'Aucune campagne ouverte')}</h3>
          <p className="text-gray-500">{t('Il n\'y a actuellement aucune campagne de fournitures ouverte.', 'Il n\'y a actuellement aucune campagne de fournitures ouverte.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => handleCampaignSelect(campaign)}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {t('Ouverte', 'Ouverte')}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{campaign.name}</h3>
              {campaign.school_year && (
                <p className="text-sm text-gray-600 mb-4">
                  <BookOpen className="inline h-4 w-4 mr-1" />
                  {campaign.school_year}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {t('Créée le', 'Créée le')} {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : '-'}
                </span>
                <ArrowRight className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderClassSelection = () => (
    <div className="max-w-md mx-auto space-y-6">
      <button
        onClick={goBackToCampaigns}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('Retour aux campagnes', 'Retour aux campagnes')}
      </button>

      <div className="text-center">
        <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('Votre classe', 'Votre classe')}</h2>
        <p className="text-gray-600 mb-6">{t('Indiquez le nom de votre classe pour cette campagne', 'Indiquez le nom de votre classe pour cette campagne')}</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-900">{selectedCampaign?.name}</span>
        </div>
        {selectedCampaign?.school_year && (
          <p className="text-sm text-blue-700">{selectedCampaign.school_year}</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('Nom de votre classe', 'Nom de votre classe')} *
          </label>
          <input
            type="text"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            placeholder={t('Ex: CP1, CE2A, 6ème B...', 'Ex: CP1, CE2A, 6ème B...')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <button
          onClick={handleClassConfirm}
          disabled={!classId.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 font-medium transition-colors flex items-center justify-center gap-2"
        >
          {t('Continuer', 'Continuer')}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

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
              <h1 className="text-2xl font-bold text-gray-900">{t('Mes Fournitures', 'Mes Fournitures')}</h1>
              <p className="text-gray-600">{t('Gérez la liste des fournitures de votre classe', 'Gérez la liste des fournitures de votre classe')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {step === 'campaigns' && renderCampaignSelection()}
        {step === 'class' && renderClassSelection()}
        {step === 'list' && (
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button onClick={goBackToCampaigns} className="text-blue-600 hover:text-blue-700">
                {t('Campagnes', 'Campagnes')}
              </button>
              <span className="text-gray-400">/</span>
              <button onClick={goBackToClass} className="text-blue-600 hover:text-blue-700">
                {t('Classe', 'Classe')}
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{t('Ma liste', 'Ma liste')}</span>
            </div>

            {/* Info campagne et classe */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedCampaign?.name}</h3>
                  <p className="text-sm text-gray-600">{t('Classe', 'Classe')}: {classId}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {t('Active', 'Active')}
                </span>
              </div>
            </div>

            {/* Gestion de la liste */}
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('Chargement de votre liste...', 'Chargement de votre liste...')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulaire d'ajout */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PlusCircle className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">{t('Ajouter un article', 'Ajouter un article')}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Article', 'Article')} *
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder={t('Ex: Cahier 96 pages, Trousse...', 'Ex: Cahier 96 pages, Trousse...')}
                        value={draft.label}
                        onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('Quantité', 'Quantité')}
                        </label>
                        <input
                          type="number"
                          min={1}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          value={draft.quantity ?? 1}
                          onChange={(e) => setDraft((d) => ({ ...d, quantity: Number(e.target.value) || 1 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('Unité', 'Unité')}
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder={t('pièce, paquet...', 'pièce, paquet...')}
                          value={draft.unit ?? ''}
                          onChange={(e) => setDraft((d) => ({ ...d, unit: e.target.value || undefined }))}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAdd}
                      disabled={upsert.isPending || !draft.label.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      {upsert.isPending ? t('Ajout...', 'Ajout...') : t('Ajouter', 'Ajouter')}
                    </button>
                  </div>
                </div>

                {/* Liste des articles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900">{t('Ma liste', 'Ma liste')}</h2>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={submit.isPending || items.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 font-medium transition-colors flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {submit.isPending ? t('Envoi...', 'Envoi...') : t('Soumettre', 'Soumettre')}
                    </button>
                  </div>

                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">{t('Votre liste est vide', 'Votre liste est vide')}</p>
                      <p className="text-sm text-gray-400">{t('Ajoutez des articles avec le formulaire', 'Ajoutez des articles avec le formulaire')}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">{item.quantity}</span>
                                {item.unit && <span className="text-gray-500 ml-1">{item.unit}</span>}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
        )}
      </div>
    </div>
  );
};

export default TeacherSuppliesPage;
                  <label className="text-sm font-medium text-gray-700">{t('Libellé', 'Libellé')} *</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder={t('Ex: Cahier de texte', 'Ex: Cahier de texte')}
                    value={draft.label}
                    onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('Quantité', 'Quantité')}</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder={t('Ex: pièce, paquet', 'Ex: pièce, paquet')}
                      value={draft.unit ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, unit: e.target.value || undefined }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('Notes', 'Notes')}</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    rows={2}
                    placeholder={t('Informations complémentaires...', 'Informations complémentaires...')}
                    value={draft.notes ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value || undefined }))}
                  />
                </div>

                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                    <div key={it.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
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
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
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



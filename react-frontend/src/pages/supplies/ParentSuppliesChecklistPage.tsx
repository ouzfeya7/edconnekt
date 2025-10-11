import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParentChecklist, useParentChecklistProgress, useToggleChecklistItem } from '../../hooks/useSuppliesParentChecklist';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle2, Circle, Package, User, Search, ShoppingCart } from 'lucide-react';
import { getActiveContext } from '../../utils/contextStorage';
import { useClasses } from '../../hooks/useClasses';
import { Combobox } from '../../components/ui/Combobox';

const ParentSuppliesChecklistPage: React.FC = () => {
  const { t } = useTranslation();
  const [campaignId, setCampaignId] = useState<string>('');
  const [childId, setChildId] = useState<string>('');
  const [classId, setClassId] = useState<string>('');

  const { data, isLoading, isError } = useParentChecklist(
    campaignId || undefined,
    childId || undefined,
    classId || undefined,
  );
  const { data: progressData } = useParentChecklistProgress(
    campaignId || undefined,
    childId || undefined,
    classId || undefined,
  );
  const toggle = useToggleChecklistItem(campaignId || undefined, childId || undefined, classId || undefined);

  const canQuery = Boolean(campaignId && childId && classId);

  // Options de classe pour une meilleure UX
  const { etabId } = getActiveContext();
  const { data: classesResp } = useClasses({ etablissementId: etabId || '', limit: 100 });
  const classOptions = (classesResp?.data ?? []).map(c => ({ value: c.id, label: `${c.nom} (${c.niveau})` }));

  // Auto-affectation de la classe lorsque l'ID de campagne est saisi
  useEffect(() => {
    if (campaignId && childId && !classId) {
      if ((classesResp?.data?.length ?? 0) === 1) {
        setClassId(classesResp!.data![0]!.id);
      }
    }
  }, [campaignId, childId, classId, classesResp]);

  const checkedCount = data?.items.filter((item: { is_checked: boolean }) => item.is_checked).length || 0;
  const totalCount = data?.items.length || 0;
  const clientProgress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const progressPercentage = typeof progressData?.progress === 'number' ? Math.round(progressData.progress) : clientProgress;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Toaster position="top-right" />
      
      {/* En-tête moderne */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('Fournitures - Parent', 'Liste de Fournitures')}</h1>
              <p className="text-gray-600">{t('Suivez les achats des fournitures scolaires', 'Suivez les achats des fournitures scolaires')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Formulaire de recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">{t('Configuration', 'Configuration')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('Campaign ID', 'ID Campagne')}</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                placeholder={t('Saisir l\'ID de la campagne', 'Saisir l\'ID de la campagne')} 
                value={campaignId} 
                onChange={(e) => setCampaignId(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('Child ID', 'ID Enfant')}</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                placeholder={t('Saisir l\'ID de l\'enfant', 'Saisir l\'ID de l\'enfant')} 
                value={childId} 
                onChange={(e) => setChildId(e.target.value)} 
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
          </div>
        </div>

        {/* Messages d'état */}
        {!canQuery && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{t('Veuillez saisir la campagne, l\'enfant et la classe pour continuer.', 'Veuillez saisir la campagne, l\'enfant et la classe pour continuer.')}</span>
            </div>
          </div>
        )}

        {canQuery && isLoading && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-purple-800">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <span>{t('Chargement de la liste...', 'Chargement de la liste...')}</span>
            </div>
          </div>
        )}

        {canQuery && isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <span>{t('Erreur de chargement', 'Erreur de chargement')}</span>
          </div>
        )}

        {canQuery && data && (
          <div className="space-y-6">
            {/* Barre de progression */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{t('Progression des achats', 'Progression des achats')}</h2>
                </div>
                <div className="text-2xl font-bold text-purple-600">{progressPercentage}%</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{checkedCount} {t('achetés', 'achetés')}</span>
                <span>{totalCount - checkedCount} {t('restants', 'restants')}</span>
              </div>
            </div>

            {/* Liste des fournitures */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">{t('Liste des fournitures', 'Liste des fournitures')}</h2>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {totalCount} {t('articles', 'articles')}
                </span>
              </div>

              {data.items.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-500 mb-2">{t('Aucune fourniture', 'Aucune fourniture')}</p>
                  <p className="text-gray-400">{t('Aucune fourniture trouvée pour cette configuration', 'Aucune fourniture trouvée pour cette configuration')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.items.map((it: { id: string; label: string; quantity: number; is_checked: boolean }) => (
                    <div 
                      key={it.id} 
                      className={`border rounded-lg p-4 transition-all duration-200 ${
                        it.is_checked 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className={`font-medium ${it.is_checked ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                            {it.label}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium">{t('Quantité', 'Quantité')}:</span>
                              <span>{it.quantity}</span>
                            </span>
                          </div>
                        </div>
                        
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                            it.is_checked
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                          onClick={async () => {
                            try {
                              await toggle.mutateAsync({ itemId: it.id, body: { is_checked: !it.is_checked } });
                              toast.success(
                                it.is_checked 
                                  ? t('Article marqué comme non acheté', 'Article marqué comme non acheté')
                                  : t('Article marqué comme acheté', 'Article marqué comme acheté')
                              );
                            } catch {
                              toast.error(t('Erreur lors de la mise à jour', 'Erreur lors de la mise à jour'));
                            }
                          }}
                        >
                          {it.is_checked ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="font-medium">{t('Acheté', 'Acheté')}</span>
                            </>
                          ) : (
                            <>
                              <Circle className="h-4 w-4" />
                              <span className="font-medium">{t('À acheter', 'À acheter')}</span>
                            </>
                          )}
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

export default ParentSuppliesChecklistPage;



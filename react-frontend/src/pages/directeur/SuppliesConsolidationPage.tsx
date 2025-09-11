import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsolidationApply, useConsolidationDiff } from '../../hooks/useSuppliesConsolidation';
import type { ConsolidationDecision } from '../../api/supplies-service/api';
import { Toaster, toast } from 'react-hot-toast';
import { 
  GitMerge, 
  Search, 
  FileCode, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  Download
} from 'lucide-react';

const SuppliesConsolidationPage: React.FC = () => {
  const { t } = useTranslation();
  const [campaignId, setCampaignId] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const [decisionsText, setDecisionsText] = useState<string>('');

  const { data, isLoading, isError } = useConsolidationDiff(campaignId || undefined, classId || undefined);
  const apply = useConsolidationApply(campaignId || undefined, classId || undefined);

  const parsedDecisions: ConsolidationDecision[] | null = useMemo(() => {
    if (!decisionsText.trim()) return null;
    try {
      const parsed = JSON.parse(decisionsText) as unknown;
      if (Array.isArray(parsed)) {
        return parsed as ConsolidationDecision[];
      }
    } catch {
      return null;
    }
    return null;
  }, [decisionsText]);

  const canLoadDiff = Boolean(campaignId && classId);
  const isValidJson = parsedDecisions !== null && decisionsText.trim() !== '';

  const handleCopyDiff = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.success(t('Diff copiée dans le presse-papiers', 'Diff copiée dans le presse-papiers'));
    }
  };

  const handleApplyDecisions = async () => {
    if (!parsedDecisions) return;
    
    try {
      await apply.mutateAsync(parsedDecisions);
      toast.success(t('Décisions appliquées avec succès', 'Décisions appliquées avec succès'));
    } catch {
      toast.error(t('Erreur lors de l\'application', 'Erreur lors de l\'application'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      <Toaster position="top-right" />
      
      {/* En-tête moderne */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <GitMerge className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('Consolidation fournitures', 'Consolidation des Fournitures')}</h1>
              <p className="text-gray-600">{t('Analysez et appliquez les décisions de consolidation', 'Analysez et appliquez les décisions de consolidation')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Section de configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">{t('Configuration', 'Configuration')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('ID Campagne', 'ID Campagne')}</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200" 
                placeholder={t('Saisir l\'ID de la campagne', 'Saisir l\'ID de la campagne')} 
                value={campaignId} 
                onChange={(e) => setCampaignId(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('ID Classe', 'ID Classe')}</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200" 
                placeholder={t('Saisir l\'ID de la classe', 'Saisir l\'ID de la classe')} 
                value={classId} 
                onChange={(e) => setClassId(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">&nbsp;</label>
              <button 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={!canLoadDiff}
                onClick={() => undefined}
              >
                <Search className="h-4 w-4" />
                {t('Charger diff', 'Charger diff')}
              </button>
            </div>
          </div>
        </div>

        {/* Messages d'état */}
        {isLoading && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-teal-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
              <span>{t('Chargement des différences...', 'Chargement des différences...')}</span>
            </div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>{t('Erreur de chargement', 'Erreur de chargement')}</span>
            </div>
          </div>
        )}

        {/* Affichage du diff */}
        {data && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">{t('Diff de consolidation', 'Diff de consolidation')}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyDiff}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors duration-200"
                >
                  <Copy className="h-4 w-4" />
                  {t('Copier', 'Copier')}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `consolidation-diff-${campaignId}-${classId}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  {t('Télécharger', 'Télécharger')}
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg border">
              <pre className="text-sm p-4 overflow-auto max-h-96 text-gray-800 font-mono">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Section des décisions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">{t('Décisions de consolidation', 'Décisions de consolidation')}</h2>
            {isValidJson && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{t('JSON valide', 'JSON valide')}</span>
              </div>
            )}
            {decisionsText.trim() && !isValidJson && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">{t('JSON invalide', 'JSON invalide')}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {t('Données JSON des décisions', 'Données JSON des décisions')}
              </label>
              <textarea
                className={`w-full border rounded-lg p-4 h-48 font-mono text-sm transition-all duration-200 ${
                  decisionsText.trim() && !isValidJson
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-emerald-500 focus:border-transparent'
                }`}
                placeholder={t(
                  '[\n  {\n    "label_normalized": "cahier",\n    "quantity": 2,\n    "unit": "A4"\n  }\n]',
                  '[\n  {\n    "label_normalized": "cahier",\n    "quantity": 2,\n    "unit": "A4"\n  }\n]'
                )}
                value={decisionsText}
                onChange={(e) => setDecisionsText(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">{t('Format attendu', 'Format attendu')}</h3>
              <p className="text-sm text-blue-700 mb-2">
                {t('Un tableau d\'objets avec les propriétés suivantes :', 'Un tableau d\'objets avec les propriétés suivantes :')}
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <code className="bg-blue-100 px-1 rounded">label_normalized</code>: {t('Nom normalisé de l\'article', 'Nom normalisé de l\'article')}</li>
                <li>• <code className="bg-blue-100 px-1 rounded">quantity</code>: {t('Quantité requise', 'Quantité requise')}</li>
                <li>• <code className="bg-blue-100 px-1 rounded">unit</code>: {t('Unité (optionnel)', 'Unité (optionnel)')}</li>
              </ul>
            </div>

            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={!isValidJson || apply.isPending || !canLoadDiff}
              onClick={handleApplyDecisions}
            >
              <CheckCircle className="h-4 w-4" />
              {apply.isPending 
                ? t('Application en cours...', 'Application en cours...') 
                : t('Appliquer les décisions', 'Appliquer les décisions')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliesConsolidationPage;



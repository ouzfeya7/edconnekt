import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsolidationApply, useConsolidationDiff } from '../../hooks/useSuppliesConsolidation';
import type { ConsolidationDecision } from '../../api/supplies-service/api';
import { Toaster, toast } from 'react-hot-toast';
import { 
  GitMerge, 
  Search, 
  FileCode, 
  AlertTriangle,
  Copy,
  Download
} from 'lucide-react';

const SuppliesConsolidationPage: React.FC = () => {
  const { t } = useTranslation();
  const [campaignId, setCampaignId] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  // JSON editor removed; UI is form-based

  const { data, isLoading, isError, refetch } = useConsolidationDiff(campaignId || undefined, classId || undefined);
  const apply = useConsolidationApply(campaignId || undefined, classId || undefined);

  const canLoadDiff = Boolean(campaignId && classId);

  // Extraire des propositions à partir du diff brut
  type Candidate = { label_normalized: string; quantity: number; unit?: string | null };
  const extractCandidatesFromDiff = React.useCallback((node: unknown, acc: Candidate[]) => {
    if (!node) return acc;
    if (Array.isArray(node)) {
      node.forEach((it) => extractCandidatesFromDiff(it, acc));
      return acc;
    }
    if (typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      const ln = obj['label_normalized'];
      const q = obj['quantity'];
      if (typeof ln === 'string' && typeof q === 'number') {
        const unit = (typeof obj['unit'] === 'string' || obj['unit'] === null) ? (obj['unit'] as string | null | undefined) : undefined;
        acc.push({ label_normalized: ln, quantity: q, unit });
      }
      Object.values(obj).forEach((v) => extractCandidatesFromDiff(v, acc));
      return acc;
    }
    return acc;
  }, []);

  const candidates = useMemo(() => {
    if (!data) return [] as Candidate[];
    const out: Candidate[] = [];
    extractCandidatesFromDiff(data, out);
    return out;
  }, [data, extractCandidatesFromDiff]);

  const groupedSuggestions = useMemo(() => {
    const map = new Map<string, { label: string; total: number; count: number; unit?: string | null }>();
    for (const c of candidates) {
      const key = c.label_normalized;
      const prev = map.get(key);
      if (prev) {
        map.set(key, { label: key, total: prev.total + (c.quantity || 0), count: prev.count + 1, unit: prev.unit ?? c.unit });
      } else {
        map.set(key, { label: key, total: c.quantity || 0, count: 1, unit: c.unit });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [candidates]);

  // Éditeur de décisions sans JSON
  const [decisions, setDecisions] = useState<ConsolidationDecision[]>([]);
  const addDecision = (d?: Partial<ConsolidationDecision>) => {
    setDecisions((prev) => [...prev, { label_normalized: d?.label_normalized || '', quantity: d?.quantity ?? 1, unit: d?.unit ?? null }]);
  };
  const updateDecision = (idx: number, patch: Partial<ConsolidationDecision>) => {
    setDecisions((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const removeDecision = (idx: number) => {
    setDecisions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCopyDiff = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.success(t('Diff copiée dans le presse-papiers', 'Diff copiée dans le presse-papiers'));
    }
  };

  const handleApplyDecisions = async () => {
    if (!decisions.length) {
      toast.error(t('Ajoutez au moins une décision', 'Ajoutez au moins une décision'));
      return;
    }
    try {
      await apply.mutateAsync(decisions);
      toast.success(t('Décisions appliquées avec succès', 'Décisions appliquées avec succès'));
      setDecisions([]);
    } catch {
      toast.error(t('Erreur lors de l\'application', 'Erreur lors de l\'application'));
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      
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
                onClick={() => { if (canLoadDiff) refetch(); }}
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t('Propositions de consolidation', 'Propositions de consolidation')}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyDiff}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors duration-200"
              >
                <Copy className="h-4 w-4" />
                {t('Copier le diff brut', 'Copier le diff brut')}
              </button>
              {data && (
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
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors durée-200"
                >
                  <Download className="h-4 w-4" />
                  {t('Télécharger diff', 'Télécharger diff')}
                </button>
              )}
            </div>
          </div>
          {groupedSuggestions.length === 0 ? (
            <div className="text-gray-600 text-sm">{t('Aucune proposition détectée. Ajoutez vos décisions manuellement ci-dessous.', 'Aucune proposition détectée. Ajoutez vos décisions manuellement ci-dessous.')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 border-b">{t('Article (normalisé)', 'Article (normalisé)')}</th>
                    <th className="text-right p-2 border-b">{t('Quantité suggérée', 'Quantité suggérée')}</th>
                    <th className="text-center p-2 border-b">{t('Sources', 'Sources')}</th>
                    <th className="text-right p-2 border-b">{t('Action', 'Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedSuggestions.map((s) => (
                    <tr key={s.label} className="border-b">
                      <td className="p-2">{s.label}</td>
                      <td className="p-2 text-right">{s.total}</td>
                      <td className="p-2 text-center">{s.count}</td>
                      <td className="p-2 text-right">
                        <button
                          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                          onClick={() => addDecision({ label_normalized: s.label, quantity: s.total, unit: s.unit ?? null })}
                        >
                          {t('Ajouter à la liste', 'Ajouter à la liste')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section des décisions (éditeur) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">{t('Décisions de consolidation', 'Décisions de consolidation')}</h2>
          </div>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 border-b w-1/2">{t('Article (normalisé)', 'Article (normalisé)')}</th>
                    <th className="text-right p-2 border-b w-32">{t('Quantité', 'Quantité')}</th>
                    <th className="text-left p-2 border-b w-40">{t('Unité (optionnelle)', 'Unité (optionnelle)')}</th>
                    <th className="text-right p-2 border-b w-24">{t('Action', 'Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.length === 0 ? (
                    <tr>
                      <td className="p-3 text-gray-500" colSpan={4}>{t('Aucune ligne. Ajoutez à partir des propositions ou manuellement.', 'Aucune ligne. Ajoutez à partir des propositions ou manuellement.')}</td>
                    </tr>
                  ) : (
                    decisions.map((d, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">
                          <input className="w-full border rounded px-2 py-1" value={d.label_normalized} onChange={(e) => updateDecision(idx, { label_normalized: e.target.value })} placeholder={t('ex: cahier 96 pages', 'ex: cahier 96 pages')} />
                        </td>
                        <td className="p-2 text-right">
                          <input className="w-full border rounded px-2 py-1 text-right" type="number" min={0} value={d.quantity} onChange={(e) => updateDecision(idx, { quantity: Number(e.target.value) || 0 })} />
                        </td>
                        <td className="p-2">
                          <input className="w-full border rounded px-2 py-1" value={d.unit ?? ''} onChange={(e) => updateDecision(idx, { unit: e.target.value || null })} placeholder={t('ex: pcs, lots, boites', 'ex: pcs, lots, boites')} />
                        </td>
                        <td className="p-2 text-right">
                          <button className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200" onClick={() => removeDecision(idx)}>
                            {t('Supprimer', 'Supprimer')}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button className="px-3 py-2 rounded border border-gray-200" onClick={() => addDecision()}>+ {t('Ajouter une ligne manuelle', 'Ajouter une ligne manuelle')}</button>
              <button onClick={handleApplyDecisions} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" disabled={apply.isPending || decisions.length === 0 || !canLoadDiff}>
                <GitMerge className="h-4 w-4" />
                {apply.isPending ? t('Application...', 'Application...') : t('Appliquer les décisions', 'Appliquer les décisions')}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SuppliesConsolidationPage;



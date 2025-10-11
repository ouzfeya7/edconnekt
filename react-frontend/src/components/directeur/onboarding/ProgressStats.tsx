import React from 'react';
import { useTranslation } from 'react-i18next';
import { Radio } from 'lucide-react';

interface ProgressData {
  status?: string;
  total_items?: number;
  new_count?: number;
  updated_count?: number;
  skipped_count?: number;
  invalid_count?: number;
}

interface IdentityBatchItemsResult {
  total?: number;
  items?: unknown[];
  pages?: number;
  [key: string]: unknown;
}

interface ProgressStatsProps {
  selectedBatchId: string;
  effectiveProgress: ProgressData | null;
  idItems: IdentityBatchItemsResult | undefined;
  idTotalPending: IdentityBatchItemsResult | undefined;
  idTotalProcessing: IdentityBatchItemsResult | undefined;
  idTotalSuccess: IdentityBatchItemsResult | undefined;
  idTotalError: IdentityBatchItemsResult | undefined;
  idTotalSkipped: IdentityBatchItemsResult | undefined;
  liveSSE: boolean;
  onToggleSSE: () => void;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  selectedBatchId,
  effectiveProgress,
  idItems,
  idTotalPending,
  idTotalProcessing,
  idTotalSuccess,
  idTotalError,
  idTotalSkipped,
  liveSSE,
  onToggleSSE,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Progrès du batch identité */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">
            {t('import_progress', 'Progression de l\'import')}
          </div>
          <button
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              liveSSE 
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 focus:ring-green-500' 
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
            }`}
            onClick={onToggleSSE}
            disabled={!selectedBatchId}
            aria-label={liveSSE 
              ? t('disable_realtime', 'Désactiver le suivi en temps réel') 
              : t('enable_realtime', 'Activer le suivi en temps réel')
            }
            title={liveSSE 
              ? t('disable_realtime_tooltip', 'Désactiver le suivi en temps réel (SSE)') 
              : t('enable_realtime_tooltip', 'Activer le suivi en temps réel (SSE)')
            }
          >
            <Radio className={`w-3.5 h-3.5 ${liveSSE ? 'text-green-600' : 'text-gray-500'}`} aria-hidden="true" />
            {liveSSE ? t('realtime_on', 'Temps réel ON') : t('realtime_off', 'Temps réel OFF')}
          </button>
        </div>
        
        {/* Métriques de progression */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <span>
            <span className="text-gray-500">{t('status', 'Statut')}:</span> {effectiveProgress?.status ?? '—'}
          </span>
          <span>
            <span className="text-gray-500">{t('total', 'Total')}:</span> {idItems?.total ?? effectiveProgress?.total_items ?? '—'}
          </span>
          <span>
            <span className="text-gray-500">NEW:</span> {effectiveProgress?.new_count ?? 0}
          </span>
          <span>
            <span className="text-gray-500">UPDATED:</span> {effectiveProgress?.updated_count ?? 0}
          </span>
          <span>
            <span className="text-gray-500">SKIPPED:</span> {effectiveProgress?.skipped_count ?? 0}
          </span>
          <span>
            <span className="text-gray-500">INVALID:</span> {effectiveProgress?.invalid_count ?? 0}
          </span>
          <span>
            <span className="text-gray-500">PENDING:</span> {idTotalPending?.total ?? 0}
          </span>
          <span>
            <span className="text-gray-500">PROCESSING:</span> {idTotalProcessing?.total ?? 0}
          </span>
          <span>
            <span className="text-gray-500">SUCCESS:</span> {idTotalSuccess?.total ?? 0}
          </span>
          <span>
            <span className="text-gray-500">ERROR:</span> {idTotalError?.total ?? 0}
          </span>
          <span>
            <span className="text-gray-500">{t('skipped_total', 'SKIPPED (total)')}:</span> {idTotalSkipped?.total ?? 0}
          </span>
        </div>
      </div>

      {/* Statistiques avec design amélioré */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">NEW</div>
            <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {effectiveProgress?.new_count ?? 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t('new_users', 'Nouveaux utilisateurs')}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">UPDATED</div>
            <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {effectiveProgress?.updated_count ?? 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t('updates', 'Mises à jour')}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">SKIPPED</div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full" aria-hidden="true"></div>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">
            {effectiveProgress?.skipped_count ?? 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t('skipped', 'Ignorés')}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">INVALID</div>
            <div className="w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></div>
          </div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {effectiveProgress?.invalid_count ?? 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t('errors', 'Erreurs')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProgressStats);

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Clock } from 'lucide-react';

interface IdentityBatchRow {
  id: string;
  establishment_id?: string;
  source_file_url?: string;
  created_at?: string;
}

interface ProvisioningBatchRow {
  id: string;
  source_identity_batch_id?: string;
  created_at?: string;
}

interface BatchTableProps {
  typeFilter: 'identity' | 'provisioning';
  identityBatches: IdentityBatchRow[];
  provisioningBatches: unknown[];
  provBySourceId: Map<string, ProvisioningBatchRow>;
  onSelectIdentityBatch: (id: string) => void;
  onSelectProvisioningBatch: (id: string) => void;
  onCreateAndRunProvisioning: (id: string) => void;
  onRunProvisioning: (id: string) => void;
  scrollToDetails: (ref: React.RefObject<HTMLDivElement>) => void;
  identityDetailsRef: React.RefObject<HTMLDivElement>;
  provisioningDetailsRef: React.RefObject<HTMLDivElement>;
  provCreate: { isPending: boolean };
  provRun: { isPending: boolean };
}

const BatchTable: React.FC<BatchTableProps> = ({
  typeFilter,
  identityBatches,
  provisioningBatches,
  provBySourceId,
  onSelectIdentityBatch,
  onSelectProvisioningBatch,
  onCreateAndRunProvisioning,
  onRunProvisioning,
  scrollToDetails,
  identityDetailsRef,
  provisioningDetailsRef,
  provCreate,
  provRun,
}) => {
  const { t } = useTranslation();

  const batches = typeFilter === 'identity' ? identityBatches : provisioningBatches;

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table 
        className="min-w-full divide-y divide-gray-200"
        role="table"
        aria-label={t('batches_table', 'Tableau des batches d\'onboarding')}
      >
        <thead className="bg-gray-50">
          <tr role="row">
            <th 
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              aria-sort="none"
            >
              {t('batch_id', 'Batch ID')}
            </th>
            <th 
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('type', 'Type')}
            </th>
            <th 
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('establishment', 'Établissement')}
            </th>
            <th 
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('created_at', 'Créé le')}
            </th>
            <th 
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('actions', 'Actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {batches.map((rowUnknown) => {
            if (typeFilter === 'identity') {
              const b = rowUnknown as IdentityBatchRow;
              const linkedProv = provBySourceId.get(b.id);
              return (
                <tr key={`i-${b.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded" 
                      onClick={() => { 
                        onSelectIdentityBatch(b.id);
                        setTimeout(() => scrollToDetails(identityDetailsRef), 100);
                      }}
                      aria-label={t('select_identity_batch', 'Sélectionner le batch d\'identités {{id}}', { id: b.id })}
                      aria-describedby={`batch-${b.id}-info`}
                    >
                      {b.id}
                    </button>
                    <div id={`batch-${b.id}-info`} className="sr-only">
                      {t('batch_info', 'Batch créé le {{date}} pour l\'établissement {{establishment}}', {
                        date: b.created_at ? new Date(b.created_at).toLocaleString() : t('unknown', 'inconnu'),
                        establishment: b.establishment_id || t('unknown', 'inconnu')
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      📊 Identités
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 break-all">{b.establishment_id ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {b.created_at ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(b.created_at).toLocaleString()}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                          linkedProv 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`} 
                        disabled={!!linkedProv || provCreate.isPending || provRun.isPending} 
                        onClick={() => onCreateAndRunProvisioning(b.id)}
                        aria-label={t('create_run_provisioning', 'Créer et lancer le provisioning pour le batch {{id}}', { id: b.id })}
                        aria-describedby={linkedProv ? `provisioning-${b.id}-exists` : undefined}
                      >
                        <Play className="w-3 h-3 mr-1" aria-hidden="true" />
                        {provCreate.isPending || provRun.isPending ? t('in_progress', 'En cours…') : t('create_launch', 'Créer + Lancer')}
                      </button>
                      {linkedProv && (
                        <div id={`provisioning-${b.id}-exists`} className="sr-only">
                          {t('provisioning_already_exists', 'Un batch de provisioning existe déjà pour ce batch d\'identités')}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            } else {
              const b = rowUnknown as ProvisioningBatchRow;
              return (
                <tr key={`p-${b.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded" 
                      onClick={() => { 
                        onSelectProvisioningBatch(b.id);
                        setTimeout(() => scrollToDetails(provisioningDetailsRef), 100);
                      }}
                      aria-label={t('select_provisioning_batch', 'Sélectionner le batch de provisioning {{id}}', { id: b.id })}
                    >
                      {b.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🚀 Provisioning
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 break-all">
                    Source: {b.source_identity_batch_id ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {b.created_at ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(b.created_at).toLocaleString()}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button 
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        provRun.isPending 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`} 
                      disabled={provRun.isPending} 
                      onClick={() => onRunProvisioning(b.id)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {provRun.isPending ? 'Run…' : 'Lancer'}
                    </button>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(BatchTable);

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, RefreshCw, FileText, User, Calendar } from 'lucide-react';
import { useResourceAudit } from '../../hooks/useResourceAudit';

const RessourcesAuditPage: React.FC = () => {
  const { t } = useTranslation();
  const [resourceId, setResourceId] = useState('');
  const { data, isLoading, isError, refetch } = useResourceAudit(resourceId);

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('resources_audit', 'Audit des ressources')}</h1>
        <p className="text-gray-600">{t('resources_audit_description', 'Consultez l\'historique des modifications des ressources.')}</p>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('resource_id', 'ID de ressource')}</label>
          <input
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            placeholder={t('enter_resource_id', 'Saisir un ID de ressource')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => refetch()}
          disabled={!resourceId}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          <Search className="w-4 h-4" /> {t('search', 'Rechercher')}
        </button>
        <button onClick={() => refetch()} className="inline-flex items-center gap-2 px-3 py-2 border rounded-md">
          <RefreshCw className="w-4 h-4" /> {t('refresh', 'Rafraîchir')}
        </button>
      </div>

      {isLoading && <div className="text-gray-500">{t('loading', 'Chargement...')}</div>}
      {isError && <div className="text-red-600">{t('error_loading', 'Erreur de chargement')}</div>}

      {!isLoading && !isError && Array.isArray(data) && (
        data.length === 0 ? (
          <div className="text-gray-500">{t('no_audit_events', 'Aucun évènement d\'audit')}</div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date', 'Date')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('action', 'Action')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actor', 'Auteur')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('details', 'Détails')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {log.action}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {log.actor_id} ({log.actor_role})
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <pre className="bg-gray-50 rounded p-2 overflow-auto max-h-40 text-xs">{JSON.stringify(log.diff, null, 2)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default RessourcesAuditPage;





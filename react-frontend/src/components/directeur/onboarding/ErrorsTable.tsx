import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IdentityErrorItem {
  id?: string;
  type?: string;
  error_type?: string;
  message?: string;
  msg?: string;
  context?: any;
  [key: string]: any;
}

interface ErrorsData {
  errors?: IdentityErrorItem[];
  pages?: number;
  total?: number;
}

interface ErrorsTableProps {
  selectedBatchId: string;
  errorsData: ErrorsData | undefined;
  errorType: string | undefined;
  onErrorTypeChange: (type: string | undefined) => void;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

const ErrorsTable: React.FC<ErrorsTableProps> = ({
  selectedBatchId,
  errorsData,
  errorType,
  onErrorTypeChange,
  page,
  size,
  onPageChange,
  onSizeChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg mt-4">
      <details className="p-4 bg-gray-50" open={false}>
        <summary className="cursor-pointer text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
          {t('view_batch_errors', 'Voir les erreurs du batch')}
        </summary>
        
        {/* Contrôles de filtrage et pagination */}
        <div className="flex items-center gap-3 my-3">
          <label htmlFor="error-type-filter" className="sr-only">
            {t('filter_error_type', 'Filtrer par type d\'erreur')}
          </label>
          <select 
            id="error-type-filter"
            className="px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={errorType ?? ''}
            onChange={(e) => {
              onPageChange(1);
              onErrorTypeChange(e.target.value || undefined);
            }}
            aria-label={t('filter_error_type', 'Filtrer par type d\'erreur')}
          >
            <option value="">{t('all_types', 'Tous types')}</option>
            <option value="VALIDATION">VALIDATION</option>
            <option value="DUPLICATE">DUPLICATE</option>
            <option value="DATABASE">DATABASE</option>
          </select>
          
          <div className="ml-auto flex items-center gap-2 text-xs">
            <button 
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('previous_page', 'Page précédente')}
            >
              <ChevronLeft className="w-3 h-3 mr-1" aria-hidden="true" />
              {t('previous', 'Précédent')}
            </button>
            
            <span className="px-2 py-1">
              {t('page_info', 'Page {{current}}{{total}}', {
                current: page,
                total: errorsData?.pages ? ` / ${errorsData.pages}` : ''
              })}
            </span>
            
            <button 
              disabled={!!errorsData?.pages && page >= (errorsData?.pages || 1)}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('next_page', 'Page suivante')}
            >
              {t('next', 'Suivant')}
              <ChevronRight className="w-3 h-3 ml-1" aria-hidden="true" />
            </button>
            
            <label htmlFor="errors-page-size" className="sr-only">
              {t('page_size', 'Taille de page')}
            </label>
            <select 
              id="errors-page-size"
              className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={size}
              onChange={(e) => {
                onPageChange(1);
                onSizeChange(Number(e.target.value));
              }}
              aria-label={t('page_size', 'Taille de page')}
            >
              {[25, 50, 100, 200].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Tableau des erreurs */}
        <div className="overflow-x-auto">
          {Array.isArray(errorsData?.errors) && errorsData?.errors.length > 0 ? (
            <table 
              className="min-w-full border divide-y divide-gray-200"
              role="table"
              aria-label={t('errors_table', 'Tableau des erreurs du batch')}
            >
              <thead className="bg-gray-50">
                <tr role="row">
                  <th 
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('error_type', 'Type')}
                  </th>
                  <th 
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('error_message', 'Message')}
                  </th>
                  <th 
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('error_context', 'Contexte')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {errorsData.errors.map((errorItem: unknown, index: number) => {
                  // Cast sécurisé vers IdentityErrorItem
                  const error = errorItem as IdentityErrorItem;
                  // Sécurisation des données d'erreur
                  const errorType = error?.type ?? error?.error_type ?? null;
                  const errorMessage = error?.message ?? error?.msg ?? null;
                  const errorId = error?.id ?? `error-${selectedBatchId}-${index}`;
                  
                  return (
                    <tr key={errorId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {errorType ? (
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            errorType === 'VALIDATION' ? 'bg-red-100 text-red-800' :
                            errorType === 'DUPLICATE' ? 'bg-yellow-100 text-yellow-800' :
                            errorType === 'DATABASE' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {String(errorType)}
                          </span>
                        ) : (
                          <span className="text-gray-400">{t('unknown', '—')}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {errorMessage ? (
                          <div className="max-w-xs">
                            <p className="break-words">{String(errorMessage)}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">{t('no_message', 'Aucun message')}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                            {t('show_context', 'Voir le contexte')}
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs whitespace-pre-wrap break-all max-w-md overflow-auto">
                            {JSON.stringify(error, null, 2)}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-sm text-gray-600 text-center">
              {t('no_errors_found', 'Aucune erreur trouvée.')}
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

export default React.memo(ErrorsTable);

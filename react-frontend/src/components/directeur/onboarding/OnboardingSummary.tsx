import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, AlertTriangle, Users } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const OnboardingSummary: React.FC = () => {
  const { t } = useTranslation();
  const { getUploadStats } = useOnboarding();
  const stats = getUploadStats();
  const totalImports = stats.totalUploads;
  const successfulImports = stats.successfulUploads;
  const failedImports = stats.failedUploads;
  const lastImport = stats.lastUploadDate ? new Date(stats.lastUploadDate).toLocaleString() : '—';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('import_summary', "Résumé de l'import")}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Imports totaux */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-4" />
            <div>
            <div className="text-2xl font-bold text-blue-700">{totalImports}</div>
            <div className="text-sm text-gray-600">{t('total_imports', 'Imports totaux')}</div>
            </div>
        </div>

        {/* Imports réussis */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
            <div>
            <div className="text-2xl font-bold text-green-700">{successfulImports}</div>
            <div className="text-sm text-gray-600">{t('successful_imports', 'Imports réussis')}</div>
            </div>
        </div>

        {/* Imports échoués */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <XCircle className="w-8 h-8 text-red-500 mr-4" />
            <div>
            <div className="text-2xl font-bold text-red-700">{failedImports}</div>
            <div className="text-sm text-gray-600">{t('failed_imports', 'Imports échoués')}</div>
            </div>
        </div>

        {/* Dernier import */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mr-4" />
            <div>
            <div className="text-2xl font-bold text-yellow-700">{lastImport}</div>
            <div className="text-sm text-gray-600">{t('last_import', 'Dernier import')}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSummary;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, AlertTriangle, Users } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const OnboardingSummary: React.FC = () => {
  const { t } = useTranslation();
  const { summaryData, validationErrors } = useOnboarding();

  if (!summaryData) return null;

  const validUsersCount = summaryData.total - new Set(validationErrors.map(e => e.split(':')[0])).size;
  const validationErrorsCount = validationErrors.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('import_summary', "Résumé de l'import")}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total des utilisateurs */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-4" />
            <div>
            <div className="text-2xl font-bold text-blue-700">{summaryData.total}</div>
            <div className="text-sm text-gray-600">{t('total_users', 'Total des utilisateurs')}</div>
            </div>
        </div>

        {/* Utilisateurs valides */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
            <div>
            <div className="text-2xl font-bold text-green-700">{validUsersCount}</div>
            <div className="text-sm text-gray-600">{t('valid_users', 'Utilisateurs valides')}</div>
            </div>
        </div>

        {/* Erreurs de validation */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <XCircle className="w-8 h-8 text-red-500 mr-4" />
            <div>
            <div className="text-2xl font-bold text-red-700">{validationErrorsCount}</div>
            <div className="text-sm text-gray-600">{t('validation_errors', 'Erreurs de validation')}</div>
            </div>
        </div>

        {/* Avertissements */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mr-4" />
            <div>
            <div className="text-2xl font-bold text-yellow-700">0</div>
            <div className="text-sm text-gray-600">{t('warnings', 'Avertissements')}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSummary;

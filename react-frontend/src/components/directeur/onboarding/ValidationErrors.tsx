import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, XCircle } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const ValidationErrors: React.FC = () => {
  const { t } = useTranslation();
  const { validationErrors, previewData } = useOnboarding();

  if (!validationErrors || validationErrors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <XCircle className="w-6 h-6 text-red-600 mr-2" />
        <h3 className="text-lg font-semibold text-red-900">
          {t('validation_errors')} ({validationErrors.length})
        </h3>
      </div>

      <div className="space-y-3">
        {validationErrors.map((error, index) => (
          <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 mb-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-red-100 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>{t('note')}:</strong> {t('fix_errors_before_import')}
        </p>
      </div>
    </div>
  );
};

export default ValidationErrors;

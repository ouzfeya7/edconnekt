import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Users } from 'lucide-react';
import CSVUploader from '../../components/directeur/onboarding/CSVUploader';
import InvitationList from '../../components/directeur/onboarding/InvitationList';

const OnboardingPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('import'); // 'import' or 'suivi'

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('onboarding', 'Onboarding')}
        </h1>
        <p className="text-gray-600">
          {t('onboarding_description', 'Importez des utilisateurs et gérez les invitations')}
        </p>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('import')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'import'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>{t('csv_import', 'Import CSV')}</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('suivi')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'suivi'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{t('onboarding_tracking', 'Suivi Onboarding')}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      <div>
        {activeTab === 'import' && <CSVUploader />}
        {activeTab === 'suivi' && <InvitationList />}
      </div>
    </div>
  );
};

export default OnboardingPage;

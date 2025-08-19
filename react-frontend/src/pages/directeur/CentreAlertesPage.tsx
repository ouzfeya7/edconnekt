import React from 'react';
import { useTranslation } from 'react-i18next';
import AlertList from '../../components/directeur/alertes/AlertList';
import AlertStats from '../../components/directeur/alertes/AlertStats';

const CentreAlertesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('alert_center', 'Centre d\'Alertes')}
        </h1>
        <p className="text-gray-600">
          {t('alert_center_description', 'Surveillez et gérez les alertes de l\'établissement')}
        </p>
      </div>

      <div className="space-y-8">
        {/* Statistiques des alertes */}
        <AlertStats />
        
        {/* Liste des alertes */}
        <AlertList />
      </div>
    </div>
  );
};

export default CentreAlertesPage;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Building, Users, Bell, Shield } from 'lucide-react';
import SchoolSettingsForm from '../../components/directeur/parametres/SchoolSettingsForm';
import CycleManagement from '../../components/directeur/parametres/CycleManagement';

const ParametresPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('school');

  const settingsTabs = [
    {
      id: 'school',
      title: t('school_settings', 'Établissement'),
      icon: Building,
      component: SchoolSettingsForm,
      available: true
    },
    {
      id: 'cycles',
      title: t('academic_cycles', 'Cycles Scolaires'),
      icon: Settings,
      component: CycleManagement,
      available: true
    },
    {
      id: 'profile',
      title: t('user_profile', 'Profil Utilisateur'),
      icon: Users,
      component: null,
      available: false
    },
    {
      id: 'notifications',
      title: t('notifications', 'Notifications'),
      icon: Bell,
      component: null,
      available: false
    },
    {
      id: 'security',
      title: t('security', 'Sécurité'),
      icon: Shield,
      component: null,
      available: false
    }
  ];

  const renderTabContent = () => {
    const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
    
    if (!activeTabData) return null;

    if (!activeTabData.available) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <activeTabData.icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTabData.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('coming_soon_description', 'Cette fonctionnalité sera bientôt disponible')}
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
              <span className="text-sm font-medium">{t('coming_soon', 'Bientôt disponible')}</span>
            </div>
          </div>
        </div>
      );
    }

    if (!activeTabData.component) return null;

    const Component = activeTabData.component;
    return <Component />;
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('settings', 'Paramètres')}
        </h1>
        <p className="text-gray-600">
          {t('settings_description', 'Configurez les paramètres de votre établissement')}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isAvailable = tab.available;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={!isAvailable}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : isAvailable 
                      ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' 
                      : 'border-transparent text-gray-400 cursor-not-allowed'
                  }
                  ${!isAvailable ? 'opacity-50' : ''}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : isAvailable ? 'text-gray-500' : 'text-gray-400'}`} />
                <span>{tab.title}</span>
                {!isAvailable && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                    {t('coming_soon', 'Bientôt')}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ParametresPage;

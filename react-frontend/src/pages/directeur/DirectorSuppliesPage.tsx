import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Package, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SuppliesCampaignsPage from './SuppliesCampaignsPage';
import SuppliesConsolidationPage from './SuppliesConsolidationPage';

const DirectorSuppliesPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'campagnes',
      label: t('Campagnes', 'Campagnes'),
      icon: Package,
      path: '/fournitures/campagnes'
    },
    {
      id: 'consolidation',
      label: t('Consolidation', 'Consolidation'),
      icon: BarChart3,
      path: '/fournitures/consolidation'
    }
  ];

  const activeTab = location.pathname.includes('/consolidation') ? 'consolidation' : 'campagnes';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header simple et clair */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('Gestion des Fournitures', 'Gestion des Fournitures')}
        </h1>
        <p className="text-gray-600">
          {t('Administrez les référentiels, matières et compétences.', 'Administrez les référentiels, matières et compétences.')}
        </p>
      </div>

      {/* Navigation simple par onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'border-sky-500 text-sky-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des pages */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <Routes>
          {/* Redirection par défaut vers campagnes */}
          <Route index element={<Navigate to="/fournitures/campagnes" replace />} />
          <Route path="campagnes" element={<SuppliesCampaignsPage />} />
          <Route path="consolidation" element={<SuppliesConsolidationPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default DirectorSuppliesPage;

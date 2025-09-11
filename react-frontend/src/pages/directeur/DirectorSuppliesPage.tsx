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
    <div className="min-h-screen bg-white">
       {/* Header avec onglets */}
       <div className="bg-white border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="py-6">
             <div className="flex items-center justify-between">
               <h1 className="text-3xl font-bold text-gray-900">
                 {t('Gestion des Fournitures', 'Gestion des Fournitures')}
               </h1>
               
               {/* Onglets */}
               <div className="flex space-x-1">
                 {tabs.map((tab) => {
                   const Icon = tab.icon;
                   const isActive = activeTab === tab.id;
                   
                   return (
                     <button
                       key={tab.id}
                       onClick={() => navigate(tab.path)}
                       className={`
                         flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                         ${isActive 
                           ? 'bg-gray-100 text-blue-600 shadow-sm border border-blue-200' 
                           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                         }
                       `}
                     >
                       <Icon size={20} className="mr-2" />
                       {tab.label}
                     </button>
                   );
                 })}
               </div>
             </div>
           </div>
         </div>
       </div>

      {/* Contenu des pages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

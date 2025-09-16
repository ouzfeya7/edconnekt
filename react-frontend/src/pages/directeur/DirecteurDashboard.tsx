import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../layouts/DashboardLayout';
import { 
  AlertTriangle, 
  Calendar, 
  GraduationCap, 
  Upload,
  RefreshCw
} from 'lucide-react';
import { useDirector } from '../../contexts/DirectorContext';
import DashboardCharts from '../../components/directeur/DashboardCharts';
import LevelStats from '../../components/directeur/LevelStats';
import DashboardKPIs from '../../components/directeur/dashboard/DashboardKPIs';
import QuickActionCard from '../../components/directeur/common/QuickActionCard';

const DirecteurDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { isRefreshing, lastUpdate, refreshData } = useDirector();

  const shortcuts = [
    {
      title: t('onboarding', 'Onboarding'),
      description: t('import_users', 'Importer des utilisateurs'),
      icon: <Upload className="w-6 h-6" />,
      color: 'bg-blue-500',
      onClick: () => navigate('/utilisateurs')
    },
    {
      title: t('alertes', 'Alertes'),
      description: t('view_alerts', 'Voir les alertes'),
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-500',
      onClick: () => navigate('/alertes')
    },
    {
      title: t('emploi_du_temps', 'Emploi du temps'),
      description: t('planning', 'Planifier les cours'),
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-green-500',
      onClick: () => navigate('/emploi-du-temps')
    },
    {
      title: t('referentiels', 'Référentiels'),
      description: t('manage_references', 'Gérer les référentiels'),
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'bg-purple-500',
      onClick: () => navigate('/referentiels')
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <div className="text-slate-600">Chargement des données...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header avec bienvenue */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('welcome_director', 'Bienvenue, Directeur')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard_subtitle', 'Tableau de bord de votre établissement')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t('last_update', 'Dernière mise à jour')} : {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          title={t('refresh_data', 'Actualiser les données')}
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <DashboardKPIs />

      {/* Raccourcis */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('quick_actions', 'Actions Rapides')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {shortcuts.map((shortcut, index) => (
            <QuickActionCard
              key={index}
              title={shortcut.title}
              description={shortcut.description}
              icon={shortcut.icon}
              color={shortcut.color.replace('bg-','').replace('-500','') as 'blue' | 'green' | 'red' | 'purple' | 'orange'}
              onClick={shortcut.onClick}
            />
          ))}
        </div>
      </div>

             {/* Statistiques par niveau */}
       <LevelStats className="mb-8" />

       {/* Graphiques et visualisations */}
       <DashboardCharts className="mb-8" />
    </div>
  );
};

export default DirecteurDashboard;

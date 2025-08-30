
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaUsers, FaFileInvoiceDollar, FaTags, FaGraduationCap, FaUpload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useEstablishments } from '../../../hooks/useEstablishments';

interface DashboardCardProps {
  to: string;
  icon: React.ReactElement;
  title: string;
  stats: string;
  description: string;
  colorClasses: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ to, icon, title, stats, description, colorClasses }) => (
  <Link to={to} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{stats}</p>
      </div>
      <div className={`p-4 rounded-full ${colorClasses}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
    <p className="text-gray-600 mt-4 text-sm">{description}</p>
  </Link>
);


const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data: establishments, isLoading: isLoadingEtabs } = useEstablishments({ limit: 100 });
  const establishmentCount = establishments?.length ?? 0;
  
  const dashboardItems = [
    { to: "/etablissements", icon: <FaBuilding />, title: t('etablissements'), stats: isLoadingEtabs ? '...' : `${establishmentCount}`, description: "Gérer les fiches des établissements", colorClasses: "bg-blue-100 text-blue-600" },
    { to: "/utilisateurs", icon: <FaUsers />, title: t('utilisateurs'), stats: "452", description: "Gérer tous les comptes utilisateurs", colorClasses: "bg-green-100 text-green-600" },
    { to: "/abonnements", icon: <FaFileInvoiceDollar />, title: t('abonnements'), stats: "9", description: "Suivre les abonnements clients", colorClasses: "bg-yellow-100 text-yellow-600" },
    { to: "/plans", icon: <FaTags />, title: t('plans'), stats: "4", description: "Configurer les offres commerciales", colorClasses: "bg-purple-100 text-purple-600" },
    { to: "/referentiels", icon: <FaGraduationCap />, title: t('referentiels'), stats: "5", description: "Administrer les nomenclatures", colorClasses: "bg-indigo-100 text-indigo-600" },
    { to: "/imports", icon: <FaUpload />, title: t('imports'), stats: "23", description: "Superviser les imports de données", colorClasses: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Tableau de bord Administrateur</h1>
      <p className="text-gray-600 mb-8">Vue d'ensemble et pilotage du système EdConnekt.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => (
          <DashboardCard
            key={item.to}
            to={item.to}
            icon={item.icon}
            title={item.title}
            stats={item.stats}
            description={item.description}
            colorClasses={item.colorClasses}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

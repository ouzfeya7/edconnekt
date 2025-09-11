import React, { useState } from 'react';
import { 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings
} from 'lucide-react';

// Types pour les données Direction
interface DirectorKPI {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
  target?: string;
  status: 'success' | 'warning' | 'danger';
}

interface ValidationRequest {
  id: string;
  type: 'republication' | 'action_plan';
  teacherName: string;
  className: string;
  sessionDate: string;
  requestDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface DuplicateAlert {
  id: string;
  teacherName: string;
  className: string;
  week: string;
  sessionCount: number;
  sessionDates: string[];
  status: 'active' | 'resolved';
}

// Mock data pour Direction
const mockDirectorKPIs: DirectorKPI[] = [
  {
    label: "Taux de génération rapport",
    value: "97%",
    target: "≥ 95%",
    trend: "up",
    status: "success"
  },
  {
    label: "Temps moyen préparation",
    value: "8 min",
    target: "≤ 10 min",
    trend: "stable",
    status: "success"
  },
  {
    label: "Consultation parents <48h",
    value: "78%",
    target: "≥ 80%",
    trend: "down",
    status: "warning"
  },
  {
    label: "Taux remédiation",
    value: "85%",
    target: "≥ 90%",
    trend: "up",
    status: "warning"
  }
];

const mockValidationRequests: ValidationRequest[] = [
  {
    id: "val-001",
    type: "republication",
    teacherName: "Mme Diallo",
    className: "CE2 A",
    sessionDate: "24/07/2025",
    requestDate: "25/07/2025",
    reason: "Erreur dans les observations d'Aminata Ba",
    status: "pending"
  },
  {
    id: "val-002", 
    type: "action_plan",
    teacherName: "M. Sow",
    className: "CM1 B",
    sessionDate: "23/07/2025",
    requestDate: "24/07/2025",
    reason: "Plan remédiation pour 3 élèves en difficulté critique",
    status: "pending"
  }
];

const mockDuplicateAlerts: DuplicateAlert[] = [
  {
    id: "dup-001",
    teacherName: "Mme Ndiaye",
    className: "CP A",
    week: "Semaine du 21/07/2025",
    sessionCount: 2,
    sessionDates: ["23/07/2025", "24/07/2025"],
    status: "active"
  }
];

// Composant Sidebar Direction
interface DirectorPdiSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const DirectorPdiSidebar: React.FC<DirectorPdiSidebarProps> = ({
  activeView,
  onViewChange
}) => {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: BarChart3,
      description: 'KPIs et indicateurs globaux'
    },
    {
      id: 'validations', 
      label: 'Centre de validation',
      icon: CheckCircle,
      description: 'Plans d\'action et republications'
    },
    {
      id: 'duplicates',
      label: 'Contrôle doublons',
      icon: AlertTriangle,
      description: 'Séances multiples par classe'
    },
    {
      id: 'reports',
      label: 'Bibliothèque rapports',
      icon: FileText,
      description: 'Tous les rapports publiés'
    },
    {
      id: 'settings',
      label: 'Paramètres métier',
      icon: Settings,
      description: 'Seuils et politiques'
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* En-tête sidebar */}
      <div className="p-6 border-b border-slate-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-800">Direction PDI</h2>
        <p className="text-sm text-slate-600 mt-1">Pilotage et supervision</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon size={20} className={`mt-0.5 ${isActive ? 'text-blue-600' : ''}`} />
              <div>
                <div className={`font-medium ${isActive ? 'text-blue-800' : ''}`}>
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

    </div>
  );
};

// Composant principal
const DirectorPdiPage: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');

  const renderDashboardView = () => (
    <div className="space-y-6">
      {/* En-tête Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tableau de bord Direction</h2>
        <p className="text-slate-600 mt-1">Indicateurs globaux et alertes centralisées</p>
      </div>

      {/* Grille des KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockDirectorKPIs.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">{kpi.label}</h3>
              <div className={`w-2 h-2 rounded-full ${
                kpi.status === 'success' ? 'bg-emerald-500' :
                kpi.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{kpi.value}</div>
            {kpi.target && (
              <div className="text-xs text-slate-500">Objectif: {kpi.target}</div>
            )}
          </div>
        ))}
      </div>

      {/* Alertes centralisées */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Alertes prioritaires</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="text-red-600" size={20} />
            <div>
              <div className="font-medium text-red-800">Doublon détecté</div>
              <div className="text-sm text-red-600">CP A - Mme Ndiaye (2 séances cette semaine)</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <CheckCircle className="text-amber-600" size={20} />
            <div>
              <div className="font-medium text-amber-800">Demandes de validation</div>
              <div className="text-sm text-amber-600">2 demandes en attente (republication + plan d'action)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderValidationsView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Centre de validation</h2>
        <p className="text-slate-600 mt-1">Plans d'action et demandes de republication</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Demandes en attente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Enseignant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date séance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Motif</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {mockValidationRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      request.type === 'republication' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {request.type === 'republication' ? 'Republication' : 'Plan d\'action'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{request.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{request.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{request.sessionDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{request.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-emerald-600 hover:text-emerald-900">Approuver</button>
                    <button className="text-red-600 hover:text-red-900">Refuser</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDuplicatesView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Contrôle des doublons</h2>
        <p className="text-slate-600 mt-1">Règle : 1 séance par classe et par semaine</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Alertes doublons actives</h3>
        </div>
        <div className="p-6 space-y-4">
          {mockDuplicateAlerts.map((alert) => (
            <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-red-800">
                    {alert.className} - {alert.teacherName}
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    {alert.week} • {alert.sessionCount} séances: {alert.sessionDates.join(', ')}
                  </div>
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                    Annuler doublon
                  </button>
                  <button className="px-3 py-1 text-xs border border-red-600 text-red-600 rounded hover:bg-red-50">
                    Autoriser exception
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Bibliothèque des rapports</h2>
        <p className="text-slate-600 mt-1">Tous les rapports publiés et versionnés</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">Bibliothèque en construction</h3>
          <p className="mt-1 text-sm text-slate-500">
            L'interface de recherche et consultation des rapports sera disponible prochainement.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Paramètres métier</h2>
        <p className="text-slate-600 mt-1">Seuils et politiques de gestion PDI</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">Paramètres en construction</h3>
          <p className="mt-1 text-sm text-slate-500">
            La configuration des seuils et politiques sera disponible prochainement.
          </p>
        </div>
      </div>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboardView();
      case 'validations':
        return renderValidationsView();
      case 'duplicates':
        return renderDuplicatesView();
      case 'reports':
        return renderReportsView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderDashboardView();
    }
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar persistant */}
      <DirectorPdiSidebar
        activeView={activeView}
        onViewChange={setActiveView}
      />
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Zone de contenu avec défilement */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorPdiPage;

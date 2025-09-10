import React from 'react';
import { Calendar, Clock, HelpCircle } from 'lucide-react';

interface PdiNavigationSidebarProps {
  activeView: 'sessions' | 'history' | 'help';
  onViewChange: (view: 'sessions' | 'history' | 'help') => void;
  facilitatorName: string;
}

const PdiNavigationSidebar: React.FC<PdiNavigationSidebarProps> = ({
  activeView,
  onViewChange,
  facilitatorName
}) => {
  const navigationItems = [
    {
      id: 'sessions' as const,
      label: 'Séances en cours',
      icon: <Calendar size={20} />,
      description: 'Gérer les séances PDI actuelles'
    },
    {
      id: 'history' as const,
      label: 'Historique & rapports',
      icon: <Clock size={20} />,
      description: 'Consulter l\'historique et les rapports'
    },
    {
      id: 'help' as const,
      label: 'Aide',
      icon: <HelpCircle size={20} />,
      description: 'Documentation de l\'interface PDI'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      {/* En-tête facilitateur */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Séances PDI</h2>
        <p className="text-sm text-slate-500 mt-1">{facilitatorName}</p>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
                title={item.description}
              >
                <span className={activeView === item.id ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

    </div>
  );
};

export default PdiNavigationSidebar;

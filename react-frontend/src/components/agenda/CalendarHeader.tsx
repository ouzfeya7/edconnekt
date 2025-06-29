import React from 'react';
import { ChevronLeft, ChevronRight, Menu, Calendar, Grid3X3, List, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CalendarHeaderProps {
  title: string;
  currentView: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: string) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  title, 
  currentView, 
  onPrev, 
  onNext, 
  onToday, 
  onViewChange,
  onToggleSidebar,
  isSidebarOpen 
}) => {
  const { t } = useTranslation();
  
  const viewOptions = [
    { value: 'dayGridMonth', label: t('month', 'Mois'), icon: <Grid3X3 size={16} /> },
    { value: 'timeGridWeek', label: t('week', 'Semaine'), icon: <List size={16} /> },
    { value: 'timeGridDay', label: t('day', 'Jour'), icon: <Clock size={16} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      {/* Section gauche - Hamburger + Navigation */}
      <div className="flex items-center gap-4 w-full lg:w-auto">
        {/* Bouton hamburger pour mobile */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        )}

        {/* Navigation dates */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onPrev} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize min-w-[200px] text-center">
            {title}
          </h2>
          
          <button 
            onClick={onNext} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Section droite - Bouton Aujourd'hui + Sélecteur de vue */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
        {/* Bouton Aujourd'hui */}
        <button 
          onClick={onToday} 
          className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Calendar size={16} />
          <span className="hidden sm:inline">{t('today', "Aujourd'hui")}</span>
        </button>

        {/* Sélecteur de vue - Style boutons sur desktop, select sur mobile */}
        <div className="flex lg:hidden">
          <select
            value={currentView}
            onChange={(e) => onViewChange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 px-3 py-2"
          >
            {viewOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Boutons de vue pour desktop */}
        <div className="hidden lg:flex bg-gray-100 rounded-lg p-1">
          {viewOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onViewChange(option.value)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${currentView === option.value 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader; 
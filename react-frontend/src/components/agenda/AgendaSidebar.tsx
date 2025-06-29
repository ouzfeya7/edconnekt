import React from 'react';
import { PlusCircle, Pencil, X, Calendar, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SchoolEvent, formatDateHeader, getEventCategories } from './agenda_data';
import { useTranslation } from 'react-i18next';

interface AgendaSidebarProps {
  groupedEvents: { [key: string]: SchoolEvent[] };
  onAddEvent?: () => void; // Optionnel car on utilise la navigation directe
  onEventClick: (date: string) => void;
  onEditEvent?: (event: SchoolEvent) => void; // Optionnel car on utilise la navigation directe
  onCloseSidebar?: () => void;
}

const AgendaSidebar: React.FC<AgendaSidebarProps> = ({ 
  groupedEvents, 
  onEventClick, 
  onCloseSidebar 
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const eventCategories = getEventCategories(t);

  const getEventIcon = (category: keyof typeof eventCategories) => {
    switch (category) {
      case 'reunion': return <Users size={16} className="text-blue-600" />;
      case 'activite': return <Calendar size={16} className="text-purple-600" />;
      case 'sportif': return <Clock size={16} className="text-green-600" />;
      default: return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: keyof typeof eventCategories) => {
    switch (category) {
      case 'reunion': return 'border-l-blue-500 bg-blue-50';
      case 'activite': return 'border-l-purple-500 bg-purple-50';
      case 'sportif': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleAddEvent = () => {
    navigate('/agenda/create');
    if (onCloseSidebar) onCloseSidebar();
  };

  const handleEditEvent = (event: SchoolEvent) => {
    navigate(`/agenda/edit/${event.id}`);
    if (onCloseSidebar) onCloseSidebar();
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* En-tête */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">{t('agenda_title', 'Mon Agenda')}</h1>
          {onCloseSidebar && (
            <button
              onClick={onCloseSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>
        
        <button
          onClick={handleAddEvent}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <PlusCircle size={18} />
          {t('add_event', 'Nouvel événement')}
        </button>
      </div>

      {/* Navigation par catégories */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          {t('categories', 'Catégories')}
        </h3>
        <div className="space-y-1">
          {Object.entries(eventCategories).map(([key, category]) => {
            const eventCount = Object.values(groupedEvents)
              .flat()
              .filter(event => event.category === key).length;
            
            return (
              <div
                key={key}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {getEventIcon(key as keyof typeof eventCategories)}
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {category.label}
                  </span>
                </div>
                {eventCount > 0 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {eventCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste des événements */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            {t('upcoming_events', 'Événements à venir')}
          </h3>
          
          {Object.keys(groupedEvents).length > 0 ? (
            <div className="space-y-4">
              {Object.keys(groupedEvents).map(dateKey => (
                <div key={dateKey}>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 sticky top-0 bg-white py-1">
                    {formatDateHeader(dateKey, i18n.language)}
                  </h4>
                  <div className="space-y-2">
                    {groupedEvents[dateKey].map(event => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event.start as string)}
                        className={`
                          border-l-4 rounded-r-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-sm
                          ${getCategoryColor(event.category)}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getEventIcon(event.category)}
                              <h5 className="text-sm font-medium text-gray-900 truncate">
                                {event.title}
                              </h5>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                              <Clock size={12} />
                              {event.allDay ? (
                                <span>{t('all_day', 'Journée entière')}</span>
                              ) : (
                                <span>
                                  {event.start ? 
                                    new Date(event.start as string).toLocaleTimeString(i18n.language, { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    }) : ''
                                  }
                                </span>
                              )}
                            </div>

                            {event.location && (
                              <div className="text-xs text-gray-500 truncate">
                                📍 {event.location}
                              </div>
                            )}

                            {event.targetAudience && event.targetAudience.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {event.targetAudience.slice(0, 2).map((audience, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-white bg-opacity-70 text-gray-600 px-2 py-1 rounded-full"
                                  >
                                    {audience}
                                  </span>
                                ))}
                                {event.targetAudience.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{event.targetAudience.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                            className="p-1.5 hover:bg-white hover:bg-opacity-70 rounded-full transition-colors ml-2"
                          >
                            <Pencil size={14} className="text-gray-500 hover:text-gray-700" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-2">
                {t('no_events_to_display', 'Aucun événement à afficher')}
              </p>
              <p className="text-xs text-gray-400">
                {t('click_add_event', 'Cliquez sur "Nouvel événement" pour commencer')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendaSidebar; 
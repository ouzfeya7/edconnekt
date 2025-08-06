import React, { useState, useMemo } from 'react';
import { PlusCircle, Pencil, X, Calendar, Clock, Users, AlertTriangle, Search, Tag, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SchoolEvent, getEventCategories } from './agenda_data';
import { useTranslation } from 'react-i18next';

interface AgendaSidebarProps {
  groupedEvents: { [key: string]: SchoolEvent[] };
  onAddEvent?: () => void;
  onEventClick: (date: string) => void;
  onEditEvent?: (event: SchoolEvent) => void;
  onCloseSidebar?: () => void;
}

const AgendaSidebar: React.FC<AgendaSidebarProps> = ({ 
  groupedEvents, 
  onEventClick, 
  onAddEvent,
  onEditEvent,
  onCloseSidebar 
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCompactView, setIsCompactView] = useState(false);
  
  const eventCategories = getEventCategories(t);

  const filteredEvents = useMemo(() => {
    let events = Object.values(groupedEvents).flat();
    
    // Filtre par recherche
    if (searchTerm) {
      events = events.filter(event => 
        (event.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtre par catégorie
    if (selectedCategory) {
      events = events.filter(event => event.category === selectedCategory);
    }
    
    return events.sort((a, b) => 
      new Date(a.start as string).getTime() - new Date(b.start as string).getTime()
    );
  }, [groupedEvents, searchTerm, selectedCategory]);

  const getEventIcon = (category: keyof typeof eventCategories) => {
    switch (category) {
      case 'reunion': return <Users size={14} className="text-blue-600" />;
      case 'activite': return <Calendar size={14} className="text-purple-600" />;
      case 'sportif': return <Clock size={14} className="text-green-600" />;
      case 'remediation': return <AlertTriangle size={14} className="text-red-600" />;
      default: return <Tag size={14} className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: keyof typeof eventCategories) => {
    switch (category) {
      case 'reunion': return 'border-l-blue-500 bg-blue-50';
      case 'activite': return 'border-l-purple-500 bg-purple-50';
      case 'sportif': return 'border-l-green-500 bg-green-50';
      case 'remediation': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleAddEvent = () => {
    if (onAddEvent) {
      onAddEvent();
    } else {
      navigate('/agenda/create');
    }
    if (onCloseSidebar) onCloseSidebar();
  };

  const handleEditEvent = (event: SchoolEvent) => {
    if (onEditEvent) {
      onEditEvent(event);
    } else {
      navigate(`/agenda/edit/${event.id}`);
    }
    if (onCloseSidebar) onCloseSidebar();
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-gray-900">{t('agenda_title', 'Mon Agenda')}</h1>
          {onCloseSidebar && (
            <button
              onClick={onCloseSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          )}
        </div>
        
        <button
          onClick={handleAddEvent}
          className="w-full bg-white border border-gray-300 hover:shadow-md text-gray-700 py-3 px-4 rounded-full flex items-center gap-3 font-medium transition-all duration-200 hover:bg-gray-50"
        >
          <PlusCircle size={20} className="text-orange-500" />
          <span>Nouvel événement</span>
        </button>
      </div>

      {/* Barre de recherche avec filtre par catégorie */}
      <div className="p-3 border-b border-gray-200">
        <div className="space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          
          {/* Filtre par catégorie - liste déroulante */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
          >
            <option value="">Toutes les catégories</option>
            {Object.entries(eventCategories).map(([key, category]) => {
              const eventCount = Object.values(groupedEvents)
                .flat()
                .filter(event => event.category === key).length;
              
              return (
                <option key={key} value={key}>
                  {category.label} ({eventCount})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Liste des événements - avec plus d'espace */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('upcoming_events', 'Événements à venir')}
            </h3>
            <button
              onClick={() => setIsCompactView(!isCompactView)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {isCompactView ? 'Vue étendue' : 'Vue compacte'}
            </button>
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className="space-y-2">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-l-4 transition-colors hover:shadow-sm cursor-pointer ${
                    getCategoryColor(event.category)
                  }`}
                  onClick={() => onEventClick((event.start as string).slice(0, 10))}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getEventIcon(event.category)}
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </h4>
                      </div>
                      
                      {!isCompactView && (
                        <>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <Calendar size={12} />
                            <span>
                              {new Date(event.start as string).toLocaleDateString(i18n.language, { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            {!event.allDay && (
                              <>
                                <Clock size={12} />
                                <span>
                                  {new Date(event.start as string).toLocaleTimeString(i18n.language, { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </>
                            )}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin size={12} />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(event);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Modifier l'événement"
                    >
                      <Pencil size={12} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Calendar size={24} />
              </div>
              <p className="text-sm text-gray-500">
                {searchTerm || selectedCategory 
                  ? 'Aucun événement trouvé' 
                  : 'Aucun événement à venir'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendaSidebar; 
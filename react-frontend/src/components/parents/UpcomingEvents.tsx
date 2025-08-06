import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, AlertTriangle, BookOpen, Trophy, Users2 } from 'lucide-react';
import { SchoolEvent } from '../agenda/agenda_data';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

interface EventItemProps {
  title: string;
  time: string;
  date: string;
  isToday: boolean;
  isTomorrow: boolean;
  category?: string;
  location?: string;
  allDay?: boolean;
}

const EventItem: React.FC<EventItemProps> = ({ title, time, date, isToday, isTomorrow, category, location, allDay }) => {
  const getDateLabel = () => {
    if (isToday) return "Aujourd'hui";
    if (isTomorrow) return "Demain";
    return dayjs(date).format('DD/MM/YYYY');
  };

  const getDateColor = () => {
    if (isToday) return "text-red-600 font-semibold";
    if (isTomorrow) return "text-orange-600 font-semibold";
    return "text-gray-500";
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'remediation':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'activite':
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'sportif':
        return <Trophy className="h-4 w-4 text-green-500" />;
      case 'reunion':
        return <Users2 className="h-4 w-4 text-blue-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'remediation':
        return 'border-l-red-500 bg-red-50';
      case 'activite':
        return 'border-l-purple-500 bg-purple-50';
      case 'sportif':
        return 'border-l-green-500 bg-green-50';
      case 'reunion':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <Link 
      to="/agenda" 
      className={`block p-4 rounded-lg hover:shadow-md transition-colors cursor-pointer border-l-4 ${getCategoryColor(category)}`}
    >
      <div className="flex items-start gap-3">
        {/* Icône de catégorie */}
        <div className="flex-shrink-0 mt-0.5">
          {getCategoryIcon(category)}
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
            {title}
          </h4>
          
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className={getDateColor()}>{getDateLabel()}</span>
            </div>
            
            {/* Heure */}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-gray-500">
                {allDay ? "Journée entière" : time}
              </span>
            </div>
            
            {/* Lieu si disponible */}
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500 truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Indicateur de priorité pour les événements de remédiation */}
        {category === 'remediation' && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </Link>
  );
};

interface UpcomingEventsProps {
    events: SchoolEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const { t } = useTranslation();
  const today = dayjs();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden">
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {t('upcoming_events', 'Événements à venir')}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {events.length} événement{events.length > 1 ? 's' : ''} programmé{events.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link 
            to="/agenda" 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1"
          >
            {t('see_more', 'Voir plus')}
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
      
      {/* Contenu des événements */}
      <div className="p-4">
        <div className="space-y-3">
          {events.length > 0 ? (
            events.map(event => {
              const eventDate = dayjs(event.start as string);
              const isToday = eventDate.isSame(today, 'day');
              const isTomorrow = eventDate.isSame(today.add(1, 'day'), 'day');
              
              return (
                <EventItem 
                  key={event.id}
                  title={event.title || 'Événement sans titre'}
                  time={eventDate.format('HH:mm')}
                  date={eventDate.format('YYYY-MM-DD')}
                  isToday={isToday}
                  isTomorrow={isTomorrow}
                  category={event.category}
                  location={event.location}
                  allDay={event.allDay}
                />
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {t('no_upcoming_events', 'Aucun événement à venir.')}
              </p>
              <p className="text-xs text-gray-400">
                Les événements apparaîtront ici quand ils seront programmés
              </p>
            </div>
          )}
        </div>
        
        {/* Légende des catégories */}
        {events.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Légende :</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span className="text-gray-600">Remédiation</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-purple-500" />
                <span className="text-gray-600">Activité</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-3 w-3 text-green-500" />
                <span className="text-gray-600">Sport</span>
              </div>
              <div className="flex items-center gap-1">
                <Users2 className="h-3 w-3 text-blue-500" />
                <span className="text-gray-600">Réunion</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents; 
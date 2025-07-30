import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';
import { SchoolEvent } from '../agenda/agenda_data'; // Importer le type d'événement
import { Link } from 'react-router-dom'; // Importer Link
import dayjs from 'dayjs';

interface EventItemProps {
  title: string;
  time: string;
  date: string;
  isToday: boolean;
  isTomorrow: boolean;
}

const EventItem: React.FC<EventItemProps> = ({ title, time, date, isToday, isTomorrow }) => {
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

  return (
    <Link 
      to="/agenda" 
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className={`text-xs ${getDateColor()}`}>{getDateLabel()}</span>
          <Clock className="h-3 w-3 text-gray-400 ml-2" />
          <span className="text-xs text-gray-500">{time}</span>
        </div>
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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{t('upcoming_events', 'Évènements à venir')}</h3>
        <Link to="/agenda" className="text-sm font-semibold text-blue-600 hover:underline">
          {t('see_more', 'Voir plus')}
        </Link>
      </div>
      <div>
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
                />
              );
            })
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">{t('no_upcoming_events', 'Aucun événement à venir.')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents; 
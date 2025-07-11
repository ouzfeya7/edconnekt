import React from 'react';
import { useTranslation } from 'react-i18next';
import { MoreHorizontal } from 'lucide-react';
import { SchoolEvent } from '../agenda/agenda_data'; // Importer le type d'événement
import { Link } from 'react-router-dom'; // Importer Link

interface EventItemProps {
  title: string;
  time: string;
}

const EventItem: React.FC<EventItemProps> = ({ title, time }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
    <button className="p-2 rounded-full hover:bg-gray-200">
      <MoreHorizontal className="h-5 w-5 text-gray-600" />
    </button>
  </div>
);

interface UpcomingEventsProps {
    events: SchoolEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{t('events', 'Évènements')}</h3>
        <Link to="/agenda" className="text-sm font-semibold text-blue-600 hover:underline">
          {t('see_more', 'Voir plus')}
        </Link>
      </div>
      <div>
        <h4 className="font-semibold text-gray-600 mb-2">{t('today', "Aujourd'hui")}</h4>
        <div className="space-y-3">
          {events.length > 0 ? (
            events.map(event => (
              <EventItem 
                key={event.id}
                title={event.title || 'Événement sans titre'}
                time={new Date(event.start as string).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">{t('no_events_today', "Aucun évènement aujourd'hui.")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents; 
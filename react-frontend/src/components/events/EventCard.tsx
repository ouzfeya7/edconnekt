import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SchoolEvent } from '../agenda/agenda_data';

interface EventCardProps {
  events: SchoolEvent[];
}

const EventCard: React.FC<EventCardProps> = ({ events }) => {
  const { t, i18n } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  
  const todaysEvents = events.filter(event => 
    event.start && (event.start as string).slice(0, 10) === today
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('todays_events')}</h3>
      
      <div className="space-y-4">
        {todaysEvents.length > 0 ? (
          todaysEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {!(event.allDay) && event.start ?
                    new Date(event.start as string).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' }) :
                    t('all_day', 'Journée entière')}
                </p>
              </div>
              <button className="p-1 hover:bg-gray-200 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">
            {t('no_events_today')}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCard; 
import React from 'react';
import { Dialog } from '@headlessui/react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { SchoolEvent, getEventCategories } from './agenda_data';
import { useTranslation } from 'react-i18next';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: SchoolEvent | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event }) => {
  const { t, i18n } = useTranslation();

  if (!event) return null;
  
  const eventCategories = getEventCategories(t);
  const locale = i18n.language;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/30" />
        <Dialog.Panel className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl mx-auto z-10">
          <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
            {event.title}
          </Dialog.Title>
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${eventCategories[event.category].tailwindColors}`}>
            {eventCategories[event.category].label}
          </span>

          <div className="mt-6 space-y-5 text-gray-700">
            {event.description && (
              <p className="whitespace-pre-wrap">{event.description}</p>
            )}

            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800">{t('date_and_time', 'Date et Heure')}</h3>
                <p className="text-sm">
                  {new Date(event.start as string).toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  <br />
                  {event.allDay
                    ? t('all_day', 'Toute la journée')
                    : t('from_to', { 
                        start: new Date(event.start as string).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
                        end: new Date(event.end as string).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
                      })
                  }
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">{t('location', 'Lieu')}</h3>
                  <p className="text-sm">{event.location}</p>
                </div>
              </div>
            )}

            {event.targetAudience && event.targetAudience.length > 0 && (
              <div className="flex items-start gap-3">
                <Users size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">{t('target_audience', 'Public Cible')}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {event.targetAudience.map(audience => (
                      <span key={audience} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg">{t('close', 'Fermer')}</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EventDetailsModal; 
import React from 'react';
import { PlusCircle, Pencil } from 'lucide-react';
import { SchoolEvent, formatDateHeader } from './agenda_data';

interface AgendaSidebarProps {
  groupedEvents: { [key: string]: SchoolEvent[] };
  onAddEvent: () => void;
  onEventClick: (date: string) => void;
  onEditEvent: (event: SchoolEvent) => void;
}

const AgendaSidebar: React.FC<AgendaSidebarProps> = ({ groupedEvents, onAddEvent, onEventClick, onEditEvent }) => {
  return (
    <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-sm p-6 flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Agenda</h2>
      <button
        onClick={onAddEvent}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
      >
        <PlusCircle size={20} />
        Ajouter un événement
      </button>
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {Object.keys(groupedEvents).length > 0 ? (
          Object.keys(groupedEvents).map(dateKey => (
            <div key={dateKey}>
              <p className="font-semibold text-gray-600 text-sm my-2">{formatDateHeader(dateKey)}</p>
              {groupedEvents[dateKey].map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event.start as string)}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mt-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {!(event.allDay) && event.start ?
                        new Date(event.start as string).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) :
                        'Journée entière'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(event);
                    }}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <Pencil size={16} className="text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">Aucun événement à afficher.</p>
        )}
      </div>
    </div>
  );
};

export default AgendaSidebar; 
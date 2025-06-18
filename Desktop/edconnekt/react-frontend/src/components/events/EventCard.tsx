import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const events = [
  { label: "Activite musicale", time: "12:00 GMT" },
  { label: "Activite musicale", time: "15:00 GMT" },
  { label: "Activite musicale", time: "12:00 GMT" },
];

const EventCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full max-w-xs mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Evenement</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Aujourd'hui</p>
          <div className="space-y-2">
            {events.slice(0, 2).map((event, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.label}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Aujourd'hui</p>
          <div className="space-y-2">
            {events.slice(2).map((event, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.label}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 
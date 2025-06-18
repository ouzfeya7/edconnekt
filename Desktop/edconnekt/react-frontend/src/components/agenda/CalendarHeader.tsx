import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  title: string;
  currentView: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ title, currentView, onPrev, onNext, onToday, onViewChange }) => {
  const viewOptions = [
    { value: 'dayGridMonth', label: 'Mois' },
    { value: 'timeGridWeek', label: 'Semaine' },
    { value: 'timeGridDay', label: 'Jour' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      {/* Left side: Today button */}
      <div className="order-2 sm:order-1">
        <button 
          onClick={onToday} 
          className="p-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
        >
          Aujourd'hui
        </button>
      </div>

      {/* Center: Navigation and Title */}
      <div className="flex items-center gap-4 order-1 sm:order-2">
        <button 
          onClick={onPrev} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 capitalize text-center min-w-[150px]">
          {title}
        </h2>
        <button 
          onClick={onNext} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Right side: View switcher */}
      <div className="order-3 sm:order-3">
        <select
          value={currentView}
          onChange={(e) => onViewChange(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          {viewOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CalendarHeader; 
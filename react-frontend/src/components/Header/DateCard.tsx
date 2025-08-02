import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateCardProps {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

const DateCard: React.FC<DateCardProps> = ({ value, onChange, disabled = false }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value));

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  // Fonction pour obtenir les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    // Jours du mois précédent
    // Ajuster pour que lundi soit le premier jour de la semaine
    const mondayOffset = startingDay === 0 ? 6 : startingDay - 1; // Lundi = 0, Mardi = 1, ..., Dimanche = 6
    for (let i = 0; i < mondayOffset; i++) {
      const prevDate = new Date(year, month, -mondayOffset + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  // Fonction pour sélectionner une date
  const selectDate = (date: Date) => {
      if (onChange) {
      onChange(date);
    }
    setIsOpen(false);
  };

  // Fonction pour vérifier si une date est sélectionnée
  const isSelectedDate = (date: Date) => {
    return dayjs(date).isSame(dayjs(value), 'day');
  };

  // Fonction pour vérifier si une date est aujourd'hui
  const isToday = (date: Date) => {
    return dayjs(date).isSame(dayjs(), 'day');
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full relative transition-opacity duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <label className="block text-sm text-gray-500 font-medium mb-2">{t('date')}</label>
      
      {/* Sélecteur de date actuelle */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        className={`w-full text-left p-2 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center justify-between">
        <span className="text-gray-900 font-medium text-xl">
          {dayjs(value).format('D MMMM YYYY')}
        </span>
          <Calendar size={20} className="text-gray-500" />
        </div>
      </button>

      {/* Calendrier modal */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* En-tête du calendrier */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="text-sm font-medium text-gray-900">
                {dayjs(currentMonth).format('MMMM YYYY')}
              </h3>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Jours de la semaine */}
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-xs text-gray-500 font-medium text-center py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(({ date, isCurrentMonth }, index) => {
                const isSelected = isSelectedDate(date);
                const isTodayDate = isToday(date);
                
                return (
                  <button
                    key={index}
                    onClick={() => selectDate(date)}
                    className={`
                      p-2 text-xs rounded transition-colors
                      ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      ${isSelected ? 'bg-orange-500 text-white font-medium' : 'hover:bg-gray-100'}
                      ${isTodayDate ? 'ring-2 ring-orange-300' : ''}
                      ${!isCurrentMonth ? 'hover:bg-gray-50' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bouton fermer */}
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-sm text-gray-600 hover:text-gray-800 py-1 transition-colors"
            >
              Fermer
            </button>
          </div>
      </div>
      )}
    </div>
  );
};

export default DateCard; 
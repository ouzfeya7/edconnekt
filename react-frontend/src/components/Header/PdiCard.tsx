import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface PdiCardProps {
  value: string;
  onChange?: (value: string) => void;
}

const PdiCard: React.FC<PdiCardProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fonction pour obtenir la semaine actuelle à partir de la valeur
  const getCurrentWeek = () => {
    const weekNumber = parseInt(value.replace('semaine-', ''));
    const startDate = new Date(2024, 8, 2); // 2 Septembre 2024
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    return targetDate;
  };

  // Fonction pour obtenir le numéro de semaine à partir d'une date
  const getWeekNumber = (date: Date) => {
    const startDate = new Date(2024, 8, 2); // 2 Septembre 2024
    const diffTime = date.getTime() - startDate.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, Math.min(52, diffWeeks + 1));
  };

  // Fonction pour obtenir les dates d'une semaine scolaire (lundi-vendredi)
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    // Lundi = 1, Mardi = 2, ..., Dimanche = 0
    const mondayOffset = day === 0 ? -6 : 1 - day; // Si dimanche, aller au lundi suivant
    startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);
    
    const weekDates = [];
    // Générer seulement 5 jours (lundi à vendredi)
    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

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

  // Fonction pour sélectionner une semaine
  const selectWeek = (date: Date) => {
    const weekNumber = getWeekNumber(date);
    const weekValue = `semaine-${weekNumber}`;
    if (onChange) {
      onChange(weekValue);
    }
    setIsOpen(false);
  };

  // Fonction pour vérifier si une date est dans la semaine sélectionnée
  const isSelectedWeek = (date: Date) => {
    const currentWeekDates = getWeekDates(getCurrentWeek());
    return currentWeekDates.some(weekDate => 
      weekDate.toDateString() === date.toDateString()
    );
  };

  // Fonction pour obtenir le label de la semaine sélectionnée
  const getSelectedWeekLabel = () => {
    const currentDate = getCurrentWeek();
    const weekDates = getWeekDates(currentDate);
    const startDate = weekDates[0];
    const endDate = weekDates[4]; // Vendredi (5ème jour)
    
    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('fr-FR', { month: 'short' });
      return `${day} ${month}`;
    };

    return `Semaine ${getWeekNumber(currentDate)} (${formatDate(startDate)}-${formatDate(endDate)})`;
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full relative">
      <label className="block text-sm text-gray-500 font-medium mb-2">PDI - Semaine</label>
      
      {/* Sélecteur de semaine actuelle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-2 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-medium">{getSelectedWeekLabel()}</span>
          <Calendar size={16} className="text-gray-400" />
        </div>
      </button>

      {/* Calendrier modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* En-tête du calendrier */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="text-sm font-medium text-gray-900">
                {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Jours de la semaine */}
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className={`text-xs text-gray-500 font-medium text-center py-1 ${
                  day === 'Sam' || day === 'Dim' ? 'text-gray-300' : ''
                }`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(({ date, isCurrentMonth }, index) => {
                const isSelected = isSelectedWeek(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Samedi ou dimanche
                
                return (
                  <button
                    key={index}
                    onClick={() => !isWeekend && selectWeek(date)}
                    className={`
                      p-2 text-xs rounded transition-colors
                      ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      ${isSelected ? 'bg-orange-500 text-white font-medium' : 'hover:bg-gray-100'}
                      ${isToday ? 'ring-2 ring-orange-300' : ''}
                      ${isWeekend ? 'text-gray-300 cursor-not-allowed' : ''}
                    `}
                    disabled={isWeekend}
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
              className="w-full text-sm text-gray-600 hover:text-gray-800 py-1"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdiCard; 
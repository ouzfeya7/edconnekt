import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import { Calendar } from 'lucide-react';

interface DateCardProps {
  value: Date;
  onChange: (date: Date) => void;
}

const DateCard: React.FC<DateCardProps> = ({ value, onChange }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  const toInputFormat = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Vérifie si la date est valide avant de la traiter
    if (e.target.value) {
      const newDate = dayjs(e.target.value, 'YYYY-MM-DD').toDate();
      if (onChange) {
        onChange(newDate);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col justify-center">
      <label htmlFor="date-picker-input" className="block text-sm text-gray-500 font-medium">{t('date')}</label>
      <div className="relative mt-2 flex items-center">
        {/* L'input est stylé pour être transparent et superposé */}
        <input
          type="date"
          id="date-picker-input"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          value={toInputFormat(value)}
          onChange={handleDateChange}
        />
        {/* Le texte affiché est contrôlé manuellement */}
        <span className="text-gray-900 font-medium">
          {dayjs(value).format('D MMMM YYYY')}
        </span>
        {/* L'icône du calendrier */}
        <Calendar className="h-5 w-5 text-gray-500 ml-auto" />
      </div>
    </div>
  );
};

export default DateCard; 
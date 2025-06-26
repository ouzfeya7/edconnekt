import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

interface MonthCardProps {
  value: string;
  onChange: (month: string) => void;
  disabled?: boolean;
}

const MONTHS = [
  "Septembre", "Octobre", "Novembre", "Décembre", 
  "Janvier", "Février", "Mars", "Avril", 
  "Mai", "Juin", "Juillet", "Août"
];

const MonthCard: React.FC<MonthCardProps> = ({ value, onChange, disabled = false }) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col justify-center transition-opacity duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <label htmlFor="month-select" className="block text-sm text-gray-500 font-medium">{t('month', 'Mois')}</label>
      <div className="relative mt-2 flex items-center">
        <select
          id="month-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent text-gray-900 font-medium appearance-none focus:outline-none cursor-pointer pr-8" // pr-8 pour laisser la place à l'icône
        >
          {MONTHS.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <Calendar className="h-5 w-5 text-gray-500 ml-auto absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default MonthCard; 
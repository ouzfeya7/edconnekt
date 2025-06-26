import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DevoirCardProps {
  id: string;
  title: string;
  subject: string;
  startDate: string;
  endDate: string;
  submitted: number;
  notSubmitted: number;
}

const DevoirCard: React.FC<DevoirCardProps> = ({ id, title, subject, startDate, endDate, submitted, notSubmitted }) => {
  const { t } = useTranslation();
  const total = submitted + notSubmitted;
  const submittedPercentage = total > 0 ? (submitted / total) * 100 : 0;
  const notSubmittedPercentage = total > 0 ? (notSubmitted / total) * 100 : 0;

  return (
    <Link to={`/devoirs/${id}`} className="block h-full">
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col gap-4 relative overflow-hidden h-full hover:shadow-lg transition-shadow duration-200">
        {/* Content */}
        <div className="flex flex-col">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <p className="text-md text-gray-500 mt-1">{subject}</p>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={20} className="text-gray-400" />
            <span>{startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-red-500 font-semibold">
            <PieChart size={20} className="text-pink-400" />
            <span>{endDate}</span>
          </div>
        </div>

        <div className="flex justify-start items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-sm">
              {String(submitted).padStart(2, '0')}
            </span>
            <span className="text-gray-600 font-medium">{t('submitted', 'Soumis')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm">
              {String(notSubmitted).padStart(2, '0')}
            </span>
            <span className="text-gray-600 font-medium">{t('not_submitted', 'Non soumis')}</span>
          </div>
        </div>

        {/* Progress Bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          <div className="bg-slate-700 h-full" style={{ width: `${submittedPercentage}%` }}></div>
          <div className="bg-orange-500 h-full" style={{ width: `${notSubmittedPercentage}%` }}></div>
        </div>
      </div>
    </Link>
  );
};

export default DevoirCard; 
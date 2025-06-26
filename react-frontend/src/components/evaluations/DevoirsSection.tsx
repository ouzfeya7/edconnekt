import React from 'react';
import { useTranslation } from 'react-i18next';
import DevoirCard from './DevoirCard';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface Devoir {
  id: string;
  title: string;
  subject: string;
  startDate: string;
  endDate: string;
  submitted: number;
  notSubmitted: number;
}

interface DevoirsSectionProps {
  devoirs: Devoir[];
}

const DevoirsSection: React.FC<DevoirsSectionProps> = ({ devoirs }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  dayjs.locale(i18n.language);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{t('homework_to_do', 'Devoirs à faire')}</h2>
        <button 
          onClick={() => navigate('/devoirs')}
          className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
        >
          {t('see_all', 'Voir tout')}
        </button>
      </div>
      <div className="border-b border-gray-200 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devoirs.map((devoir) => (
          <DevoirCard key={devoir.id} {...devoir} />
        ))}
      </div>
    </div>
  );
};

export default DevoirsSection; 
import React from 'react';
import { useTranslation } from 'react-i18next';

interface AverageItemProps {
  trimester: number;
  score?: number; // Changé en nombre pour le pourcentage
  isAvailable: boolean;
}

const AverageItem: React.FC<AverageItemProps> = ({ trimester, score, isAvailable }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#184867] text-white p-4 rounded-xl flex items-center space-x-4">
      <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg text-white flex-shrink-0">
        T{trimester}
      </div>
      <div>
        <p className="font-bold text-base">{t('trimester', 'Trimestre')} {trimester}</p>
        {isAvailable && score !== undefined ? (
          <p className="text-sm">{score}%</p>
        ) : (
          <p className="text-sm text-gray-300">{t('not_available', 'Non disponible')}</p>
        )}
      </div>
    </div>
  );
};

const mockAverages = [
    { trimester: 1, score: 96, isAvailable: true },
    { trimester: 2, isAvailable: false },
    { trimester: 3, isAvailable: false },
];

const TrimesterAverages: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{t('trimester_average', 'Moyenne Trimestrielle')}</h3>
      <div className="space-y-3">
        {mockAverages.map(avg => (
          <AverageItem key={avg.trimester} {...avg} />
        ))}
      </div>
    </div>
  );
};

export default TrimesterAverages; 
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StudentNote } from '../../lib/notes-data';

interface ChildAverageCardProps {
  selectedChild: StudentNote | null;
}

const ChildAverageCard: React.FC<ChildAverageCardProps> = ({ selectedChild }) => {
  const { t } = useTranslation();

  if (!selectedChild) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-center h-full border border-gray-200">
        <div>
          <p className="text-sm text-gray-500">{t('general_average', 'Moyenne Générale')}</p>
          <p className="text-xl text-gray-400">-</p>
        </div>
      </div>
    );
  }

  // Calculer la moyenne générale à partir des notes
  const numericNotes = Object.values(selectedChild.notes).filter(note => typeof note === 'number') as number[];
  const average = numericNotes.length > 0 
    ? Math.round(numericNotes.reduce((sum, note) => sum + note, 0) / numericNotes.length)
    : 0;

  // Simuler une évolution (en réalité, cela viendrait des données historiques)
  const getEvolution = (avg: number) => {
    if (avg >= 85) return { value: 3, trend: 'up' };
    if (avg >= 70) return { value: 1, trend: 'up' };
    if (avg >= 50) return { value: -1, trend: 'down' };
    return { value: -5, trend: 'down' };
  };

  const evolution = getEvolution(average);

  // Déterminer la couleur selon la performance
  const getPerformanceColor = (avg: number) => {
    if (avg >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (avg >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (avg >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const performanceStyle = getPerformanceColor(average);

  const renderTrendIcon = () => {
    if (evolution.trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (evolution.trend === 'down') {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm flex flex-col justify-center h-full border ${performanceStyle.includes('border') ? performanceStyle.split(' ').pop() : 'border-gray-200'}`}>
      <div>
        <p className="text-sm text-gray-500">{t('general_average', 'Moyenne Générale')}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-2">
            <span className={`text-xl font-semibold ${performanceStyle.split(' ')[0]}`}>
              {average}%
            </span>
            <div className="flex items-center space-x-1">
              {renderTrendIcon()}
              <span className={`text-sm ${evolution.trend === 'up' ? 'text-green-500' : evolution.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                {evolution.value > 0 ? `+${evolution.value}%` : `${evolution.value}%`}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {numericNotes.length} {t('skills_evaluated', 'compétences évaluées')}
        </p>
      </div>
    </div>
  );
};

export default ChildAverageCard; 
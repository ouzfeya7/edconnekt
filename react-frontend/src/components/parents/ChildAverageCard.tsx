import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StudentNote } from '../../lib/notes-data';

interface ChildAverageCardProps {
  selectedChild: StudentNote | null;
  evaluationType?: string; // Nouveau prop pour le type d'évaluation
  currentTrimester?: string; // Nouveau prop pour le trimestre actuel
}

const ChildAverageCard: React.FC<ChildAverageCardProps> = ({ 
  selectedChild, 
  evaluationType = 'Continue',
  currentTrimester = 'Trimestre 1'
}) => {
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

  // Fonction pour extraire le numéro de trimestre
  const extractTrimesterNumber = (trimester: string): number => {
    const match = trimester.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  };

  // Calculer la moyenne selon le type d'évaluation
  const calculateAverage = () => {
    if (evaluationType === 'Trimestrielle') {
      // Pour l'évaluation trimestrielle, utiliser les données de progression trimestrielle
      if (selectedChild.progression?.byEvaluationType?.trimestrielle) {
        const trimesterNumber = extractTrimesterNumber(currentTrimester);
        const trimesterData = selectedChild.progression.byEvaluationType.trimestrielle.find(
          t => t.date === `Trim ${trimesterNumber}`
        );
        return trimesterData ? Math.round(trimesterData.progression) : 0;
      }
      return 0;
    } else if (evaluationType === 'Continue') {
      // Pour l'évaluation continue, utiliser la dernière progression de la semaine
      if (selectedChild.progression?.byEvaluationType?.continue) {
        const continueData = selectedChild.progression.byEvaluationType.continue;
        if (continueData.length > 0) {
          const latest = continueData[continueData.length - 1];
          return Math.round(latest.progression);
        }
      }
      // Fallback vers moyenne générale
      const numericNotes = Object.values(selectedChild.notes).filter(note => typeof note === 'number') as number[];
      return numericNotes.length > 0 
        ? Math.round(numericNotes.reduce((sum, note) => sum + note, 0) / numericNotes.length)
        : 0;
    } else if (evaluationType === 'Intégration') {
      // Pour l'évaluation d'intégration, utiliser la dernière progression mensuelle
      if (selectedChild.progression?.byEvaluationType?.integration) {
        const integrationData = selectedChild.progression.byEvaluationType.integration;
        if (integrationData.length > 0) {
          const latest = integrationData[integrationData.length - 1];
          return Math.round(latest.progression);
        }
      }
      // Fallback vers moyenne générale
      const numericNotes = Object.values(selectedChild.notes).filter(note => typeof note === 'number') as number[];
      return numericNotes.length > 0 
        ? Math.round(numericNotes.reduce((sum, note) => sum + note, 0) / numericNotes.length)
        : 0;
    } else {
      // Fallback par défaut : utiliser la moyenne générale
      const numericNotes = Object.values(selectedChild.notes).filter(note => typeof note === 'number') as number[];
      return numericNotes.length > 0 
        ? Math.round(numericNotes.reduce((sum, note) => sum + note, 0) / numericNotes.length)
        : 0;
    }
  };

  const average = calculateAverage();

  // Calculer le nombre de compétences évaluées selon le type
  const getCompetencesCount = () => {
    if (evaluationType === 'Trimestrielle') {
      // Pour trimestrielle, compter les matières disponibles pour le trimestre
      const trimesterNumber = extractTrimesterNumber(currentTrimester);
      if (selectedChild.progression?.byEvaluationType?.trimestrielle) {
        const trimesterData = selectedChild.progression.byEvaluationType.trimestrielle.find(
          t => t.date === `Trim ${trimesterNumber}`
        );
        return trimesterData ? 1 : 0; // Une moyenne trimestrielle globale
      }
      return 0;
    } else if (evaluationType === 'Continue') {
      // Pour continue, compter les évaluations de la semaine
      if (selectedChild.progression?.byEvaluationType?.continue) {
        return selectedChild.progression.byEvaluationType.continue.length;
      }
      // Fallback vers notes numériques
      const numericNotes = Object.values(selectedChild.notes).filter(note => typeof note === 'number') as number[];
      return numericNotes.length;
    } else if (evaluationType === 'Intégration') {
      // Pour intégration, compter les évaluations mensuelles
      if (selectedChild.progression?.byEvaluationType?.integration) {
        return selectedChild.progression.byEvaluationType.integration.length;
      }
      // Fallback vers notes numériques
      const numericNotes = Object.values(selectedChild.notes).filter(note => typeof note === 'number') as number[];
      return numericNotes.length;
    } else {
      // Pour les autres types, compter les notes numériques
      const numericNotes = Object.values(selectedChild.notes).filter(note => typeof note === 'number') as number[];
      return numericNotes.length;
    }
  };

  const competencesCount = getCompetencesCount();

  // Calculer l'évolution basée sur les vraies données historiques
  const getEvolution = () => {
    if (evaluationType === 'Trimestrielle' && selectedChild.progression?.byEvaluationType?.trimestrielle) {
      const trimesterNumber = extractTrimesterNumber(currentTrimester);
      const trimesterData = selectedChild.progression.byEvaluationType.trimestrielle;
      const currentIndex = trimesterData.findIndex(t => t.date === `Trim ${trimesterNumber}`);
      
      if (currentIndex > 0) {
        const current = trimesterData[currentIndex].progression;
        const previous = trimesterData[currentIndex - 1].progression;
        const change = current - previous;
        return {
          value: Math.round(change),
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        };
      }
    } else if (evaluationType === 'Continue' && selectedChild.progression?.byEvaluationType?.continue) {
      const continueData = selectedChild.progression.byEvaluationType.continue;
      if (continueData.length >= 2) {
        const current = continueData[continueData.length - 1].progression;
        const previous = continueData[continueData.length - 2].progression;
        const change = current - previous;
        return {
          value: Math.round(change),
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        };
      }
    } else if (evaluationType === 'Intégration' && selectedChild.progression?.byEvaluationType?.integration) {
      const integrationData = selectedChild.progression.byEvaluationType.integration;
      if (integrationData.length >= 2) {
        const current = integrationData[integrationData.length - 1].progression;
        const previous = integrationData[integrationData.length - 2].progression;
        const change = current - previous;
        return {
          value: Math.round(change),
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        };
      }
    }
    
    // Fallback: pas de données de comparaison disponibles
    return { value: 0, trend: 'stable' };
  };

  const evolution = getEvolution();

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

  // Déterminer le libellé selon le type d'évaluation
  const getAverageLabel = () => {
    if (evaluationType === 'Trimestrielle') {
      return t('trimester_average', 'Moyenne Trimestrielle');
    } else if (evaluationType === 'Continue') {
      return t('continuous_average', 'Moyenne Continue');
    } else if (evaluationType === 'Intégration') {
      return t('integration_average', 'Moyenne Intégration');
    }
    return t('general_average', 'Moyenne Générale');
  };

  const getCompetencesLabel = () => {
    if (evaluationType === 'Trimestrielle') {
      return competencesCount > 0 ? t('trimester_evaluated', 'trimestre évalué') : t('no_trimester_data', 'aucune donnée');
    } else if (evaluationType === 'Continue') {
      return `${competencesCount} ${t('daily_evaluations', 'évaluations journalières')}`;
    } else if (evaluationType === 'Intégration') {
      return `${competencesCount} ${t('monthly_evaluations', 'évaluations mensuelles')}`;
    }
    return `${competencesCount} ${t('skills_evaluated', 'compétences évaluées')}`;
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm flex flex-col justify-center h-full border ${performanceStyle.includes('border') ? performanceStyle.split(' ').pop() : 'border-gray-200'}`}>
      <div>
        <p className="text-sm text-gray-500">{getAverageLabel()}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-2">
            <span className={`text-xl font-semibold ${performanceStyle.split(' ')[0]}`}>
              {average > 0 ? `${average}%` : '-'}
            </span>
            {average > 0 && (
              <div className="flex items-center space-x-1">
                {renderTrendIcon()}
                <span className={`text-sm ${evolution.trend === 'up' ? 'text-green-500' : evolution.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                  {evolution.value > 0 ? `+${evolution.value}%` : evolution.value < 0 ? `${evolution.value}%` : '0%'}
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {getCompetencesLabel()}
        </p>
      </div>
    </div>
  );
};

export default ChildAverageCard; 
import React from 'react';
import { useTranslation } from 'react-i18next';
import RadarChart from '../charts/RadarChart';
import { TrimesterReport } from '../../lib/mock-report-data';
import { BarChart3, TrendingUp } from 'lucide-react';

interface PerformanceRadarProps {
  report: TrimesterReport;
}

const PerformanceRadar: React.FC<PerformanceRadarProps> = ({ report }) => {
  const { t } = useTranslation();

  // Transformer les données du rapport en format radar
  const radarData = report.subjects.map(subject => ({
    subject: subject.subject,
    score: subject.average
  }));

  // Calculer les statistiques
  const averageScore = radarData.reduce((sum, item) => sum + item.score, 0) / radarData.length;
  const maxScore = Math.max(...radarData.map(item => item.score));
  const minScore = Math.min(...radarData.map(item => item.score));
  const bestSubject = radarData.find(item => item.score === maxScore);
  const weakestSubject = radarData.find(item => item.score === minScore);

  // Déterminer le niveau global
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: 'Très Bien Réussi', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
    if (score >= 70) return { label: 'Bien Réussi', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' };
    if (score >= 50) return { label: 'Réussi', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (score >= 30) return { label: 'Peu Réussi', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { label: 'Pas Réussi', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const performanceLevel = getPerformanceLevel(averageScore);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('performance_radar', 'Vue d\'ensemble des performances')}</h3>
              <p className="text-sm text-gray-600">{t('radar_description', 'Analyse visuelle par matière')}</p>
            </div>
          </div>
          
          {/* Badge de niveau global */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${performanceLevel.bg} ${performanceLevel.color} ${performanceLevel.border}`}>
            <TrendingUp className="w-4 h-4" />
            {performanceLevel.label}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique radar */}
          <div className="lg:col-span-2 flex justify-center items-center">
            <RadarChart data={radarData} size={380} />
          </div>

          {/* Statistiques et insights */}
          <div className="space-y-4">
            {/* Moyenne générale */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="text-sm font-medium text-gray-600 mb-1">{t('overall_average', 'Moyenne générale')}</div>
              <div className={`text-2xl font-bold ${performanceLevel.color}`}>
                {averageScore.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {radarData.length} matière{radarData.length > 1 ? 's' : ''} évaluée{radarData.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Point fort */}
            {bestSubject && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm font-medium text-green-800 mb-1">{t('strongest_subject', 'Point fort')}</div>
                <div className="text-lg font-bold text-green-700">{bestSubject.subject}</div>
                <div className="text-sm text-green-600">{bestSubject.score}%</div>
              </div>
            )}

            {/* À améliorer */}
            {weakestSubject && weakestSubject.score !== maxScore && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-sm font-medium text-orange-800 mb-1">{t('area_to_improve', 'À renforcer')}</div>
                <div className="text-lg font-bold text-orange-700">{weakestSubject.subject}</div>
                <div className="text-sm text-orange-600">{weakestSubject.score}%</div>
              </div>
            )}

            {/* Écart de performance */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm font-medium text-blue-800 mb-1">{t('performance_gap', 'Écart de performance')}</div>
              <div className="text-lg font-bold text-blue-700">{(maxScore - minScore).toFixed(1)} pts</div>
              <div className="text-xs text-blue-600 mt-1">
                Entre la meilleure et la moins bonne matière
              </div>
            </div>

            {/* Recommandation */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-sm font-medium text-purple-800 mb-2">{t('recommendation', 'Recommandation')}</div>
              <div className="text-sm text-purple-700">
                {averageScore >= 80 
                  ? "Excellent travail ! Maintenir ce niveau et approfondir les apprentissages." 
                  : averageScore >= 60 
                  ? "Bons résultats. Focus sur les matières à renforcer pour progresser."
                  : "Accompagnement personnalisé recommandé pour consolider les bases."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRadar; 
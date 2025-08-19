import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';

// Données mockées enrichies par niveau
const levelStats = [
  {
    niveau: '6ème',
    classes: 4,
    eleves: 120,
    moyenne: 13.8,
    tauxPresence: 96.2,
    alertes: 8,
    tendance: '+2.1%'
  },
  {
    niveau: '5ème',
    classes: 4,
    eleves: 118,
    moyenne: 14.1,
    tauxPresence: 95.8,
    alertes: 12,
    tendance: '+1.5%'
  },
  {
    niveau: '4ème',
    classes: 4,
    eleves: 115,
    moyenne: 13.9,
    tauxPresence: 94.5,
    alertes: 15,
    tendance: '-0.8%'
  },
  {
    niveau: '3ème',
    classes: 4,
    eleves: 112,
    moyenne: 14.3,
    tauxPresence: 96.8,
    alertes: 10,
    tendance: '+3.2%'
  }
];

interface LevelStatsProps {
  className?: string;
}

const LevelStats: React.FC<LevelStatsProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  const getTendanceColor = (tendance: string) => {
    return tendance.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  const getTendanceIcon = (tendance: string) => {
    return tendance.startsWith('+') ? '↗' : '↘';
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {t('level_statistics', 'Statistiques par niveau')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {levelStats.map((level) => (
          <div key={level.niveau} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 text-lg">{level.niveau}</h4>
              <span className={`text-sm font-medium ${getTendanceColor(level.tendance)}`}>
                {getTendanceIcon(level.tendance)} {level.tendance}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {t('students', 'Élèves')}
                </div>
                <span className="font-semibold">{level.eleves}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('classes', 'Classes')}
                </div>
                <span className="font-semibold">{level.classes}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t('average', 'Moyenne')}
                </div>
                <span className="font-semibold text-blue-600">{level.moyenne}/20</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {t('attendance_rate', 'Présence')}
                </div>
                <span className="font-semibold text-green-600">{level.tauxPresence}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {t('alerts', 'Alertes')}
                </div>
                <span className="font-semibold text-red-600">{level.alertes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelStats;

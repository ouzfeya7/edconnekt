import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, TrendingUp } from 'lucide-react';
import { StudentNote } from '../../lib/notes-data';

interface AverageItemProps {
  trimester: number;
  score?: number;
  isAvailable: boolean;
}

interface TrimesterAveragesProps {
  selectedChild?: StudentNote | null;
}

const AverageItem: React.FC<AverageItemProps> = ({ trimester, score, isAvailable }) => {
  const { t } = useTranslation();
  
  // Fonction pour déterminer les couleurs selon le score
  const getColorScheme = (score?: number) => {
    if (!isAvailable || score === undefined) {
      return {
        bgGradient: 'from-gray-100 to-gray-200',
        circleGradient: 'from-gray-400 to-gray-500',
        textColor: 'text-gray-600',
        borderColor: 'border-gray-300'
      };
    }
    
    if (score >= 90) {
      return {
        bgGradient: 'from-green-50 to-emerald-100',
        circleGradient: 'from-green-600 to-emerald-700',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    } else if (score >= 70) {
      return {
        bgGradient: 'from-green-50 to-green-100',
        circleGradient: 'from-green-500 to-green-600',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      };
    } else if (score >= 50) {
      return {
        bgGradient: 'from-yellow-50 to-amber-100',
        circleGradient: 'from-yellow-500 to-amber-600',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
      };
    } else if (score >= 30) {
      return {
        bgGradient: 'from-orange-50 to-orange-100',
        circleGradient: 'from-orange-500 to-orange-600',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200'
      };
    } else {
      return {
        bgGradient: 'from-red-50 to-red-100',
        circleGradient: 'from-red-500 to-red-600',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      };
    }
  };

  const colorScheme = getColorScheme(score);

  return (
    <div className={`bg-gradient-to-r ${colorScheme.bgGradient} border ${colorScheme.borderColor} rounded-2xl p-3`}>
      <div className="flex items-center space-x-3">
        {/* Circle avec gradient */}
        <div className={`bg-gradient-to-br ${colorScheme.circleGradient} rounded-full w-12 h-12 flex items-center justify-center font-bold text-base text-white flex-shrink-0 shadow-lg ring-2 ring-white/50`}>
          T{trimester}
        </div>
        
        {/* Contenu textuel */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className={`font-bold text-base ${colorScheme.textColor}`}>
              {t('trimester', 'Trimestre')} {trimester}
            </p>
            {isAvailable && score !== undefined && (
              <TrendingUp className={`w-4 h-4 ${colorScheme.textColor}`} />
            )}
          </div>
          
          {isAvailable && score !== undefined ? (
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${colorScheme.textColor}`}>
                {score}%
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/60 ${colorScheme.textColor}`}>
                {score >= 90 ? 'Très Bien Réussi' :
                 score >= 70 ? 'Bien Réussi' :
                 score >= 50 ? 'Réussi' :
                 score >= 30 ? 'Peu Réussi' : 'Pas Réussi'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500 font-medium">
                {t('not_available', 'Non disponible')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrimesterAverages: React.FC<TrimesterAveragesProps> = ({ selectedChild }) => {
  const { t } = useTranslation();

  // Fonction pour calculer la moyenne trimestrielle à partir des données de progression
  const calculateTrimesterAverages = () => {
    if (!selectedChild || !selectedChild.progression?.byEvaluationType?.trimestrielle) {
      // Si pas de données, retourner les moyennes par défaut basées sur les notes actuelles
      if (selectedChild?.notes) {
        const numericNotes = Object.values(selectedChild.notes).filter(note => typeof note === 'number') as number[];
        const currentAverage = numericNotes.length > 0 
          ? Math.round(numericNotes.reduce((sum, note) => sum + note, 0) / numericNotes.length)
          : 0;
        
        return [
          { trimester: 1, score: currentAverage, isAvailable: true },
          { trimester: 2, isAvailable: false },
          { trimester: 3, isAvailable: false },
        ];
      }
      
      // Données par défaut si aucun enfant sélectionné
      return [
        { trimester: 1, isAvailable: false },
        { trimester: 2, isAvailable: false },
        { trimester: 3, isAvailable: false },
      ];
    }

    // Utiliser les données de progression trimestrielle
    const trimesterData = selectedChild.progression.byEvaluationType.trimestrielle;
    
    return [1, 2, 3].map(trimesterNum => {
      const data = trimesterData.find(t => t.date === `Trim ${trimesterNum}`);
      return {
        trimester: trimesterNum,
        score: data ? Math.round(data.progression) : undefined,
        isAvailable: !!data
      };
    });
  };

  const averagesData = calculateTrimesterAverages();
  
  // Calculer le nombre de trimestres disponibles pour l'indicateur de progression
  const availableTrimesters = averagesData.filter(avg => avg.isAvailable).length;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-full">
      {/* En-tête avec icône */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {t('trimester_average', 'Moyenne Trimestrielle')}
          </h3>
          <p className="text-sm text-gray-600">
            {selectedChild 
              ? `${selectedChild.firstName} ${selectedChild.lastName}`
              : t('academic_year_progress', 'Progression de l\'année scolaire')
            }
          </p>
        </div>
      </div>
      
      {/* Liste des trimestres */}
      <div className="space-y-3">
        {averagesData.map((avg) => (
          <AverageItem key={avg.trimester} {...avg} />
        ))}
      </div>
      
      {/* Indicateur de progression globale */}
      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Progression annuelle</span>
          <span className="text-emerald-700 font-bold">{availableTrimesters}/3 Trimestres</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
            style={{ width: `${(availableTrimesters / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TrimesterAverages; 
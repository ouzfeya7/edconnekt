import React from 'react';
import { Calendar, TrendingUp, Clock, Award, Target } from 'lucide-react';

interface TrimestrielleCardProps {
  competence: {
    id: string;
    label: string;
  };
  note: number | 'absent' | 'non-evalue';
  evaluationType?: string;
  trimestre?: string;
}

const TrimestrielleCard: React.FC<TrimestrielleCardProps> = ({ 
  competence, 
  note, 
  evaluationType = "Évaluation trimestrielle",
  trimestre = "T1"
}) => {
  // Déterminer le style de la carte
  const getCardStyle = () => {
    if (note === 'absent') return 'bg-gray-50 border-gray-200 border';
    if (note === 'non-evalue') return 'bg-blue-50 border-blue-200 border';
    if (typeof note === 'number') {
      if (note >= 75) return 'bg-green-50 border-green-200 border';
      if (note >= 50) return 'bg-orange-50 border-orange-200 border';
      return 'bg-red-50 border-red-200 border';
    }
    return 'bg-gray-50 border-gray-200 border';
  };

  // Déterminer l'icône de statut
  const getStatusIcon = () => {
    if (note === 'absent') return <Clock className="w-5 h-5 text-gray-500" />;
    if (note === 'non-evalue') return <Clock className="w-5 h-5 text-blue-500" />;
    if (typeof note === 'number') {
      if (note >= 75) return <Award className="w-5 h-5 text-green-600" />;
      if (note >= 50) return <TrendingUp className="w-5 h-5 text-orange-600" />;
      return <Target className="w-5 h-5 text-red-600" />;
    }
    return <Clock className="w-5 h-5 text-gray-500" />;
  };

  // Déterminer le texte d'affichage
  const getDisplayText = () => {
    if (note === 'absent') return 'Absent';
    if (note === 'non-evalue') return 'Non évalué';
    if (typeof note === 'number') return `${note}%`;
    return '-';
  };

  // Déterminer le libellé du statut avec emoji
  const getStatusLabel = () => {
    if (note === 'absent') return '⏰ Absent';
    if (note === 'non-evalue') return '⏳ En attente';
    if (typeof note === 'number') {
      if (note >= 75) return '🎉 Excellent';
      if (note >= 50) return '📈 En progrès';
      return '💪 À renforcer';
    }
    return '❓ Non évalué';
  };

  // Déterminer la couleur du texte principal
  const getTextColor = () => {
    if (note === 'absent' || note === 'non-evalue') return 'text-gray-600';
    if (typeof note === 'number') {
      if (note >= 75) return 'text-green-700';
      if (note >= 50) return 'text-orange-700';
      return 'text-red-700';
    }
    return 'text-gray-600';
  };

  return (
    <div className={`rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:scale-102 ${getCardStyle()}`}>
              {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon()}
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {evaluationType}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {competence.label}
          </h3>
          <p className="text-xs text-gray-500">
            {trimestre} • Bilan trimestriel
          </p>
        </div>
      </div>

      {/* Section principale de la note */}
              <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`text-3xl font-bold ${getTextColor()}`}>
            {getDisplayText()}
                  </div>
          <div className="text-sm">
            <div className="text-gray-500 text-xs mb-1">Bilan</div>
            <div className={`font-semibold ${getTextColor()}`}>
              {getStatusLabel()}
                  </div>
                </div>
                </div>
              </div>

      {/* Barre de progression et détails */}
      <div className="space-y-3">
        {typeof note === 'number' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Performance</span>
              <span>{note}%</span>
                      </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  note >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                  note >= 50 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 
                  'bg-gradient-to-r from-red-500 to-rose-500'
                }`}
                style={{ width: `${Math.min(note, 100)}%` }}
              />
                      </div>
                    </div>
                  )}

        {/* Badge de niveau */}
        <div className="flex justify-end">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            typeof note === 'number' ? 
              note >= 75 ? 'bg-green-100 text-green-800' :
              note >= 50 ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-600'
          }`}>
            {typeof note === 'number' ? 
              note >= 75 ? 'Validé' :
              note >= 50 ? 'En cours' :
              'À consolider'
            : note === 'absent' ? 'Absent' : 'En attente'}
          </span>
                        </div>
                        </div>
                      </div>
  );
};

interface StudentTrimestrielleCardsProps {
  competences: Array<{
    id: string;
    label: string;
  }>;
  notes: { [competenceId: string]: number | 'absent' | 'non-evalue' };
  subjectName: string;
  trimestre: string;
}

const StudentTrimestrielleCards: React.FC<StudentTrimestrielleCardsProps> = ({ 
  competences, 
  notes, 
  subjectName,
  trimestre 
}) => {
  // Vérifier si competences existe et est un array
  if (!competences || !Array.isArray(competences) || competences.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
          <Calendar className="w-full h-full" />
                        </div>
        <p className="text-gray-500 text-lg">Aucune compétence trimestrielle disponible</p>
        <p className="text-gray-400 text-sm mt-1">pour cette matière.</p>
                      </div>
    );
  }

  // Calculer les statistiques pour la matière active
  const totalCompetences = competences.length;
  const notesNumeriques = competences
    .map(c => notes[c.id])
    .filter(note => typeof note === 'number') as number[];
  
  const moyenne = notesNumeriques.length > 0 
    ? notesNumeriques.reduce((sum, note) => sum + note, 0) / notesNumeriques.length 
    : 0;

  const competencesEvaluees = notesNumeriques.length;
  const competencesValidees = notesNumeriques.filter(note => note >= 50).length;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques pour la matière active */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{subjectName}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Évaluations trimestrielles • {trimestre}
            </p>
                      </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {moyenne > 0 ? `${moyenne.toFixed(1)}%` : '-'}
                    </div>
            <div className="text-xs text-gray-500">Moyenne</div>
                      </div>
                    </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-lg font-semibold text-gray-900">{totalCompetences}</div>
            <div className="text-xs text-gray-500">Compétences</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-lg font-semibold text-purple-600">{competencesEvaluees}</div>
            <div className="text-xs text-gray-500">Évaluées</div>
                  </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-lg font-semibold text-green-600">{competencesValidees}</div>
            <div className="text-xs text-gray-500">Validées</div>
                </div>
                </div>
            </div>

      {/* Grille de cartes des compétences */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {competences.map((competence) => (
          <TrimestrielleCard
            key={competence.id}
            competence={competence}
            note={notes[competence.id]}
            evaluationType="Trimestrielle"
            trimestre={trimestre}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentTrimestrielleCards; 
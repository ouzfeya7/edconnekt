import React, { useState, useMemo } from 'react';
import { getGradingStatus } from '../../lib/notes-data';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

interface CompetenceCardProps {
  competence: {
    id: string;
    label: string;
  };
  note: number | 'absent' | 'non-evalue';
  weekNumber?: number;
  evaluationDate?: string;
}

const CompetenceCard: React.FC<CompetenceCardProps> = ({ 
  competence, 
  note, 
  weekNumber = 1,
  evaluationDate = "12/05/2025" 
}) => {
  const status = getGradingStatus(note);
  
  // Déterminer la couleur de bordure basée sur la note (fond blanc)
  const getBackgroundColor = () => {
    if (note === 'absent' || note === 'non-evalue') return 'bg-white border-gray-200';
    if (typeof note === 'number') {
      if (note >= 75) return 'bg-white border-green-200';
      if (note >= 50) return 'bg-white border-orange-200';
      return 'bg-white border-red-200';
    }
    return 'bg-white border-gray-200';
  };

  // Déterminer l'icône de statut
  const getStatusIcon = () => {
    if (note === 'absent') return <Clock className="w-4 h-4 text-gray-500" />;
    if (note === 'non-evalue') return <Calendar className="w-4 h-4 text-gray-500" />;
    return <TrendingUp className="w-4 h-4 text-green-600" />;
  };

  // Formater le texte d'affichage de la note
  const getDisplayText = () => {
    if (note === 'absent') return 'Absent';
    if (note === 'non-evalue') return 'Non évalué';
    if (typeof note === 'number') return `${note}%`;
    return '-';
  };

  // Déterminer le libellé du statut
  const getStatusLabel = () => {
    if (note === 'absent') return 'Absent';
    if (note === 'non-evalue') return 'En attente';
    if (typeof note === 'number') {
      if (note >= 75) return 'Excellent';
      if (note >= 50) return 'En progrès';
      return 'À améliorer';
    }
    return 'Non évalué';
  };

  return (
    <div className={`rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${getBackgroundColor()}`}>
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm leading-tight">
            {competence.label}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Semaine {weekNumber} • {evaluationDate}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
        </div>
      </div>

      {/* Score et statut */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`text-2xl font-bold ${status.color}`}>
            {getDisplayText()}
          </div>
          <div className="text-xs">
            <span className="text-gray-500">Évaluation</span>
            <div className={`font-medium ${status.color}`}>
              {getStatusLabel()}
            </div>
          </div>
        </div>
        
        {/* Indicateur de score visuel */}
        {typeof note === 'number' && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Score</span>
            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  note >= 75 ? 'bg-green-500' : 
                  note >= 50 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(note, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StudentCompetenceCardsProps {
  competences: Array<{
    id: string;
    label: string;
  }>;
  notes: { [competenceId: string]: number | 'absent' | 'non-evalue' };
  subjectName: string;
}

type FilterStatus = 'tous' | 'excellent' | 'en-progres' | 'a-ameliorer' | 'absent' | 'non-evalue';

const StudentCompetenceCards: React.FC<StudentCompetenceCardsProps> = ({ 
  competences, 
  notes, 
  subjectName 
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('tous');

  // Fonction pour déterminer le statut d'une note
  const getStatusFromNote = (note: number | 'absent' | 'non-evalue'): FilterStatus => {
    if (note === 'absent') return 'absent';
    if (note === 'non-evalue') return 'non-evalue';
    if (typeof note === 'number') {
      if (note >= 75) return 'excellent';
      if (note >= 50) return 'en-progres';
      return 'a-ameliorer';
    }
    return 'non-evalue';
  };

  // Filtrer les compétences selon le statut sélectionné
  const filteredCompetences = useMemo(() => {
    if (selectedFilter === 'tous') return competences;
    
    return competences.filter(competence => {
      const note = notes[competence.id];
      const status = getStatusFromNote(note);
      return status === selectedFilter;
    });
  }, [competences, notes, selectedFilter]);

  // Calculer les statistiques pour les filtres
  const stats = useMemo(() => {
    const statusCounts = {
      tous: competences.length,
      excellent: 0,
      'en-progres': 0,
      'a-ameliorer': 0,
      absent: 0,
      'non-evalue': 0
    };

    competences.forEach(competence => {
      const note = notes[competence.id];
      const status = getStatusFromNote(note);
      statusCounts[status]++;
    });

    return statusCounts;
  }, [competences, notes]);

  if (competences.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune compétence disponible pour cette matière.</p>
      </div>
    );
  }

  const filterOptions = [
    { key: 'tous' as FilterStatus, label: 'Tous', color: 'text-gray-600 bg-gray-100 border-gray-200' },
    { key: 'excellent' as FilterStatus, label: 'Excellent', color: 'text-green-600 bg-green-50 border-green-200' },
    { key: 'en-progres' as FilterStatus, label: 'En progrès', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { key: 'a-ameliorer' as FilterStatus, label: 'À améliorer', color: 'text-red-600 bg-red-50 border-red-200' },
    { key: 'absent' as FilterStatus, label: 'Absent', color: 'text-gray-500 bg-gray-50 border-gray-200' },
    { key: 'non-evalue' as FilterStatus, label: 'Non évalué', color: 'text-gray-500 bg-gray-50 border-gray-200' }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et filtres */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{subjectName}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {stats.tous} compétence{stats.tous > 1 ? 's' : ''} évaluée{stats.tous > 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Filtres par statut */}
        <div className="flex items-center gap-2">
          {filterOptions.map(option => {
            const count = stats[option.key];
            if (count === 0 && option.key !== 'tous') return null;
            
            const isActive = selectedFilter === option.key;
            
            return (
              <button
                key={option.key}
                onClick={() => setSelectedFilter(option.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                  isActive 
                    ? option.color + ' shadow-sm'
                    : 'text-gray-500 bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {option.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grille de cartes filtrées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompetences.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Aucune compétence trouvée pour ce filtre.</p>
          </div>
        ) : (
          filteredCompetences.map((competence, index) => (
            <CompetenceCard
              key={competence.id}
              competence={competence}
              note={notes[competence.id]}
              weekNumber={competences.indexOf(competence) + 1}
              evaluationDate="12/05/2025"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StudentCompetenceCards; 
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import CourseDetailHeader from '../../components/course/CourseDetailHeader';
import ChildSelectorCard from '../../components/parents/ChildSelectorCard';
import { studentNotesByClass, Competence } from '../../lib/notes-data';
import ClassNameCard from '../../components/Header/ClassNameCard';
import DateCard from '../../components/Header/DateCard';
import AttendanceStatusCard from '../../components/parents/AttendanceStatusCard';
import ProgressionChart from '../../components/charts/ProgressionChart';
import CompetenceSelectorModal from '../../components/parents/CompetenceSelectorModal';
import RecentEvaluations from '../../components/parents/RecentEvaluations';
import TrimesterAverages from '../../components/parents/TrimesterAverages';
import UpcomingEvents from '../../components/parents/UpcomingEvents';
import Notifications from '../../components/parents/Notifications';
import { useEvents } from '../../contexts/EventContext'; // Importer le hook des événements
import dayjs from 'dayjs';

// Données de progression fictives par type d'évaluation
const evaluationProgressData: { 
  [type: string]: { [childId: string]: { date: string; progression: number }[] } 
} = {
  continue: {
    'cp1-eleve-1': [
      { date: 'Lun', progression: 85 }, { date: 'Mar', progression: 88 }, { date: 'Mer', progression: 92 }, { date: 'Jeu', progression: 90 }, { date: 'Ven', progression: 95 },
    ],
    'cp1-eleve-2': [
      { date: 'Lun', progression: 78 }, { date: 'Mar', progression: 82 }, { date: 'Mer', progression: 80 }, { date: 'Jeu', progression: 79 }, { date: 'Ven', progression: 85 },
    ],
  },
  integration: {
    'cp1-eleve-1': [
      { date: 'Sep', progression: 75 }, { date: 'Oct', progression: 80 }, { date: 'Nov', progression: 78 }, { date: 'Déc', progression: 82 }, { date: 'Jan', progression: 85 },
    ],
    'cp1-eleve-2': [
      { date: 'Sep', progression: 68 }, { date: 'Oct', progression: 72 }, { date: 'Nov', progression: 75 }, { date: 'Déc', progression: 78 }, { date: 'Jan', progression: 77 },
    ],
  },
  trimestrielle: {
    'cp1-eleve-1': [
        { date: 'Trim 1', progression: 80 }, { date: 'Trim 2', progression: 86 }, { date: 'Trim 3', progression: 90 },
    ],
    'cp1-eleve-2': [
        { date: 'Trim 1', progression: 72 }, { date: 'Trim 2', progression: 78 }, { date: 'Trim 3', progression: 81 },
    ],
  },
};

// Nouvelles données de progression par compétence
const competenceProgressionData: { [key: string]: { [key: string]: { date: string, progression: number }[] } } = {
    'cp1-eleve-1': {
        'cp1-fr-orale': [ { date: 'Trim 1', progression: 88 }, { date: 'Trim 2', progression: 92 } ],
        'cp1-fr-vocab': [ { date: 'Trim 1', progression: 78 }, { date: 'Trim 2', progression: 84 } ],
    },
    'cp1-eleve-2': {
        'cp1-fr-orale': [ { date: 'Trim 1', progression: 70 }, { date: 'Trim 2', progression: 75 } ],
        'cp1-fr-vocab': [ { date: 'Trim 1', progression: 82 }, { date: 'Trim 2', progression: 80 } ],
    }
};

const ParentDashboard = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [evaluationType, setEvaluationType] = useState('continue');

  const parentChildren = (studentNotesByClass.cp1 || []).slice(0, 2);
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.studentId || '');
  const [selectedCompetence, setSelectedCompetence] = useState<Competence | null>(null);
  const [isCompetenceModalOpen, setIsCompetenceModalOpen] = useState(false);

  const attendanceData: { [key: string]: 'present' | 'late' | 'absent' } = {
    'cp1-eleve-1': 'present',
    'cp1-eleve-2': 'late',
  };
  
  const childStatus = attendanceData[selectedChildId] || 'unknown';

  let chartData = [];
  if (selectedCompetence && competenceProgressionData[selectedChildId]) {
      chartData = competenceProgressionData[selectedChildId][selectedCompetence.id] || [];
  } else {
      chartData = evaluationProgressData[evaluationType]?.[selectedChildId] || [];
  }

  const handleCompetenceChange = (competence: Competence) => {
    setSelectedCompetence(competence);
    setIsCompetenceModalOpen(false);
  };

  const { events } = useEvents(); // Récupérer les événements du contexte

  // Filtrer les événements pour n'afficher que ceux d'aujourd'hui
  const todayEvents = events.filter(event => 
    dayjs(event.start as string).isSame(dayjs(), 'day')
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CourseDetailHeader title={t('theme_title', 'Thème : Vivre ensemble et respecter les règles de l\'école')} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ChildSelectorCard 
            children={parentChildren} 
            selectedChildId={selectedChildId}
            onSelectChild={(id) => {
                setSelectedChildId(id);
                setSelectedCompetence(null);
            }}
        />
        <ClassNameCard className="cp1" onClassChange={() => {}} isEditable={false} />
        <DateCard value={currentDate} onChange={setCurrentDate} />
        <AttendanceStatusCard status={childStatus} />
      </div>

      {/* Nouvelle section principale avec grille */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section de la progression (2/3 de la largeur) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">{t('progression', 'Progression')}</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsCompetenceModalOpen(true)}
                className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-50"
              >
                <span>
                  {selectedCompetence ? selectedCompetence.label : t('all_competences', 'Toutes les compétences')}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {!selectedCompetence && (
                <select 
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    value={evaluationType}
                    onChange={(e) => setEvaluationType(e.target.value)}
                >
                    <option value="continue">{t('continue', 'Continue')}</option>
                    <option value="integration">{t('integration', 'Intégration')}</option>
                    <option value="trimestrielle">{t('trimestrielle', 'Trimestrielle')}</option>
                </select>
              )}
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ProgressionChart data={chartData} />
          </div>
        </div>

        {/* Section des évaluations récentes */}
        <div className="lg:col-span-1">
            <RecentEvaluations />
        </div>
      </div>
      
      {/* Nouvelle rangée pour les notifications, moyennes et évènements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
              <Notifications />
          </div>
          <div className="lg:col-span-1">
              <TrimesterAverages />
          </div>
          <div className="lg:col-span-1">
              <UpcomingEvents events={todayEvents} />
          </div>
      </div>

      <CompetenceSelectorModal
        isOpen={isCompetenceModalOpen}
        onClose={() => setIsCompetenceModalOpen(false)}
        onApply={handleCompetenceChange}
        classId="cp1"
      />
    </div>
  );
};

export default ParentDashboard; 
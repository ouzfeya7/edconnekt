import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import CourseDetailHeader from '../../components/course/CourseDetailHeader';
import ChildSelectorCard from '../../components/parents/ChildSelectorCard';
import { Competence } from '../../lib/notes-data'; // Garder seulement ce qui est nécessaire
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
import { mockParentData } from '../../lib/mock-parent-data'; // Importer les données parent

const ParentDashboard = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [evaluationType, setEvaluationType] = useState('continue');

  const parentChildren = mockParentData.children;
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.studentId || '');
  const [selectedCompetence, setSelectedCompetence] = useState<Competence | null>(null);
  const [isCompetenceModalOpen, setIsCompetenceModalOpen] = useState(false);

  const selectedChild = parentChildren.find(c => c.studentId === selectedChildId);
  const childStatus = selectedChild?.attendanceStatus || 'present';

  let chartData: { date: string; progression: number; }[] = [];
  if (selectedChild?.progression) {
    if (selectedCompetence?.id && selectedChild.progression.byCompetence) {
      chartData = selectedChild.progression.byCompetence[selectedCompetence.id] || [];
    } else if (selectedChild.progression.byEvaluationType) {
      chartData = selectedChild.progression.byEvaluationType[evaluationType] || [];
    }
  }

  const handleCompetenceChange = (competence: Competence) => {
    setSelectedCompetence(competence);
    setIsCompetenceModalOpen(false);
  };

  const { events } = useEvents(); 
  const todayEvents = events.filter(event => dayjs(event.start as string).isSame(dayjs(), 'day'));

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
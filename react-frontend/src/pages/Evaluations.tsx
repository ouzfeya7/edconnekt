import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionCard } from '../components/ui/ActionCard';
import { Plus, BarChart2, MessageSquare, Calendar } from 'lucide-react';
import DevoirsSection from '../components/evaluations/DevoirsSection';
import QuadrantChart from '../components/charts/QuadrantChart';
import ProgressionChart from '../components/charts/ProgressionChart';
import { Combobox } from '../components/ui/Combobox';
import { getStudentAssignments, StudentAssignment } from '../lib/mock-student-data';
import dayjs from 'dayjs';

const initialEvaluationData = [
  { studentName: "Fatima Fall", x: 75, y: 82 },
  { studentName: "Moussa Diop", x: 30, y: 25 },
  { studentName: "Ndeye Thiam", x: 45, y: 60 },
  { studentName: "Abdoulaye Sow", x: 85, y: 90 },
  { studentName: "Aissatou Ba", x: 20, y: 15 },
  { studentName: "Cheikh Gueye", x: 55, y: 65 },
  { studentName: "Marie Sene", x: 95, y: 92 },
  { studentName: "Jean Dupont", x: 60, y: 45 },
];

type ProgressionPoint = { date: string; progression: number };
type SkillData = { [skillName: string]: ProgressionPoint[] };
type ProgressionData = { [studentName: string]: SkillData };

const progressionDataByStudent: ProgressionData = {
  "Fatima Fall": {
    "Français": [{ date: "Trimestre 1", progression: 14 }, { date: "Trimestre 2", progression: 17 }, { date: "Trimestre 3", progression: 18 }],
    "Anglais": [{ date: "Trimestre 1", progression: 12 }, { date: "Trimestre 2", progression: 11 }, { date: "Trimestre 3", progression: 13 }],
    "Histoire": [{ date: "Trimestre 1", progression: 15 }, { date: "Trimestre 2", progression: 14 }, { date: "Trimestre 3", progression: 16 }],
  },
  "Moussa Diop": {
    "Français": [{ date: "Trimestre 1", progression: 8 }, { date: "Trimestre 2", progression: 10 }, { date: "Trimestre 3", progression: 9 }],
    "Géographie": [{ date: "Trimestre 1", progression: 15 }, { date: "Trimestre 2", progression: 12 }, { date: "Trimestre 3", progression: 11 }],
  },
  // ... (add other students if needed)
};

const studentOptions = Object.keys(progressionDataByStudent).map(name => ({ value: name, label: name }));

const transformAssignmentToDevoir = (assignment: StudentAssignment): {
  id: string;
  title: string;
  subject: string;
  startDate: string;
  endDate: string;
  submitted: number;
  notSubmitted: number;
} => ({
  id: assignment.id.toString(),
  title: assignment.title,
  subject: assignment.subject,
  startDate: dayjs().format('DD MMMM YYYY'),
  endDate: assignment.dueDate,
  submitted: Math.floor(Math.random() * 20), // Valeur fictive
  notSubmitted: 20 - Math.floor(Math.random() * 20), // Valeur fictive
});

const LegendItem = ({ color, text }: { color: string, text: string }) => (
    <div className="flex items-center space-x-2">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <span className="text-sm text-gray-600">{text}</span>
    </div>
);


const Evaluations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date('2025-06-26'));
  const [quadrantChartData, setQuadrantChartData] = useState(initialEvaluationData);

  const [selectedStudent, setSelectedStudent] = useState(studentOptions[0].value);
  const [skillOptions, setSkillOptions] = useState<{ value: string, label: string }[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [progressionChartData, setProgressionChartData] = useState<ProgressionPoint[]>([]);
  
  useEffect(() => {
    if (selectedStudent) {
        const skills = Object.keys(progressionDataByStudent[selectedStudent] || {});
        const options = skills.map(s => ({ value: s, label: s }));
        setSkillOptions(options);
        if (options.length > 0) {
            setSelectedSkill(options[0].value);
        } else {
            setSelectedSkill('');
        }
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedStudent && selectedSkill) {
      const data = progressionDataByStudent[selectedStudent]?.[selectedSkill] || [];
      setProgressionChartData(data);
    } else {
      setProgressionChartData([]);
    }
  }, [selectedStudent, selectedSkill]);

  useEffect(() => {
    // Shuffles data on date change to simulate new data
    const shuffledData = [...initialEvaluationData].sort(() => Math.random() - 0.5);
    setQuadrantChartData(shuffledData);
  }, [currentDate]);

  const actionButtons = [
    { 
      icon: <Plus className="text-orange-500" />, 
      label: t('add_assignment', 'Ajouter un devoir'), 
      onClick: () => navigate('/devoirs/creer') 
    },
    { 
      icon: <BarChart2 className="text-orange-500" />, 
      label: t('grade_management', 'Gestion des notes'), 
      onClick: () => navigate('/gestion-notes') 
    },
    { 
      icon: <MessageSquare className="text-orange-500" />, 
      label: t('new_message', 'Nouveau message'), 
      onClick: () => navigate('/messages', { state: { composeNew: true } }) 
    },
    { 
      icon: <Calendar className="text-orange-500" />, 
      label: t('add_event', 'Ajouter un événement'), 
      onClick: () => navigate('/calendar', { state: { showAddEventModal: true } }) 
    }
  ];

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* En-tête avec design moderne */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm border border-emerald-200/50 p-6">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/15 rounded-full -translate-y-14 translate-x-14"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-teal-500/15 rounded-full translate-y-10 -translate-x-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full"></div>
        
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
            {t('evaluation', 'Evaluations')}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {actionButtons.map((btn, index) => <ActionCard key={index} {...btn} />)}
      </div>

      <DevoirsSection devoirs={getStudentAssignments().slice(0, 3).map(transformAssignmentToDevoir)} />

      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('evaluation_statistics', 'Statistiques des évaluations')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quadrant Chart Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Évaluations</h3>
                  <input
                    type="date"
                    value={dayjs(currentDate).format('YYYY-MM-DD')}
                    onChange={(e) => setCurrentDate(new Date(e.target.value))}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
              </div>
              <div className="h-96 flex-grow">
                  <QuadrantChart data={quadrantChartData} />
              </div>
              <div className="flex justify-center items-center space-x-6 mt-4">
                  <LegendItem color="bg-green-500" text="Acquis" />
                  <LegendItem color="bg-red-500" text="Non acquise" />
                  <LegendItem color="bg-yellow-500" text="En cours d'acquisition" />
              </div>
          </div>

          {/* Progression Chart Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Progression des compétences</h3>
                  <div className="flex gap-2">
                      <Combobox
                          options={studentOptions}
                          value={selectedStudent}
                          onChange={setSelectedStudent}
                          placeholder="Élève"
                      />
                      <Combobox
                          options={skillOptions}
                          value={selectedSkill}
                          onChange={setSelectedSkill}
                          placeholder="Matière"
                      />
                  </div>
              </div>
              <div className="h-96 flex-grow">
                <ProgressionChart data={progressionChartData} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluations; 
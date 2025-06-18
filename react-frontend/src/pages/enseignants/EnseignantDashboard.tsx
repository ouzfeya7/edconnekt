import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import QuadrantChart from '../../components/charts/QuadrantChart';
import ProgressionChart from '../../components/charts/ProgressionChart';
import { ActionCard } from '../../components/ui/ActionCard';
import ClassHeader from '../../components/classe/ClassHeader';
import CourseDetailHeader from '../../components/course/CourseDetailHeader';
import LessonCard from '../../components/course/LessonCard';
import ProgressSteps from '../../components/ui/ProgressSteps';
import { Combobox } from '../../components/ui/Combobox';
import { mockCourses } from '../../lib/mock-data'; // Importer les données
import { useStudents } from '../../contexts/StudentContext';

// Import icons from lucide-react
import { PlusCircle, BarChart2, Mail, Calendar } from 'lucide-react';

// --- Données de Test Externalisées ---

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

// Types pour les données de progression
type ProgressionPoint = { date: string; progression: number };
type SkillData = { [skillName: string]: ProgressionPoint[] };
type ProgressionData = { [studentName: string]: SkillData };

// Données de test mises à jour pour le graphique de progression
const progressionDataByStudent: ProgressionData = {
  "Fatima Fall": {
    "Français": [{ date: "Trimestre 1", progression: 14 }, { date: "Trimestre 2", progression: 17 }, { date: "Trimestre 3", progression: 18 }],
    "Anglais": [{ date: "Trimestre 1", progression: 12 }, { date: "Trimestre 2", progression: 11 }, { date: "Trimestre 3", progression: 13 }],
    "Histoire": [{ date: "Trimestre 1", progression: 15 }, { date: "Trimestre 2", progression: 14 }, { date: "Trimestre 3", progression: 16 }],
  },
  "Moussa Diop": {
    "Français": [{ date: "Trimestre 1", progression: 8 }, { date: "Trimestre 2", progression: 10 }, { date: "Trimestre 3", progression: 9 }],
    "Géographie": [{ date: "Trimestre 1", progression: 15 }, { date: "Trimestre 2", progression: 12 }, { date: "Trimestre 3", progression: 11 }],
    "Informatique": [{ date: "Trimestre 1", progression: 18 }, { date: "Trimestre 2", progression: 16 }, { date: "Trimestre 3", progression: 17 }],
  },
  "Ndeye Thiam": { 
    "Français": [{ date: "Trimestre 1", progression: 18 }, { date: "Trimestre 2", progression: 16 }, { date: "Trimestre 3", progression: 17 }],
    "Éducation civique": [{ date: "Trimestre 1", progression: 10 }, { date: "Trimestre 2", progression: 13 }, { date: "Trimestre 3", progression: 15 }],
    "Arts plastiques": [{ date: "Trimestre 1", progression: 13 }, { date: "Trimestre 2", progression: 15 }, { date: "Trimestre 3", progression: 14 }],
  },
  "Abdoulaye Sow": { 
    "Histoire": [{ date: "Trimestre 1", progression: 11 }, { date: "Trimestre 2", progression: 14 }, { date: "Trimestre 3", progression: 15 }],
    "Géographie": [{ date: "Trimestre 1", progression: 16 }, { date: "Trimestre 2", progression: 14 }, { date: "Trimestre 3", progression: 14 }],
    "Anglais": [{ date: "Trimestre 1", progression: 9 }, { date: "Trimestre 2", progression: 12 }, { date: "Trimestre 3", progression: 14 }],
  },
  "Aissatou Ba": { 
    "Français": [{ date: "Trimestre 1", progression: 7 }, { date: "Trimestre 2", progression: 9 }, { date: "Trimestre 3", progression: 10 }],
    "Éducation physique et sportive (EPS)": [{ date: "Trimestre 1", progression: 19 }, { date: "Trimestre 2", progression: 17 }, { date: "Trimestre 3", progression: 18 }],
  },
  "Cheikh Gueye": { 
    "Français": [{ date: "Trimestre 1", progression: 16 }, { date: "Trimestre 2", progression: 14 }, { date: "Trimestre 3", progression: 12 }],
    "Informatique": [{ date: "Trimestre 1", progression: 18 }, { date: "Trimestre 2", progression: 15 }, { date: "Trimestre 3", progression: 13 }]
  },
   "Marie Sene": { 
    "Français": [{ date: "Trimestre 1", progression: 19 }, { date: "Trimestre 2", progression: 18 }, { date: "Trimestre 3", progression: 20 }],
    "Anglais": [{ date: "Trimestre 1", progression: 17 }, { date: "Trimestre 2", progression: 19 }, { date: "Trimestre 3", progression: 18 }]
  },
  "Jean Dupont": {
    "Histoire": [{ date: "Trimestre 1", progression: 12 }, { date: "Trimestre 2", progression: 15 }, { date: "Trimestre 3", progression: 14 }],
    "Géographie": [{ date: "Trimestre 1", progression: 11 }, { date: "Trimestre 2", progression: 10 }, { date: "Trimestre 3", progression: 12 }]
  },
};

const studentOptions = Object.keys(progressionDataByStudent).map(name => ({ value: name, label: name }));

const skillOptions = [
  "Français",
  "Anglais",
  "Histoire",
  "Géographie",
  "Éducation civique",
  "Arts plastiques",
  "Éducation physique et sportive (EPS)",
  "Informatique",
].map(skill => ({ value: skill, label: skill }));

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { students, studentCount } = useStudents();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartData, setChartData] = useState(initialEvaluationData);

  const [selectedStudent, setSelectedStudent] = useState(studentOptions[0].value);
  const [selectedSkill, setSelectedSkill] = useState(skillOptions[0].value);
  const [progressionChartData, setProgressionChartData] = useState<ProgressionPoint[]>([]);

  useEffect(() => {
    console.log(`Simulation de la récupération des données pour la date : ${selectedDate}`);
    const shuffledData = [...initialEvaluationData].sort(() => Math.random() - 0.5);
    setChartData(shuffledData);
  }, [selectedDate]);

  useEffect(() => {
    const data = progressionDataByStudent[selectedStudent]?.[selectedSkill] || [];
    setProgressionChartData(data);
  }, [selectedStudent, selectedSkill]);

  const actionButtons = [
    {
      icon: <PlusCircle className="text-[#FF8C00] w-5 h-5" />,
      label: t('add_course', 'Ajouter une fiche'),
      onClick: () => console.log('Add course clicked')
    },
    {
      icon: <BarChart2 className="text-[#FF8C00] w-5 h-5" />,
      label: t('manage_grades', 'Gestion des notes'),
      onClick: () => navigate('/evaluations'),
    },
    {
      icon: <Mail className="text-[#FF8C00] w-5 h-5" />,
      label: t('send_message', 'Envoyer un message'),
      onClick: () => navigate('/messages', { state: { composeNew: true } }),
    },
    {
      icon: <Calendar className="text-[#FF8C00] w-5 h-5" />,
      label: t('add_event', 'Ajouter un événement'),
      onClick: () => navigate('/calendar', { state: { showAddEventModal: true } }),
    }
  ];

  // Fonction pour formater la date en "jour Mois Année"
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F5F7FA]"> {/* Changed background to a lighter gray */}
      {/* Utiliser CourseDetailHeader */}
      <CourseDetailHeader title={t('theme_title', 'Thème : Vivre ensemble et respecter les règles de l\'école')} />

      <div className="flex-1 p-6"> {/* Removed bg-gray-50 as it's already on the parent */}
        {/* Actions buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {actionButtons.map((button, index) => (
            <ActionCard
              key={index}
              icon={button.icon}
              label={button.label}
              onClick={button.onClick}
            />
          ))}
        </div>

        {/* Filters and Stats */}
        <div className="mb-6">
          <ClassHeader 
            currentClasse="6ème A" 
            onClasseChange={() => console.log('Classe changed')}
            currentDate={formatDate(new Date())}
            onDateChange={() => console.log('Date changed')}
            studentStats={studentCount}
          />
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {mockCourses.find(c => c.id === 'mathematique')?.lessons.slice(0, 3).map((lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={t(`lesson_title_${lesson.id}`, lesson.lessonTitle)}
              subject={lesson.remediation?.subject || "N/A"}
              time={lesson.remediation?.time || "N/A"}
              teacher={lesson.remediation?.teacher || "N/A"}
              presentCount={studentCount.present}
              absentCount={studentCount.absent}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{t('evaluation', 'Evaluation')}</h3>
              
              {/* Sélecteur de date fonctionnel */}
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-2.5"
                />
              </div>
            </div>
            <div className="h-[300px]">
              <QuadrantChart data={chartData} />
            </div>
            <div className="flex gap-6 mt-6 justify-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#82D0BC]"></span> {/* Specific green color */}
                <span className="text-gray-700 text-sm">{t('acquired', 'Acquis')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F3797E]"></span> {/* Specific red color */}
                <span className="text-gray-700 text-sm">{t('not_acquired', 'Non acquise')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FDC374]"></span> {/* Specific emerald color */}
                <span className="text-gray-700 text-sm">{t('in_progress', 'En cours d\'acquisition')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{t('progression', 'Progression')}</h3>
              <div className="flex gap-4">
                <Combobox
                    options={studentOptions}
                    value={selectedStudent}
                    onChange={setSelectedStudent}
                    placeholder="Choisir un élève..."
                    searchPlaceholder="Rechercher un élève..."
                    noResultsMessage="Aucun élève trouvé."
                />
                <Combobox
                    options={skillOptions}
                    value={selectedSkill}
                    onChange={setSelectedSkill}
                    placeholder="Choisir une compétence..."
                    searchPlaceholder="Rechercher..."
                    noResultsMessage="Aucune compétence."
                />
              </div>
            </div>
            <div className="h-[300px]">
              <ProgressionChart data={progressionChartData} />
            </div>
          </div>
        </div>

        {/* PDI Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">PDI 08-13</h3> {/* Increased font size, changed color */}
            <button className="text-[#FF8C00] text-sm font-medium hover:underline">{t('view_all', 'Voir tout')}</button> {/* Specific orange color, text-sm, font-medium */}
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-gray-700 text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold">{t('skills', 'Compétences')}</th>
                  <th className="text-left p-4 font-semibold">PDI 08-13</th>
                  <th className="text-left p-4 font-semibold">{t('evaluation_date', 'Date évaluation')}</th>
                  <th className="text-left p-4 font-semibold">{t('progression', 'Progression')}</th>
                </tr>
              </thead>
              <tbody>
                {[t('reading', 'Lecture'), t('grammar', 'Grammaire'), t('spelling', 'Orthographe')].map((competence, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4">{competence}</td>
                    <td className="p-4">Trimestre 1</td>
                    <td className="p-4">2 Mars 2025</td>
                    <td className="p-4">
                    <ProgressSteps progress={75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
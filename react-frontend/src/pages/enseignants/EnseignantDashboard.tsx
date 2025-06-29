import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import QuadrantChart from '../../components/charts/QuadrantChart';
import ProgressionChart from '../../components/charts/ProgressionChart';
import { ActionCard } from '../../components/ui/ActionCard';
import ClassHeader from '../../components/classe/ClassHeader';
import CourseDetailHeader from '../../components/course/CourseDetailHeader';
import CourseCard from '../../components/course/CourseCard';
import ProgressSteps from '../../components/ui/ProgressSteps';
import { Combobox } from '../../components/ui/Combobox';
import { mockWeeklySkills, WeeklySkill } from '../../lib/mock-data';
import { useStudents } from '../../contexts/StudentContext';
import dayjs from 'dayjs';
import { useFilters } from '../../contexts/FilterContext';
import { useAuth } from '../authentification/useAuth';
import AddFicheModal, { NewFicheData } from '../../components/course/AddFicheModal';

// Import icons from lucide-react
import { Plus, BarChart2, Mail, Calendar } from 'lucide-react';

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

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { studentCount } = useStudents();
  const { 
    currentClasse, 
    setCurrentClasse, 
    currentDate, 
    setCurrentDate 
  } = useFilters();
  
  const [chartData, setChartData] = useState(initialEvaluationData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [skills, setSkills] = useState<WeeklySkill[]>([]);
  const [skillOptions, setSkillOptions] = useState<{ value: string, label: string }[]>([]);

  const [selectedStudent, setSelectedStudent] = useState(studentOptions[0].value);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [progressionChartData, setProgressionChartData] = useState<ProgressionPoint[]>([]);

  useEffect(() => {
    const skillsForClass = mockWeeklySkills
      .filter(s => s.classId === currentClasse)
      .slice(0, 4); 
    setSkills(skillsForClass);

    const availableSkills = Array.from(new Set(mockWeeklySkills
        .filter(s => s.classId === currentClasse)
        .map(s => s.subject)
      ))
      .map(subject => ({ value: subject, label: subject }));
      
    setSkillOptions(availableSkills);
    if (availableSkills.length > 0) {
      setSelectedSkill(availableSkills[0].value);
    } else {
      setSelectedSkill("");
    }
  }, [currentClasse]);

  useEffect(() => {
    console.log(`Simulation de la récupération des données pour la date : ${currentDate}`);
    const shuffledData = [...initialEvaluationData].sort(() => Math.random() - 0.5);
    setChartData(shuffledData);
  }, [currentDate]);

  useEffect(() => {
    if (selectedStudent && selectedSkill) {
    const data = progressionDataByStudent[selectedStudent]?.[selectedSkill] || [];
    setProgressionChartData(data);
    } else {
      setProgressionChartData([]);
    }
  }, [selectedStudent, selectedSkill]);

  const handleAddFiche = (data: NewFicheData) => {
    const teacherName = user ? `${user.firstName} ${user.lastName}` : t('unknown_teacher', 'Enseignant non identifié');
    const newSkill: WeeklySkill = {
      id: `skill-${Date.now()}`,
      classId: currentClasse,
        title: data.title,
        subject: data.subject,
      teacher: teacherName,
      teacherImage: "https://via.placeholder.com/40x40",
        time: data.time,
      presentCount: 0,
      absentCount: 0,
    };
    setSkills(prevSkills => [newSkill, ...prevSkills].slice(0, 4));
    setIsModalOpen(false);
  };

  const actionButtons = [
    {
      icon: <Plus className="text-orange-500" />,
      label: t('add_sheet', 'Ajouter une fiche'),
      onClick: () => setIsModalOpen(true)
    },
    {
      icon: <BarChart2 className="text-orange-500" />,
      label: t('grade_management', 'Gestion des notes'),
      onClick: () => navigate('/gestion-notes'),
    },
    {
      icon: <Mail className="text-orange-500" />,
      label: t('send_message', 'Envoyer un message'),
      onClick: () => navigate('/messages', { state: { composeNew: true } }),
    },
    {
      icon: <Calendar className="text-orange-500" />,
      label: t('add_event', 'Ajouter un événement'),
      onClick: () => navigate('/calendar', { state: { showAddEventModal: true } }),
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#F5F7FA]">
      <AddFicheModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleAddFiche}
      />
      
      {/* Header du thème - collé aux bords */}
      <CourseDetailHeader title={t('theme_title', 'Thème : Vivre ensemble et respecter les règles de l\'école')} />

      {/* Contenu principal avec padding */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          {actionButtons.map((button, index) => (
            <ActionCard
              key={index}
              icon={button.icon}
              label={button.label}
              onClick={button.onClick}
            />
          ))}
        </div>

        <div className="mb-6">
          <ClassHeader 
            currentClasse={currentClasse} 
            onClasseChange={setCurrentClasse}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            studentStats={studentCount}
          />
        </div>

        {/* Course Cards Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{t('courses_of_the_day', 'Cours du jour')}</h2>
          <button 
            onClick={() => navigate('/mes-cours')}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            {t('view_more', 'Voir Plus')}
          </button>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {skills.map((skill) => (
            <CourseCard
              key={skill.id}
              title={skill.title}
              subject={skill.subject}
              time={skill.time}
              teacher={skill.teacher}
              presentCount={skill.presentCount}
              absentCount={skill.absentCount}
              onClick={() => navigate(`/mes-cours/${skill.id}`)}
            />
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('evaluation_statistics', 'Statistiques des évaluations')}</h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{t('evaluation', 'Evaluations')}</h3>
              
              <div className="relative">
                <input
                  type="date"
                  value={dayjs(currentDate).format('YYYY-MM-DD')}
                  onChange={(e) => setCurrentDate(new Date(e.target.value))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-2.5"
                />
              </div>
            </div>
            <div className="h-[300px]">
              <QuadrantChart data={chartData} />
            </div>
            <div className="flex gap-6 mt-6 justify-center">
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#82D0BC]"></span>
                <span className="text-gray-700 text-sm">{t('acquired', 'Acquis')}</span>
              </div>
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F3797E]"></span>
                <span className="text-gray-700 text-sm">{t('not_acquired', 'Non acquise')}</span>
              </div>
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FDC374]"></span>
                <span className="text-gray-700 text-sm">{t('in_progress', 'En cours d\'acquisition')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">{t('progression_chart_title', "Progression des compétences")}</h3>
                <div className="flex gap-2">
                <Combobox
                    options={studentOptions}
                    value={selectedStudent}
                    onChange={setSelectedStudent}
                    placeholder={t('select_student', 'Élève...')}
                />
                <Combobox
                    options={skillOptions}
                    value={selectedSkill}
                    onChange={setSelectedSkill}
                    placeholder={t('select_skill', 'Matière...')}
                />
              </div>
            </div>
            <div className="h-[300px]">
              <ProgressionChart data={progressionChartData} />
              </div>
            </div>
          </div>
        </div>

        <div> 
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">PDI 08-13</h3>
            <button className="text-[#FF8C00] text-sm font-medium hover:underline cursor-pointer">{t('view_all', 'Voir tout')}</button>
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
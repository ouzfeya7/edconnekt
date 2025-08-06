 import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import QuadrantChart from '../../components/charts/QuadrantChart';
import ProgressionChart from '../../components/charts/ProgressionChart';
import { ActionCard } from '../../components/ui/ActionCard';
import ClassHeader from '../../components/classe/ClassHeader';
import CourseDetailHeader from '../../components/course/CourseDetailHeader';
import CourseCard from '../../components/course/CourseCard';
import { Combobox } from '../../components/ui/Combobox';
import { getEnrichedCourses, EnrichedCourse } from '../../lib/mock-student-data';
import { useStudents } from '../../contexts/StudentContext';
import dayjs from 'dayjs';
import { useFilters } from '../../contexts/FilterContext';
import { useAuth } from '../authentification/useAuth';
import AddFicheModal, { NewFicheData } from '../../components/course/AddFicheModal';

// Import icons from lucide-react
import { Plus, BarChart2, Mail, Calendar, Package } from 'lucide-react';

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

// Données de test mises à jour pour le graphique de progression (converties en pourcentages)
const progressionDataByStudent: ProgressionData = {
  "Fatima Fall": {
    "Français": [{ date: "Trimestre 1", progression: 70 }, { date: "Trimestre 2", progression: 85 }, { date: "Trimestre 3", progression: 90 }],
    "Anglais": [{ date: "Trimestre 1", progression: 60 }, { date: "Trimestre 2", progression: 55 }, { date: "Trimestre 3", progression: 65 }],
    "Histoire": [{ date: "Trimestre 1", progression: 75 }, { date: "Trimestre 2", progression: 70 }, { date: "Trimestre 3", progression: 80 }],
  },
  "Moussa Diop": {
    "Français": [{ date: "Trimestre 1", progression: 40 }, { date: "Trimestre 2", progression: 50 }, { date: "Trimestre 3", progression: 45 }],
    "Géographie": [{ date: "Trimestre 1", progression: 75 }, { date: "Trimestre 2", progression: 60 }, { date: "Trimestre 3", progression: 55 }],
    "Informatique": [{ date: "Trimestre 1", progression: 90 }, { date: "Trimestre 2", progression: 80 }, { date: "Trimestre 3", progression: 85 }],
  },
  "Ndeye Thiam": { 
    "Français": [{ date: "Trimestre 1", progression: 90 }, { date: "Trimestre 2", progression: 80 }, { date: "Trimestre 3", progression: 85 }],
    "Éducation civique": [{ date: "Trimestre 1", progression: 50 }, { date: "Trimestre 2", progression: 65 }, { date: "Trimestre 3", progression: 75 }],
    "Arts plastiques": [{ date: "Trimestre 1", progression: 65 }, { date: "Trimestre 2", progression: 75 }, { date: "Trimestre 3", progression: 70 }],
  },
  "Abdoulaye Sow": { 
    "Histoire": [{ date: "Trimestre 1", progression: 55 }, { date: "Trimestre 2", progression: 70 }, { date: "Trimestre 3", progression: 75 }],
    "Géographie": [{ date: "Trimestre 1", progression: 80 }, { date: "Trimestre 2", progression: 70 }, { date: "Trimestre 3", progression: 70 }],
    "Anglais": [{ date: "Trimestre 1", progression: 45 }, { date: "Trimestre 2", progression: 60 }, { date: "Trimestre 3", progression: 70 }],
  },
  "Aissatou Ba": { 
    "Français": [{ date: "Trimestre 1", progression: 35 }, { date: "Trimestre 2", progression: 45 }, { date: "Trimestre 3", progression: 50 }],
    "Éducation physique et sportive (EPS)": [{ date: "Trimestre 1", progression: 95 }, { date: "Trimestre 2", progression: 85 }, { date: "Trimestre 3", progression: 90 }],
  },
  "Cheikh Gueye": { 
    "Français": [{ date: "Trimestre 1", progression: 80 }, { date: "Trimestre 2", progression: 70 }, { date: "Trimestre 3", progression: 60 }],
    "Informatique": [{ date: "Trimestre 1", progression: 90 }, { date: "Trimestre 2", progression: 75 }, { date: "Trimestre 3", progression: 65 }]
  },
   "Marie Sene": { 
    "Français": [{ date: "Trimestre 1", progression: 95 }, { date: "Trimestre 2", progression: 90 }, { date: "Trimestre 3", progression: 100 }],
    "Anglais": [{ date: "Trimestre 1", progression: 85 }, { date: "Trimestre 2", progression: 95 }, { date: "Trimestre 3", progression: 90 }]
  },
  "Jean Dupont": {
    "Histoire": [{ date: "Trimestre 1", progression: 60 }, { date: "Trimestre 2", progression: 75 }, { date: "Trimestre 3", progression: 70 }],
    "Géographie": [{ date: "Trimestre 1", progression: 55 }, { date: "Trimestre 2", progression: 50 }, { date: "Trimestre 3", progression: 60 }]
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
  
  const [courses, setCourses] = useState<EnrichedCourse[]>([]);
  const [skillOptions, setSkillOptions] = useState<{ value: string, label: string }[]>([]);

  const [selectedStudent, setSelectedStudent] = useState(studentOptions[0].value);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [progressionChartData, setProgressionChartData] = useState<ProgressionPoint[]>([]);

  useEffect(() => {
    const totalStudents = studentCount?.total || 20; // Utilise l'effectif du contexte, avec un fallback de 20

    const enrichedCourses = getEnrichedCourses(navigate).map(course => {
      // Génère un nombre de présents entre 85% et 100% de l'effectif réel
      const presentCount = Math.floor(totalStudents * (0.85 + Math.random() * 0.15));
      const remediationCount = totalStudents - presentCount;

      // Pour les cours terminés, on met tout le monde présent
      if (course.status === 'completed') {
        return { ...course, presentCount: totalStudents, remediationCount: 0 };
      }

      return { ...course, presentCount, remediationCount };
    });

    const coursesForClass = enrichedCourses
      .filter(course => course.classId === currentClasse)
      .slice(0, 4); 
    setCourses(coursesForClass);

    const availableSkills = Array.from(new Set(enrichedCourses
        .filter(course => course.classId === currentClasse)
        .map(course => course.subject)
      ))
      .map(subject => ({ value: subject, label: subject }));
      
    setSkillOptions(availableSkills);
    if (availableSkills.length > 0) {
      setSelectedSkill(availableSkills[0].value);
    } else {
      setSelectedSkill("");
    }
  }, [currentClasse, navigate, studentCount]);

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
    const courseId = `course-${Date.now()}`;
    const newCourse: EnrichedCourse = {
      id: courseId,
      subject: data.subject,
      teacher: teacherName,
      theme: "Nouveau cours",
      title: data.title,
      time: data.time,
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      status: "upcoming" as const,
      nextLessonDate: "À planifier",
      classId: currentClasse,
      domain: "Langues et Communication",
      competences: [],
      presentCount: 0,
      remediationCount: 0,
      onViewDetails: () => navigate(`/mes-cours/${courseId}`)
    };
    setCourses(prevCourses => [newCourse, ...prevCourses].slice(0, 4));
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
      
      {/* Header du thème avec style immersif - dans un conteneur avec padding comme l'emploi du temps */}
      <div className="p-4 md:p-6">
        <CourseDetailHeader title={t('theme_title', 'Thème : Vivre ensemble et respecter les règles de l\'école')} />
      </div>

      {/* Contenu principal avec padding */}
      <div className="flex-1 px-4 md:px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-0 mb-6">
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
          {courses.map((course) => {
            const [startTime, endTime] = course.time.split(' - ').length === 2 
              ? course.time.split(' - ')
              : [course.time, course.time];
            
            return (
              <CourseCard
                key={course.id}
                title={course.title}
                subject={course.subject}
                startTime={startTime}
                endTime={endTime}
                presentCount={course.presentCount}
                absentCount={course.remediationCount}
                onClick={() => navigate(`/mes-cours/${course.id}`)}
              />
            );
          })}
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

        {/* Section Gestion des fournitures */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Gestion des fournitures</h3>
            <button 
              onClick={() => navigate('/fournitures')}
              className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
            >
              {t('view_all', 'Voir tout')}
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800 mb-1">Fournitures de base</h4>
                  <p className="text-sm text-blue-600">Cahiers, stylos, règles, etc.</p>
                  <div className="mt-3 text-2xl font-bold text-blue-800">12</div>
                  <p className="text-xs text-blue-600">articles</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800 mb-1">Fournitures spécifiques</h4>
                  <p className="text-sm text-green-600">Matériel pour activités spéciales</p>
                  <div className="mt-3 text-2xl font-bold text-green-800">5</div>
                  <p className="text-xs text-green-600">articles</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-800 mb-1">Total fournitures</h4>
                  <p className="text-sm text-purple-600">Liste complète</p>
                  <div className="mt-3 text-2xl font-bold text-purple-800">17</div>
                  <p className="text-xs text-purple-600">articles</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-800">Actions rapides</h5>
                    <p className="text-sm text-gray-600">Gérez la liste des fournitures pour votre classe</p>
                  </div>
                  <button
                    onClick={() => navigate('/fournitures')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>Gérer les fournitures</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
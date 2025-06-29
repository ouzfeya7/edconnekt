import { Plus, BarChart2, MessageSquare, Calendar } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import { ActionCard } from '../../components/ui/ActionCard';
import DateCard from '../../components/Header/DateCard';
import ClassNameCard from '../../components/Header/ClassNameCard';
import TrimestreCard from '../../components/Header/TrimestreCard';
import StatsCard from '../../components/Header/StatsCard';
import RemediationCard from '../../components/course/RemediationCard';
import AddFicheModal, { NewFicheData } from '../../components/course/AddFicheModal';
import { mockWeeklySkills, WeeklySkill, mockRemediations, RemediationSession } from '../../lib/mock-data';
import { useStudents } from '../../contexts/StudentContext';
import { useFilters } from '../../contexts/FilterContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authentification/useAuth';
import CourseCard from '../../components/course/CourseCard';

const MesCours = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { studentCount } = useStudents();
  const { 
    currentDate,
    setCurrentDate, 
    currentClasse, 
    setCurrentClasse, 
    currentTrimestre, 
    setCurrentTrimestre 
  } = useFilters();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState<WeeklySkill[]>([]);
  const [remediations, setRemediations] = useState<RemediationSession[]>([]);

  useEffect(() => {
    const skillsForClass = mockWeeklySkills.filter(skill => skill.classId === currentClasse);
    setSkills(skillsForClass);

    const remediationsForClass = mockRemediations.filter(rem => rem.classId === currentClasse);
    setRemediations(remediationsForClass);
  }, [currentClasse]);

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
    setSkills(prevSkills => [newSkill, ...prevSkills]);
    setIsModalOpen(false);
  };

  const actionButtons = [
    { icon: <Plus className="text-orange-500" />, label: t('add_sheet'), onClick: () => setIsModalOpen(true) },
    { icon: <BarChart2 className="text-orange-500" />, label: t('grade_management'), onClick: () => navigate('/gestion-notes') },
    { icon: <MessageSquare className="text-orange-500" />, label: t('send_message'), onClick: () => navigate('/messages', { state: { composeNew: true } }) },
    { icon: <Calendar className="text-orange-500" />, label: t('add_event'), onClick: () => navigate('/calendar', { state: { showAddEventModal: true } }) },
  ];

  return (
    <div className="p-6 bg-[#F5F7FA] min-h-screen">
       <AddFicheModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleAddFiche}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('my_courses')}</h1>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {actionButtons.map((btn, index) => <ActionCard key={index} {...btn} />)}
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DateCard value={currentDate} onChange={setCurrentDate} />
          <ClassNameCard className={currentClasse} onClassChange={setCurrentClasse} />
          <TrimestreCard value={currentTrimestre} onChange={setCurrentTrimestre} />
        </div>
        <div className="md:col-span-1">
          <StatsCard stats={studentCount} />
        </div>
      </div>

      {/* Course Cards */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{t('courses_of_the_day')}</h2>
          <button className="text-blue-600 font-semibold hover:underline text-sm">{t('view_more')}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill, index) => {
          // Génère des heures et des durées de cours réalistes (20-45 min)
          const timeSlots = [
            { start: "8:00", end: "8:45" },   // 45 min
            { start: "9:00", end: "9:30" },   // 30 min
            { start: "10:15", end: "10:35" }, // 20 min
            { start: "11:00", end: "11:45" }, // 45 min
            { start: "14:00", end: "14:25" }, // 25 min
          ];
          const currentTimeSlot = timeSlots[index % timeSlots.length];

          // Calcule les présences/absences en fonction de l'effectif total
          const totalStudents = studentCount?.total || 25; // Fallback
          // Pattern d'absences pour rendre les données plus réalistes
          const absencePattern = [2, 1, 3, 0, 4, 1];
          let absentCount = absencePattern[index % absencePattern.length];
          if (absentCount > totalStudents) {
            absentCount = totalStudents;
          }
          const presentCount = totalStudents - absentCount;

          return (
            <CourseCard
              key={skill.id}
              title={skill.title}
              subject={skill.subject}
              startTime={currentTimeSlot.start}
              endTime={currentTimeSlot.end}
              presentCount={presentCount}
              absentCount={absentCount}
              onClick={() => navigate(`/mes-cours/${skill.id}`)}
            />
          );
        })}
        </div>
      </div>

      {/* Remediation Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('remediation')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {remediations.map((remediation) => (
            <RemediationCard 
              key={remediation.id} 
              remediation={remediation}
              onClick={() => navigate(`/remediations/${remediation.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MesCours; 
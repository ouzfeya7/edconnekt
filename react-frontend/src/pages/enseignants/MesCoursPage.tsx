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
import { mockRemediations, RemediationSession } from '../../lib/mock-data';
import { getEnrichedCourses, EnrichedCourse } from '../../lib/mock-student-data';
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
  const [courses, setCourses] = useState<EnrichedCourse[]>([]);
  const [remediations, setRemediations] = useState<RemediationSession[]>([]);

  useEffect(() => {
    const totalStudents = studentCount?.total || 20;

    const enrichedCourses = getEnrichedCourses(navigate).map(course => {
      const presentCount = Math.floor(totalStudents * (0.85 + Math.random() * 0.15));
      const remediationCount = totalStudents - presentCount;

      if (course.status === 'completed') {
        return { ...course, presentCount: totalStudents, remediationCount: 0 };
      }
      return { ...course, presentCount, remediationCount };
    });

    const coursesForClass = enrichedCourses.filter(course => course.classId === currentClasse);
    setCourses(coursesForClass);

    const remediationsForClass = mockRemediations.filter(rem => rem.classId === currentClasse);
    setRemediations(remediationsForClass);
  }, [currentClasse, navigate, studentCount]);

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
      domain: "Langues et Communication", // Domaine par défaut
      competences: [],
      presentCount: 0,
      remediationCount: 0,
      onViewDetails: () => navigate(`/mes-cours/${courseId}`)
    };
    setCourses(prevCourses => [newCourse, ...prevCourses]);
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
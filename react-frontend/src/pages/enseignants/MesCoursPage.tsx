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
import { mockRemediations, RemediationSession } from '../../lib/mock-data';
import { getEnrichedCourses, EnrichedCourse } from '../../lib/mock-student-data';
import { useStudents } from '../../contexts/StudentContext';
import { useFilters } from '../../contexts/FilterContext';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../components/course/CourseCard';

const MesCours = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { studentCount } = useStudents();
  const { 
    currentDate,
    setCurrentDate, 
    currentClasse, 
    setCurrentClasse, 
    currentTrimestre, 
    setCurrentTrimestre 
  } = useFilters();
  
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


  const actionButtons = [
    { icon: <Plus className="text-orange-500" />, label: t('add_sheet'), onClick: () => {} },
    { icon: <BarChart2 className="text-orange-500" />, label: t('grade_management'), onClick: () => navigate('/gestion-notes') },
    { icon: <MessageSquare className="text-orange-500" />, label: t('send_message'), onClick: () => navigate('/messages', { state: { composeNew: true } }) },
    { icon: <Calendar className="text-orange-500" />, label: t('add_event'), onClick: () => navigate('/calendar', { state: { showAddEventModal: true } }) },
  ];

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* En-tête moderne décoratif */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border border-orange-200/50 p-6">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/15 rounded-full -translate-y-14 translate-x-14"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/15 rounded-full translate-y-10 -translate-x-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full"></div>
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{t('my_courses')}</h1>
        </div>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('remediations_of_the_day', 'Remédiations du jour')}</h2>
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
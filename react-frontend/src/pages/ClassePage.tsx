import React, { useState, useEffect } from 'react';
import StudentList from '../components/classe/StudentLists';
import StudentProfileSection from '../components/eleve/StudentProfileSection';
import ClassHeader from '../components/classe/ClassHeader';
import ClassDetailsCard from '../components/classe/ClassDetailsCard';
import EventCard from '../components/events/EventCard';
import { useEvents } from '../contexts/EventContext';


import { useStudents, Student } from '../contexts/StudentContext';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs'; // Utiliser dayjs pour la gestion des dates
import { useFilters } from '../contexts/FilterContext'; // Importer useFilters

const ClassePage = () => {
  const { t, i18n } = useTranslation();
  const { events } = useEvents();
  const { students, studentCount } = useStudents();
  const { 
    currentClasse, 
    setCurrentClasse, 
    currentDate, 
    setCurrentDate 
  } = useFilters();

  // Mettre à jour la locale de dayjs lorsque la langue change
  dayjs.locale(i18n.language);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Effet pour synchroniser le profil de l'élève avec les mises à jour du contexte
  useEffect(() => {
    if (selectedStudent) {
      const updatedStudent = students.find(s => s.id === selectedStudent.id);
      if (updatedStudent && updatedStudent !== selectedStudent) {
        setSelectedStudent(updatedStudent);
      }
    }
  }, [students, selectedStudent]);

  const mockData = {
    className: "4ème B",
    seriesName: "Series one",
    teacherName: "M. Ibrahima Diouf",
    genderCount: {
      male: 12,
      female: 8,
    },
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-[#F5F7FA]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('my_classes')}</h1>
      
      {/* Grille principale pour la mise en page en deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        
        {/* Colonne de gauche (plus grande) */}
        <div className="lg:col-span-2 space-y-6">
          <ClassHeader 
            currentClasse={currentClasse}
            onClasseChange={setCurrentClasse}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            studentStats={studentCount}
          />
          <StudentList 
            onStudentClick={handleStudentClick}
          />
        </div>

        {/* Colonne de droite (plus petite) */}
        <div className="space-y-6">
          {selectedStudent ? (
            <StudentProfileSection student={selectedStudent} onBack={handleBack} />
          ) : (
            <>
              <ClassDetailsCard 
                className={currentClasse}
                seriesName={mockData.seriesName}
                teacherName={mockData.teacherName}
                genderCount={mockData.genderCount}
              />
              <EventCard events={events} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassePage;
import React, { useState } from 'react';
import StudentList from '../components/classe/StudentLists';
import StudentProfileSection from '../components/eleve/StudentProfileSection';
import ClassHeader from '../components/classe/ClassHeader';
import ClassDetailsCard from '../components/classe/ClassDetailsCard';
import EventCard from '../components/events/EventCard';
import { useEvents } from '../contexts/EventContext';
import { useStudents, Student, StudentStatus } from '../contexts/StudentContext';

const ClassePage = () => {
  const { events } = useEvents();
  const { students, updateStudentStatus, studentCount } = useStudents();

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

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const mockData = {
    className: "4ème B",
    seriesName: "Series one",
    teacherName: "M. Ibrahima Diouf",
    genderCount: {
      male: 12,
      female: 8,
    },
  };

  const [currentClasse, setCurrentClasse] = useState(mockData.className);
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  const handleStudentStatusChange = (studentId: number, status: StudentStatus) => {
    updateStudentStatus(studentId, status);
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-semibold text-[#184867] mb-4">Mes classes</h1>
      
      {/* Grille principale pour la mise en page en deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
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
            students={students} 
            onStudentClick={handleStudentClick}
            onStatusChange={handleStudentStatusChange}
          />
        </div>

        {/* Colonne de droite (plus petite) */}
        <div className="space-y-6">
          {selectedStudent ? (
            <StudentProfileSection student={selectedStudent} onBack={handleBack} />
          ) : (
            <>
              <ClassDetailsCard 
                className={mockData.className}
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
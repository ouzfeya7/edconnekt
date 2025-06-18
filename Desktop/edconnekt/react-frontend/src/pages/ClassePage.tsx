import React, { useState } from 'react';
import StudentList from '../components/classe/StudentLists';
import StudentProfileSection from '../components/eleve/StudentProfileSection';
import ClassHeader from '../components/classe/ClassHeader';
import ClassFilters from '../components/classe/ClassFilters';
import ClassDetailsCard from '../components/classe/ClassDetailsCard';
import EventCard from '../components/events/EventCard';

interface Student {
  id: number;
  name: string;
  competence: string;
  date: string;
  status: 'Présent' | 'Retard' | 'Absent';
  imageUrl?: string;
}

interface FilterState {
  trimestre: string;
  type: string;
  status: string;
}

const ClassePage = () => {
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
  const [filters, setFilters] = useState<FilterState>({
    trimestre: '',
    type: '',
    status: ''
  });

  const mockData = {
    className: "4ème B",
    seriesName: "Series one",
    teacherName: "M. Ibrahima Diouf",
    studentCount: {
      total: 20,
      present: 18,
      retard: 1,
      absent: 1,
    },
    genderCount: {
      male: 12,
      female: 8,
    },
    events: [
      {
        title: "Activite musicale",
        time: "12:00 GMT",
      },
      {
        title: "Activite musicale",
        time: "15:00 GMT",
      },
    ],
  };

  const [currentClasse, setCurrentClasse] = useState(mockData.className);
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      trimestre: '',
      type: '',
      status: ''
    });
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
            studentStats={mockData.studentCount}
          />
          <ClassFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
          <StudentList onStudentClick={handleStudentClick} />
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
              <EventCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassePage;
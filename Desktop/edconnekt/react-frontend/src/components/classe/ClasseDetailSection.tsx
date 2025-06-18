import React, { useState } from 'react';
import ClassHeader from './ClassHeader';
import ClassFilters from './ClassFilters';
import ClassDetailsCard from './ClassDetailsCard';
import StudentList from './StudentLists';

interface FilterState {
  trimestre: string;
  type: string;
  status: string;
}

interface Student {
  id: number;
  name: string;
  competence: string;
  date: string;
  status: 'Présent' | 'Retard' | 'Absent';
  imageUrl?: string;
  ref?: string;
  gender?: string;
  birthDate?: string;
  email?: string;
  address?: string;
  department?: string;
  class?: string;
  admissionDate?: string;
}

interface ClasseDetailSectionProps {
  className: string;
  seriesName: string;
  teacherName: string;
  studentCount: {
    total: number;
    present: number;
    retard: number;
    absent: number;
  };
  genderCount: {
    male: number;
    female: number;
  };
  events: Array<{
    title: string;
    time: string;
  }>;
  onStudentClick: (student: Student) => void;
}

const ClasseDetailSection: React.FC<ClasseDetailSectionProps> = ({
  className,
  seriesName,
  teacherName,
  studentCount,
  genderCount,
  onStudentClick,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    trimestre: '',
    type: '',
    status: ''
  });

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
    <div>
      <ClassHeader 
        currentClasse={className}
        studentStats={studentCount}
        currentDate="Aujourd'hui"
        onDateChange={() => {}}
        onClasseChange={() => {}}
        // currentTrimestre="Trimestre Actuel"
        // onTrimestreChange={() => {}}
      />
      
      <ClassFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      <div className="flex gap-8 mt-6">
        <div className="flex-1">
          <StudentList onStudentClick={onStudentClick} />
        </div>
        <div className="w-80">
          <ClassDetailsCard 
            className={className}
            seriesName={seriesName}
            teacherName={teacherName}
            genderCount={genderCount}
          />
        </div>
      </div>
    </div>
  );
};

export default ClasseDetailSection;
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type StudentStatus = 'Présent' | 'Retard' | 'Absent';

export interface Student {
  id: number;
  name: string;
  competence: string;
  status: StudentStatus;
  imageUrl: string;
  ref: string;
  gender: string;
  birthDate: string;
  email: string;
  address: string;
  department: string;
  class: string;
  admissionDate: string;
}

export const initialStudents: Student[] = new Array(20).fill(null).map((_, i) => ({
  id: i + 1,
  name: i === 0 ? "Khadija Ndiaye" : i === 1 ? "Maty Diop" : `Mouhamed Fall ${i - 1}`,
  imageUrl: `https://i.pravatar.cc/150?u=a042581f4e29026704d${i}`,
  competence: "Lecture anglais",
  status: i % 10 === 5 ? "Retard" : i % 10 === 7 ? "Absent" : "Présent",
  ref: `STU1234${i}`,
  gender: i % 2 === 0 ? 'FÉMININ' : 'MASCULIN',
  birthDate: '01 JANVIER 2010',
  email: `student${i}@example.com`,
  address: 'Dakar, Sénégal',
  department: 'SCIENCES',
  class: '4ème B',
  admissionDate: '01 SEPTEMBRE 2018',
}));

interface StudentCount {
  total: number;
  present: number;
  retard: number;
  absent: number;
}

interface StudentContextType {
  students: Student[];
  updateStudentStatus: (studentId: number, status: StudentStatus) => void;
  studentCount: StudentCount;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [studentCount, setStudentCount] = useState<StudentCount>({
    total: 0,
    present: 0,
    retard: 0,
    absent: 0,
  });

  useEffect(() => {
    const presentCount = students.filter(s => s.status === 'Présent' || s.status === 'Retard').length;
    const retardCount = students.filter(s => s.status === 'Retard').length;
    const absentCount = students.filter(s => s.status === 'Absent').length;
    
    setStudentCount({
      total: students.length,
      present: presentCount,
      retard: retardCount,
      absent: absentCount
    });
  }, [students]);

  const updateStudentStatus = (studentId: number, status: StudentStatus) => {
    setStudents(currentStudents =>
      currentStudents.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  return (
    <StudentContext.Provider value={{ students, updateStudentStatus, studentCount }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}; 